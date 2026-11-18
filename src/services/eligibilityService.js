/**
 * Eligibility Service for PlayersChoice Game Awards
 * Core rule: Any game can be voted in for this yearly awards show,
 * but MUST have been released at least 1 month prior to the award show date set by the admin.
 */

export function calculateCutoffDate(awardShowDateStr) {
  if (!awardShowDateStr) return null;
  const showDate = new Date(awardShowDateStr);
  if (isNaN(showDate.getTime())) return null;

  // Subtract exactly 30 days (1 month requirement)
  const cutoff = new Date(showDate.getTime() - (30 * 24 * 60 * 60 * 1000));
  return cutoff.toISOString().split('T')[0];
}

export function checkGameEligibility(game, category, awardShowDateStr) {
  if (!game) return { isEligible: false, reason: "Game data missing" };

  // Category specific exemption: Most Anticipated games don't require release
  if (category && (category.id === 'most-anticipated' || category.allowUnreleased)) {
    return {
      isEligible: true,
      reason: "Eligible under Most Anticipated category (upcoming releases permitted)",
      cutoffDateStr: calculateCutoffDate(awardShowDateStr)
    };
  }

  // Admin explicit manual override check
  if (game.isCustomOverride) {
    return {
      isEligible: true,
      reason: "Manually approved by Administrator override",
      cutoffDateStr: calculateCutoffDate(awardShowDateStr)
    };
  }

  if (!game.releaseDate) {
    return {
      isEligible: false,
      reason: "Missing release date — cannot verify 1-month cut-off window",
      cutoffDateStr: calculateCutoffDate(awardShowDateStr)
    };
  }

  const cutoffDateStr = calculateCutoffDate(awardShowDateStr);
  const releaseTime = new Date(game.releaseDate).getTime();
  const cutoffTime = new Date(cutoffDateStr).getTime();
  const showTime = new Date(awardShowDateStr).getTime();

  if (isNaN(releaseTime)) {
    return {
      isEligible: false,
      reason: "Invalid release date format",
      cutoffDateStr
    };
  }

  // Check if unreleased or released after the show
  if (releaseTime > showTime) {
    return {
      isEligible: false,
      reason: `Unreleased title (Releasing ${game.releaseDate}). Must be released by cut-off (${cutoffDateStr})`,
      cutoffDateStr,
      daysToCutoff: Math.ceil((releaseTime - cutoffTime) / (1000 * 60 * 60 * 24))
    };
  }

  // Check 1-month window
  if (releaseTime > cutoffTime) {
    const daysLate = Math.ceil((releaseTime - cutoffTime) / (1000 * 60 * 60 * 24));
    return {
      isEligible: false,
      reason: `Released ${game.releaseDate} — within the 30-day blackout window before the gala. Cut-off was ${cutoffDateStr} (${daysLate} days late)`,
      cutoffDateStr,
      daysLate
    };
  }

  return {
    isEligible: true,
    reason: `Verified eligible: Released ${game.releaseDate} (prior to cut-off ${cutoffDateStr})`,
    cutoffDateStr
  };
}
