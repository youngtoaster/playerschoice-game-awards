import React from 'react';
import { useAwards } from '../store/awardsContext';
import { Trophy, ShieldCheck, Heart, Sparkles, Sliders } from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function Footer() {
  const { settings, cutoffDate, setIsAdminModalOpen } = useAwards();

  return (
    <footer className="relative bg-obsidian-950 border-t border-amber-500/15 text-slate-400 py-16 overflow-hidden">
      
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          
          {/* Brand Column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 text-obsidian-950 p-1.5 shadow-gold-glow">
                <Trophy className="w-full h-full fill-current" />
              </div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                PLAYERSCHOICE GAME AWARDS
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mb-4">
              The premier interactive awards platform built by players, for players. 
              We believe the genuine consensus of the gaming community should define the greatest achievements of our era.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Current Gala Cut-off: <strong className="text-amber-400">{cutoffDate}</strong></span>
            </div>
          </div>

          {/* Award Rules */}
          <div>
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-white mb-3">
              Player Rules
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors">• 1 Verified Vote Per Category</li>
              <li className="hover:text-white transition-colors">• Community Nominations Drive Ballots</li>
              <li className="hover:text-white transition-colors">• 30-Day Release Cut-Off Rule</li>
              <li className="hover:text-white transition-colors">• Google Anti-Tamper Authentication</li>
            </ul>
          </div>

          {/* Quick Access & Admin */}
          <div>
            <h4 className="font-syne font-bold text-xs uppercase tracking-widest text-white mb-3">
              Platform Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => {
                    playSoftClick();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-amber-300 transition-colors"
                >
                  Return to Top
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    playSoftClick();
                    setIsAdminModalOpen(true);
                  }}
                  className="hover:text-amber-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Command Suite</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {settings.awardYear} PlayersChoice Game Awards. An independent player-directed celebration.
          </p>
          <p className="flex items-center gap-1">
            <span>Crafted for true gamers with</span>
            <Heart className="w-3.5 h-3.5 text-amber-500 fill-current" />
            <span>and democratic integrity</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
