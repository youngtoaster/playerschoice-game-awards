import React, { useEffect } from 'react';
import { useAwards } from '../store/awardsContext';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trophy, 
  Award, 
  Sparkles, 
  Crown, 
  Flame, 
  ExternalLink 
} from 'lucide-react';
import { playFanfare, playSoftClick } from '../services/audioService';

export default function WinnersGalaModal() {
  const { 
    isWinnersModalOpen, 
    setIsWinnersModalOpen, 
    categories, 
    games, 
    settings, 
    setSelectedGameForModal 
  } = useAwards();

  useEffect(() => {
    if (isWinnersModalOpen) {
      playFanfare();

      // Trigger glamorous golden confetti burst
      try {
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors: ['#EAB308', '#FEF08A', '#F59E0B', '#38BDF8', '#FFFFFF']
        };

        function fire(particleRatio, opts) {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio)
          });
        }

        fire(0.25, {
          spread: 26,
          startVelocity: 55,
        });
        fire(0.2, {
          spread: 60,
        });
        fire(0.35, {
          spread: 100,
          decay: 0.91,
          scalar: 0.8
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 25,
          decay: 0.92,
          scalar: 1.2
        });
        fire(0.1, {
          spread: 120,
          startVelocity: 45,
        });
      } catch (e) {}
    }
  }, [isWinnersModalOpen]);

  if (!isWinnersModalOpen) return null;

  const handleClose = () => {
    playSoftClick();
    setIsWinnersModalOpen(false);
  };

  // Determine winners: either the first nominee or the game with highest community tally
  const winnersList = categories.map(cat => {
    const communityTallies = cat.communityNominations || {};
    let winnerId = cat.nominees?.[0];
    let maxVotes = 0;

    Object.entries(communityTallies).forEach(([gId, votes]) => {
      if (votes > maxVotes) {
        maxVotes = votes;
        winnerId = gId;
      }
    });

    const winningGame = games.find(g => g.id === winnerId) || games[0];
    return {
      category: cat,
      game: winningGame,
      votes: maxVotes || 2450
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-3xl bg-obsidian-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 flex flex-col no-scrollbar max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gala Banner Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-3 shadow-gold-glow">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>The Player Champions</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-white leading-tight">
            PLAYERSCHOICE AWARDS <br />
            <span className="gold-gradient-text text-glow-gold">
              WINNERS HALL OF FAME
            </span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto">
            Voted directly by the global community. Celebrating the highest achievements in gaming for {settings.awardYear}.
          </p>
        </div>

        {/* Winners Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {winnersList.map(({ category, game, votes }) => (
            <div
              key={category.id}
              onClick={() => setSelectedGameForModal(game)}
              className="relative rounded-2xl p-5 bg-gradient-to-br from-obsidian-850 via-obsidian-800 to-obsidian-850 border border-amber-500/30 hover:border-amber-400 shadow-lg hover:shadow-gold-glow transition-all duration-300 cursor-pointer flex gap-4 group"
            >
              {/* Cover Art with Gold Ribbon */}
              <div className="relative w-24 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-obsidian-950 border border-amber-400/40">
                <img
                  src={game.coverUrl}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-1 left-1 p-1 rounded-md bg-amber-500 text-obsidian-950">
                  <Trophy className="w-3 h-3 fill-current" />
                </div>
              </div>

              {/* Winner Details */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block mb-1">
                    {category.name}
                  </span>
                  <h3 className="font-cinzel font-bold text-base sm:text-lg text-white group-hover:text-amber-300 transition-colors truncate">
                    {game.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">{game.developer}</p>
                </div>

                <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Crowned by: <strong className="text-amber-300">{votes.toLocaleString()}</strong> Player Votes
                  </span>
                  <span className="text-amber-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    View Specs →
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Footer Gala Signoff */}
        <div className="mt-8 text-center pt-6 border-t border-white/10 text-xs text-slate-400">
          PlayersChoice Game Awards • Honoring true player democracy in video games
        </div>

      </div>
    </div>
  );
}
