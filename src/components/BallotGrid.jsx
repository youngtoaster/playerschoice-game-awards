import React from 'react';
import { useAwards } from '../store/awardsContext';
import GameCard from './GameCard';
import { PlusCircle, Search, Sparkles } from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function BallotGrid({ onOpenNominationBoard }) {
  const { games, categories, activeCategory, searchQuery } = useAwards();

  const currentCategory = categories.find(c => c.id === activeCategory) || categories[0];

  // Resolve nominee game objects
  const nomineeIds = currentCategory?.nominees || [];
  let displayedGames = games.filter(g => nomineeIds.includes(g.id));

  // Apply search query filter if user typed in navbar
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedGames = games.filter(g => 
      g.title.toLowerCase().includes(q) ||
      g.developer.toLowerCase().includes(q) ||
      g.genres.some(genre => genre.toLowerCase().includes(q))
    );
  }

  return (
    <div className="w-full">
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400 bg-white/5 p-3 rounded-xl border border-white/10">
          <span>Search results for: <strong className="text-amber-400">"{searchQuery}"</strong> ({displayedGames.length} games found)</span>
        </div>
      )}

      {displayedGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              category={currentCategory}
              isNomineeCard={true}
            />
          ))}

          {/* Player Custom Nomination Card */}
          <div 
            onClick={() => {
              playSoftClick();
              onOpenNominationBoard();
            }}
            className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-amber-500/30 hover:border-amber-400 bg-obsidian-850/40 hover:bg-obsidian-800/80 transition-all duration-300 cursor-pointer min-h-[360px] text-center"
          >
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-amber-400 transition-all shadow-gold-glow">
              <PlusCircle className="w-7 h-7 text-amber-400" />
            </div>
            <h4 className="font-syne font-bold text-lg text-white mb-2">
              Nominate Another Game
            </h4>
            <p className="text-xs text-slate-400 max-w-xs mb-5">
              Don't see your favorite title? Submit your nomination to the community leaderboard.
            </p>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 group-hover:bg-amber-500 group-hover:text-obsidian-950 transition-all">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Browse All & Nominate</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-obsidian-850/50 rounded-2xl border border-white/10 p-8">
          <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No Nominees Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            There are no games matching your current query for {currentCategory.name}.
          </p>
          <button
            onClick={() => onOpenNominationBoard()}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-obsidian-950 shadow-gold-glow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nominate a Game for this Award</span>
          </button>
        </div>
      )}
    </div>
  );
}
