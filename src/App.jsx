import React, { useState, useRef } from 'react';
import { useAwards } from './store/awardsContext';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import HeroBillboard from './components/HeroBillboard';
import CategoryRail from './components/CategoryRail';
import BallotGrid from './components/BallotGrid';
import NominationBoard from './components/NominationBoard';
import GameDetailModal from './components/GameDetailModal';
import GoogleAuthModal from './components/GoogleAuthModal';
import AdminCommandModal from './components/AdminCommandModal';
import VoterPassModal from './components/VoterPassModal';
import WinnersGalaModal from './components/WinnersGalaModal';
import Footer from './components/Footer';
import { Vote, Users, Award, ShieldAlert, Sparkles } from 'lucide-react';
import { playSoftClick } from './services/audioService';

export default function App() {
  const { settings, cutoffDate } = useAwards();
  const [currentView, setCurrentView] = useState('ballot'); // 'ballot' | 'nominations'
  const ballotSectionRef = useRef(null);

  const scrollToBallot = () => {
    setCurrentView('ballot');
    if (ballotSectionRef.current) {
      ballotSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navigateToNominations = () => {
    setCurrentView('nominations');
    if (ballotSectionRef.current) {
      ballotSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-obsidian-900 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* 60fps Golden Stardust Embers Particle Canvas */}
      <ParticleCanvas />

      {/* Floating Navbar */}
      <Navbar />

      {/* Hero Billboard Stage with Countdown */}
      <HeroBillboard
        onNavigateToBallot={scrollToBallot}
        onNavigateToNominations={navigateToNominations}
      />

      {/* Main Interactive Awards Center */}
      <main ref={ballotSectionRef} className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {/* View Switcher Controls (Ballot vs Community Nominations) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          
          <div className="flex items-center gap-2 p-1 rounded-2xl bg-obsidian-950/80 border border-white/10 shadow-inner">
            <button
              onClick={() => {
                playSoftClick();
                setCurrentView('ballot');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'ballot'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-obsidian-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Vote className="w-4 h-4" />
              <span>Official Category Ballot</span>
            </button>

            <button
              onClick={() => {
                playSoftClick();
                setCurrentView('nominations');
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentView === 'nominations'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-obsidian-950 shadow-gold-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Community Nominations</span>
            </button>
          </div>

          {/* Quick Eligibility Cutoff Banner */}
          <div className="inline-flex items-center gap-2 text-xs text-slate-300 bg-obsidian-850 px-3.5 py-2 rounded-xl border border-amber-500/20">
            <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Game Cut-off: <strong className="text-amber-300 font-bold">{cutoffDate}</strong> (1 month prior)
            </span>
          </div>

        </div>

        {/* View Content */}
        {currentView === 'ballot' ? (
          <div className="space-y-6">
            <CategoryRail />
            <BallotGrid onOpenNominationBoard={() => setCurrentView('nominations')} />
          </div>
        ) : (
          <NominationBoard onBackToBallot={() => setCurrentView('ballot')} />
        )}

      </main>

      {/* Global Modals */}
      <GameDetailModal />
      <GoogleAuthModal />
      <AdminCommandModal />
      <VoterPassModal />
      <WinnersGalaModal />

      {/* Luxury Footer */}
      <Footer />

    </div>
  );
}
