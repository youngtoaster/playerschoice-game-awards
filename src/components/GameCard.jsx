import React from 'react';
import { useAwards } from '../store/awardsContext';
import { checkGameEligibility } from '../services/eligibilityService';
import { 
  Check, 
  Play, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  Flame, 
  Calendar,
  Lock
} from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function GameCard({ game, category, isNomineeCard = true }) {
  const { 
    settings, 
    currentUser, 
    userVotes, 
    castVote, 
    setSelectedGameForModal,
    setIsAuthModalOpen
  } = useAwards();

  const eligibility = checkGameEligibility(game, category, settings.showDate);
  const isVoted = userVotes[category.id] === game.id;

  // Fake or aggregated community percentage calculation for ballot visualization
  const totalCategoryCommunityNominations = Object.values(category.communityNominations || {}).reduce((a, b) => a + b, 0) || 1;
  const gameNominationCount = category.communityNominations?.[game.id] || 150;
  const percentage = Math.min(100, Math.round((gameNominationCount / totalCategoryCommunityNominations) * 100));

  const handleVoteClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    castVote(category.id, game.id);
  };

  const handleDetailClick = () => {
    playSoftClick();
    setSelectedGameForModal(game);
  };

  return (
    <div 
      onClick={handleDetailClick}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isVoted
          ? 'bg-obsidian-800 border-2 border-amber-400 shadow-gold-glow scale-[1.01]'
          : 'bg-obsidian-850/90 border border-white/10 hover:border-amber-400/50 hover:shadow-xl hover:shadow-black/60 hover:-translate-y-1'
      }`}
    >
      {/* Top Cover Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-obsidian-950">
        <img
          src={game.coverUrl}
          alt={game.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-black/50" />

        {/* Eligibility Badge on top-left */}
        <div className="absolute top-3 left-3 z-10">
          {eligibility.isEligible ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>ELIGIBLE</span>
            </span>
          ) : (
            <span 
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/90 text-amber-300 border border-amber-500/60 backdrop-blur-md shadow-sm"
              title={eligibility.reason}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>CUT-OFF INELIGIBLE</span>
            </span>
          )}
        </div>

        {/* Metacritic / Rating Score badge on top-right */}
        {game.metacriticScore && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold bg-obsidian-900/90 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              {game.metacriticScore}
            </span>
          </div>
        )}

        {/* Hover Trailer Trigger Pill */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-obsidian-950 font-bold text-xs shadow-gold-glow transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Trailer & Specs</span>
          </span>
        </div>

        {/* Release Date overlay at bottom of image */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span className="inline-flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
            <Calendar className="w-3 h-3 text-amber-400" />
            <span>{game.releaseDate || 'TBA'}</span>
          </span>
          <span className="text-slate-400 truncate max-w-[120px]">{game.developer}</span>
        </div>
      </div>

      {/* Card Content & Action Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-syne font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <div className="flex flex-wrap gap-1 mt-1.5">
            {game.genres?.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5">
                {genre}
              </span>
            ))}
          </div>

          {/* Live Community Percentage Bar (if enabled by admin) */}
          {settings.revealVotesLive && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-400">Community Choice</span>
                <span className="font-bold text-amber-400">{percentage}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-obsidian-950 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Voting Action Button */}
        <div className="mt-4 pt-3 border-t border-white/5">
          {isVoted ? (
            <button
              onClick={handleVoteClick}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold bg-amber-400 text-obsidian-950 shadow-gold-glow transition-all"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>YOUR VOTE CAST</span>
            </button>
          ) : (
            <button
              onClick={handleVoteClick}
              disabled={!eligibility.isEligible}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                eligibility.isEligible
                  ? 'bg-obsidian-800 hover:bg-amber-500 text-slate-200 hover:text-obsidian-950 border border-amber-500/30 hover:border-amber-400 active:scale-98 shadow-sm'
                  : 'bg-obsidian-900 text-slate-500 border border-white/5 cursor-not-allowed opacity-60'
              }`}
            >
              {eligibility.isEligible ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-amber-400 group-hover:text-obsidian-950" />
                  <span>Vote for this Game</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Ineligible (Cut-off)</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
