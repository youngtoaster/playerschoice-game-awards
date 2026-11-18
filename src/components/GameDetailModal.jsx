import React from 'react';
import { useAwards } from '../store/awardsContext';
import { checkGameEligibility } from '../services/eligibilityService';
import { 
  X, 
  Play, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle, 
  Trophy, 
  Flame, 
  Check, 
  Layers, 
  Building2,
  Tv
} from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function GameDetailModal() {
  const { 
    selectedGameForModal, 
    setSelectedGameForModal, 
    categories, 
    activeCategory, 
    settings, 
    currentUser, 
    userVotes, 
    castVote, 
    setIsAuthModalOpen 
  } = useAwards();

  if (!selectedGameForModal) return null;

  const currentCatObj = categories.find(c => c.id === activeCategory) || categories[0];
  const eligibility = checkGameEligibility(selectedGameForModal, currentCatObj, settings.showDate);
  const isVoted = userVotes[currentCatObj.id] === selectedGameForModal.id;

  const handleClose = () => {
    playSoftClick();
    setSelectedGameForModal(null);
  };

  const handleVote = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    castVote(currentCatObj.id, selectedGameForModal.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-obsidian-900 border border-amber-500/30 shadow-2xl flex flex-col no-scrollbar">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-black border border-white/10 transition-colors shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media Billboard / Hero Banner */}
        <div className="relative w-full aspect-video max-h-[360px] bg-obsidian-950 overflow-hidden">
          {selectedGameForModal.trailerUrl ? (
            <iframe
              src={selectedGameForModal.trailerUrl}
              title={`${selectedGameForModal.title} Trailer`}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <img
              src={selectedGameForModal.bannerUrl || selectedGameForModal.coverUrl}
              alt={selectedGameForModal.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8 -mt-6 relative z-10">
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {eligibility.isEligible ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Eligible for Player Voting</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/50">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cut-off Rule Ineligible</span>
                  </span>
                )}

                <span className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
                  Released: {selectedGameForModal.releaseDate || 'TBA'}
                </span>
              </div>

              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-white">
                {selectedGameForModal.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{selectedGameForModal.developer}</span>
                </span>
                <span>•</span>
                <span>{selectedGameForModal.publisher}</span>
              </p>
            </div>

            {/* Metacritic & Community Badges */}
            <div className="flex items-center gap-3">
              {selectedGameForModal.metacriticScore && (
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-obsidian-850 border border-amber-500/30 min-w-[70px]">
                  <span className="text-xl font-black text-amber-400 font-cinzel">
                    {selectedGameForModal.metacriticScore}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Metacritic</span>
                </div>
              )}
              {selectedGameForModal.communityRating && (
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-obsidian-850 border border-amber-500/30 min-w-[70px]">
                  <span className="text-xl font-black text-emerald-400 font-cinzel">
                    {selectedGameForModal.communityRating}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Players</span>
                </div>
              )}
            </div>
          </div>

          {/* Detailed 1-Month Cut-off Rule Audit Banner */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 mb-6">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>1-Month Award Show Release Cut-off Breakdown</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
              <div>Award Show Date: <strong className="text-white">{new Date(settings.showDate).toLocaleDateString()}</strong></div>
              <div>Eligibility Cut-off: <strong className="text-amber-300">{eligibility.cutoffDateStr}</strong></div>
              <div>Verdict: <strong className={eligibility.isEligible ? "text-emerald-400" : "text-amber-400"}>{eligibility.reason}</strong></div>
            </div>
          </div>

          {/* Synopsis */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Synopsis & Overview
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed">
              {selectedGameForModal.synopsis}
            </p>
          </div>

          {/* Metadata Specs Grid (Genres, Platforms, Awards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-obsidian-850 border border-white/5">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Genres</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedGameForModal.genres?.map((genre, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 border border-white/10 font-medium">
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-obsidian-850 border border-white/5">
              <span className="text-xs font-semibold text-slate-400 block mb-2">Platforms</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedGameForModal.platforms?.map((plat, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                    {plat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Voting Action Bar */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div>
              <span className="text-xs text-slate-400 block">Voting in Category:</span>
              <span className="text-sm font-bold text-white font-syne">{currentCatObj.name}</span>
            </div>

            {isVoted ? (
              <button
                onClick={handleVote}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-amber-400 text-obsidian-950 shadow-gold-glow"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>YOUR BALLOT CHOICE</span>
              </button>
            ) : (
              <button
                onClick={handleVote}
                disabled={!eligibility.isEligible}
                className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  eligibility.isEligible
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-obsidian-950 shadow-gold-glow hover:brightness-110 active:scale-95'
                    : 'bg-obsidian-800 text-slate-500 border border-white/10 cursor-not-allowed opacity-50'
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Vote for this Title</span>
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
