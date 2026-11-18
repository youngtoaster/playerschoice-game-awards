import React, { useState } from 'react';
import { useAwards } from '../store/awardsContext';
import { checkGameEligibility } from '../services/eligibilityService';
import { 
  Users, 
  Flame, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Check, 
  ArrowLeft,
  Calendar,
  Trophy
} from 'lucide-react';
import { playSoftClick, playVoteChime } from '../services/audioService';

export default function NominationBoard({ onBackToBallot }) {
  const { 
    games, 
    categories, 
    activeCategory, 
    currentUser, 
    userNominations, 
    submitNomination, 
    settings,
    setIsAuthModalOpen,
    setSelectedGameForModal
  } = useAwards();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  const currentCategory = categories.find(c => c.id === selectedCategory) || categories[0];
  const userNominatedList = userNominations[currentCategory.id] || [];

  // Filter games based on search query
  const filteredGames = games.filter(g => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      g.title.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q) ||
      g.genres.some(gen => gen.toLowerCase().includes(q))
    );
  });

  // Calculate Community Leaderboard for this category
  const communityTallies = currentCategory.communityNominations || {};
  const leaderboard = Object.entries(communityTallies)
    .map(([gameId, count]) => {
      const gameObj = games.find(g => g.id === gameId);
      return { game: gameObj, count };
    })
    .filter(item => item.game != null)
    .sort((a, b) => b.count - a.count);

  const handleNominate = (gameId) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    submitNomination(currentCategory.id, gameId);
  };

  return (
    <div className="w-full pb-16">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => {
              playSoftClick();
              onBackToBallot();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Official Ballot</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-white">
              Community Nomination Submissions
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Player Driven
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            You decide who gets nominated. Select any eligible title below to submit your nomination for{' '}
            <strong className="text-amber-300">{currentCategory.name}</strong>.
          </p>
        </div>

        {/* Category Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-medium">Category:</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              playSoftClick();
              setSelectedCategory(e.target.value);
            }}
            className="bg-obsidian-800 text-sm font-semibold text-amber-300 border border-amber-500/30 rounded-xl px-4 py-2 focus:outline-none focus:border-amber-400"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: 2 Columns on Desktop (Left: Live Community Leaderboard, Right: Search & Nominate) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Live Community Leaderboard (Top Nominated) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="p-5 rounded-2xl bg-obsidian-850 border border-amber-500/20 backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-syne font-bold text-base text-white">
                  Live Player Nominations
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">
                Top contenders
              </span>
            </div>

            {leaderboard.length > 0 ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 7).map((item, index) => {
                  const isOfficialNominee = currentCategory.nominees?.includes(item.game.id);
                  const isUserNominated = userNominatedList.includes(item.game.id);

                  return (
                    <div 
                      key={item.game.id}
                      onClick={() => setSelectedGameForModal(item.game)}
                      className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian-900/80 hover:bg-obsidian-800 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
                    >
                      <span className={`w-6 text-center font-cinzel font-bold text-sm ${
                        index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-200' : index === 2 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        #{index + 1}
                      </span>

                      <img
                        src={item.game.coverUrl}
                        alt={item.game.title}
                        className="w-10 h-12 rounded object-cover border border-white/10"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 truncate">
                          {item.game.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{item.game.developer}</span>
                          {isOfficialNominee && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              Official Ballot
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-extrabold text-amber-400">
                          {item.count.toLocaleString()}
                        </span>
                        <p className="text-[9px] text-slate-500 uppercase">Votes</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-8">
                No nominations yet for this category. Be the first player to submit!
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Search Catalog & Submit Nominations */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-2xl bg-obsidian-850 border border-white/10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h3 className="font-syne font-bold text-base text-white">
                Submit a Nomination for {currentCategory.name}
              </h3>
              <span className="text-xs text-slate-400">
                1-Month Cut-off Enforced
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search any game by title, developer, or genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-obsidian-900 text-sm text-slate-200 placeholder-slate-500 pl-10 pr-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>

            {/* Game List for Nomination */}
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredGames.map((game) => {
                const eligibility = checkGameEligibility(game, currentCategory, settings.showDate);
                const hasNominated = userNominatedList.includes(game.id);

                return (
                  <div
                    key={game.id}
                    className="flex items-center justify-between gap-4 p-3 rounded-xl bg-obsidian-900 border border-white/5 hover:border-white/10 transition-all"
                  >
                    <div 
                      className="flex items-center gap-3 cursor-pointer min-w-0"
                      onClick={() => setSelectedGameForModal(game)}
                    >
                      <img
                        src={game.coverUrl}
                        alt={game.title}
                        className="w-12 h-16 rounded-lg object-cover border border-white/10 flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-white hover:text-amber-300 transition-colors truncate">
                          {game.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{game.developer}</p>
                        
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-black/40 px-1.5 py-0.5 rounded">
                            <Calendar className="w-2.5 h-2.5 text-amber-400" />
                            <span>{game.releaseDate}</span>
                          </span>

                          {eligibility.isEligible ? (
                            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              <span>Eligible</span>
                            </span>
                          ) : (
                            <span 
                              className="text-[10px] text-amber-400 font-semibold flex items-center gap-1"
                              title={eligibility.reason}
                            >
                              <AlertTriangle className="w-3 h-3" />
                              <span>Cut-off Exceeded</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Nomination Trigger */}
                    <div>
                      {hasNominated ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          <Check className="w-3.5 h-3.5" />
                          <span>Nominated</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleNominate(game.id)}
                          disabled={!eligibility.isEligible}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            eligibility.isEligible
                              ? 'bg-amber-500 hover:bg-amber-400 text-obsidian-950 shadow-gold-glow active:scale-95'
                              : 'bg-obsidian-800 text-slate-500 border border-white/5 cursor-not-allowed opacity-50'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Nominate</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
