import React from 'react';
import { useAwards } from '../store/awardsContext';
import { 
  Trophy, 
  Palette, 
  BookOpen, 
  Music, 
  Sparkles, 
  Sword, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle2, 
  Award 
} from 'lucide-react';
import { playSoftClick } from '../services/audioService';

const ICON_MAP = {
  Trophy: Trophy,
  Palette: Palette,
  BookOpen: BookOpen,
  Music: Music,
  Sparkles: Sparkles,
  Sword: Sword,
  Shield: Shield,
  Users: Users,
  Clock: Clock,
};

export default function CategoryRail() {
  const { categories, activeCategory, setActiveCategory, userVotes } = useAwards();

  const handleSelect = (catId) => {
    playSoftClick();
    setActiveCategory(catId);
  };

  const currentCatObj = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="w-full">
      {/* Category Pills Scroller */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth">
        {categories.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || Award;
          const isActive = cat.id === activeCategory;
          const hasVoted = Boolean(userVotes[cat.id]);

          return (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 border ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-gold-glow'
                  : 'bg-obsidian-850/80 text-slate-300 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span className="whitespace-nowrap">{cat.name}</span>
              {hasVoted && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Category Description Header */}
      {currentCatObj && (
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-obsidian-850 via-obsidian-800 to-obsidian-850 border border-amber-500/20 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Official Category
              </span>
              {userVotes[currentCatObj.id] && (
                <span className="text-[11px] font-semibold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                  Your Vote Cast
                </span>
              )}
            </div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white tracking-wide">
              {currentCatObj.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
              {currentCatObj.tagline}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <strong className="text-amber-300">{currentCatObj.nominees?.length || 0}</strong> Final Nominees
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
