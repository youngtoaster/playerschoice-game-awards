import React from 'react';
import { useAwards } from '../store/awardsContext';
import CountdownTimer from './CountdownTimer';
import { Trophy, Vote, Users, Flame, ChevronRight, Award, ShieldCheck } from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function HeroBillboard({ onNavigateToBallot, onNavigateToNominations }) {
  const { settings, setIsWinnersModalOpen } = useAwards();

  const phaseLabels = {
    nomination: {
      title: 'COMMUNITY NOMINATION PHASE',
      desc: 'Players worldwide are submitting their nominations to decide who earns a spot on the official ballot.',
      color: 'from-amber-500 to-orange-500'
    },
    voting: {
      title: 'OFFICIAL BALLOT VOTING LIVE',
      desc: 'The official nominees have been locked in by the community. Cast your verified vote for every category.',
      color: 'from-amber-400 via-amber-500 to-yellow-500'
    },
    ceremony: {
      title: 'THE GALA CEREMONY & WINNERS REVEAL',
      desc: 'The votes are in! Experience the triumph of the winners crowned exclusively by players.',
      color: 'from-yellow-300 via-amber-400 to-amber-600'
    }
  };

  const currentPhaseInfo = phaseLabels[settings.currentPhase] || phaseLabels.voting;

  return (
    <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-white/5">
      
      {/* Ambient Radial Spotlight Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[300px] bg-holo-cyan/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Phase Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-widest uppercase mb-6 shadow-gold-glow animate-pulse-subtle">
          <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
          <span>{currentPhaseInfo.title}</span>
        </div>

        {/* Main Cinematic Title */}
        <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 max-w-5xl mx-auto leading-[1.1]">
          THE WORLD'S DEFINITIVE <br className="hidden sm:inline" />
          <span className="gold-gradient-text text-glow-gold">
            PLAYER-VOTED
          </span>{' '}
          GAME AWARDS
        </h1>

        {/* Subtitle / Manifesto */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
          No critic review boards. No industry gatekeeping. Players submit the nominations, and players vote for the ultimate titles of the year.
        </p>

        {/* Dynamic Countdown Stage */}
        <div className="mb-10">
          <CountdownTimer />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <button
            onClick={() => {
              playSoftClick();
              onNavigateToBallot();
            }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-syne text-sm sm:text-base font-bold bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-obsidian-950 hover:brightness-110 shadow-gold-glow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Vote className="w-5 h-5" />
            <span>Cast Official Ballot</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              playSoftClick();
              onNavigateToNominations();
            }}
            className="inline-flex items-center gap-2.5 px-7 py-4 rounded-xl font-syne text-sm sm:text-base font-bold bg-obsidian-800/90 border border-amber-500/30 hover:border-amber-400 text-white hover:bg-obsidian-700/80 transition-all duration-300 shadow-md transform hover:-translate-y-0.5"
          >
            <Users className="w-5 h-5 text-amber-400" />
            <span>Community Submissions</span>
          </button>

          <button
            onClick={() => {
              playSoftClick();
              setIsWinnersModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-4 rounded-xl font-syne text-sm font-semibold bg-white/5 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ceremony Gala</span>
          </button>
        </div>

        {/* Pillars / Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-white/10">
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02]">
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400">100%</span>
            <span className="text-xs text-slate-400 mt-0.5">Player Nominated</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02]">
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400">30-Day</span>
            <span className="text-xs text-slate-400 mt-0.5">Release Cut-off Rule</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02]">
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400">Google ID</span>
            <span className="text-xs text-slate-400 mt-0.5">Anti-Tamper Voting</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-lg bg-white/[0.02]">
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-400">16 Awards</span>
            <span className="text-xs text-slate-400 mt-0.5">Genre & Art Categories</span>
          </div>
        </div>

      </div>
    </section>
  );
}
