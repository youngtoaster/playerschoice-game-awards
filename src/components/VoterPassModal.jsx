import React from 'react';
import { useAwards } from '../store/awardsContext';
import { 
  X, 
  Trophy, 
  ShieldCheck, 
  Sparkles, 
  Share2, 
  Printer, 
  Ticket, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function VoterPassModal() {
  const { 
    isVoterPassModalOpen, 
    setIsVoterPassModalOpen, 
    currentUser, 
    userVotes, 
    categories, 
    games, 
    settings,
    setIsAuthModalOpen 
  } = useAwards();

  if (!isVoterPassModalOpen) return null;

  const handleClose = () => {
    playSoftClick();
    setIsVoterPassModalOpen(false);
  };

  const votedCategoriesCount = Object.keys(userVotes).length;
  const totalCategories = categories.length;
  const progressPercent = Math.round((votedCategoriesCount / totalCategories) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-obsidian-900 border border-amber-500/40 shadow-2xl p-6 sm:p-8 flex flex-col no-scrollbar max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Not Logged In Prompt */}
        {!currentUser ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 text-amber-400">
              <Ticket className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
              Your Digital Voter Pass
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-6 max-w-sm mx-auto">
              Sign in with your Google account to generate your official verified voter pass and track your category ballots.
            </p>
            <button
              onClick={() => {
                setIsVoterPassModalOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="px-6 py-3 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-obsidian-950 shadow-gold-glow"
            >
              Sign In with Google to Unlock Pass
            </button>
          </div>
        ) : (
          /* Collectible 3D Holographic Pass */
          <div>
            <div className="text-center mb-6">
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                Official Credential
              </span>
              <h3 className="font-cinzel text-2xl font-black text-white mt-1">
                DIGITAL VOTER PASS {settings.awardYear}
              </h3>
            </div>

            {/* Holographic Card Container */}
            <div className="relative rounded-2xl p-6 bg-gradient-to-br from-obsidian-850 via-obsidian-800 to-obsidian-950 border border-amber-400/40 shadow-gold-glow overflow-hidden mb-6">
              
              {/* Shimmer sheen overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/5 to-transparent pointer-events-none" />

              {/* Pass Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400/60 shadow-md"
                  />
                  <div>
                    <h4 className="font-syne font-bold text-base text-white">{currentUser.name}</h4>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                    <ShieldCheck className="w-3 h-3" />
                    <span>VERIFIED</span>
                  </span>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    ID #{currentUser.voterNumber}
                  </p>
                </div>
              </div>

              {/* Progress Ring Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-slate-300 font-semibold">Ballot Completion</span>
                  <span className="font-bold text-amber-400">{votedCategoriesCount} of {totalCategories} Awards ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-obsidian-950 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Player Ballot Choices Summary */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {categories.map(cat => {
                  const votedGameId = userVotes[cat.id];
                  const game = games.find(g => g.id === votedGameId);

                  return (
                    <div
                      key={cat.id}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-black/40 border border-white/5"
                    >
                      <span className="text-slate-400 truncate max-w-[140px]">{cat.name}:</span>
                      {game ? (
                        <span className="font-bold text-amber-300 truncate max-w-[180px] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          <span>{game.title}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Not voted yet</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Holographic Watermark Barcode simulation */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>PLAYERSCHOICE-AUTH-KEY-2026</span>
                <span>GLOBAL BALLOT SECURED</span>
              </div>
            </div>

            {/* Share / Print Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  playSoftClick();
                  alert(`Copied link to share your PlayersChoice ${settings.awardYear} Ballot Pass!`);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/10 transition-colors"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>Share Ballot</span>
              </button>

              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-obsidian-950 shadow-gold-glow transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
