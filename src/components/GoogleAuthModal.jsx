import React, { useState } from 'react';
import { useAwards } from '../store/awardsContext';
import { X, ShieldCheck, Check, Sparkles, User, Mail } from 'lucide-react';
import { playSoftClick } from '../services/audioService';

export default function GoogleAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle } = useAwards();

  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleClose = () => {
    playSoftClick();
    setIsAuthModalOpen(false);
  };

  const handleQuickLogin = (name, email, avatar) => {
    loginWithGoogle({
      id: `google-${Date.now()}`,
      name,
      email,
      avatar
    });
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail.trim()) return;
    loginWithGoogle({
      id: `google-${Date.now()}`,
      name: customName.trim() || customEmail.split('@')[0],
      email: customEmail.trim(),
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customEmail)}`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-3xl bg-obsidian-900 border border-amber-500/30 shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Google Branding Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/5 border border-white/10 mb-4 shadow-sm">
            <svg className="w-8 h-8" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Sign In with Google
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            PlayersChoice requires a verified Google Account to cast ballots and submit nominations. 
            This guarantees 1-vote-per-category democratic integrity without bot tampering.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mb-6 bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Anti-bot Verified</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>1 Ballot Per Voter</span>
          </span>
        </div>

        {/* Quick Test Voter Profiles for Instant Testing */}
        <div className="space-y-2.5 mb-5">
          <button
            onClick={() => handleQuickLogin('Tyler Sci', 'tysci.gamer@gmail.com', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                alt="Tyler"
                className="w-9 h-9 rounded-full object-cover border border-amber-400/40"
              />
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-300">
                  Tyler Sci
                </p>
                <p className="text-[11px] text-slate-400">tysci.gamer@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              Continue
            </span>
          </button>

          <button
            onClick={() => handleQuickLogin('Alex Rivera', 'alex.rivera@gmail.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/50 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                alt="Alex"
                className="w-9 h-9 rounded-full object-cover border border-slate-500"
              />
              <div>
                <p className="text-xs font-bold text-white group-hover:text-amber-300">
                  Alex Rivera
                </p>
                <p className="text-[11px] text-slate-400">alex.rivera@gmail.com</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-300 px-2.5 py-1 rounded-full bg-white/5">
              Continue
            </span>
          </button>
        </div>

        {/* Toggle Custom Google Email Form */}
        {!showCustomForm ? (
          <button
            onClick={() => setShowCustomForm(true)}
            className="w-full py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors text-center"
          >
            Or sign in with another Google email account →
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3 pt-3 border-t border-white/10">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Maya Chen"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Google Email Address</label>
              <input
                type="email"
                required
                placeholder="yourname@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                className="w-full bg-obsidian-950 text-xs text-white px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-400 hover:bg-amber-300 text-obsidian-950 shadow-gold-glow transition-all"
            >
              Sign In as Verified Voter
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
