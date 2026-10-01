import React from 'react';
import { Bookmark, Volume2, VolumeX } from 'lucide-react';

interface NavbarProps {
  savedCount: number;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-stone-950/80 backdrop-blur-xl">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cinema-crimson via-purple-600 to-cinema-gold p-[2px] shadow-glow-crimson transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-cinema-950 rounded-[14px] flex items-center justify-center">
              <span className="text-2xl select-none">🍿</span>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinema-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cinema-gold"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cinema-gold bg-clip-text text-transparent">
                Movie & Munchies
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-cinema-crimson/20 border border-cinema-crimson/40 text-cinema-crimson rounded-full">
                Oracle
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Curated film & feast pairings • Zero indecision
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Sound Toggle Button */}
          <button
            onClick={onToggleSound}
            className="p-2.5 rounded-xl border border-white/10 bg-cinema-900/60 hover:bg-cinema-800 text-slate-300 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-cinema-gold" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>

          {/* Saved Nights Drawer Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl border border-cinema-gold/30 bg-cinema-gold/10 hover:bg-cinema-gold/20 text-cinema-gold font-medium text-sm transition-all duration-200 shadow-glow-gold/20 hover:shadow-glow-gold/40"
          >
            <Bookmark className="w-4 h-4 fill-cinema-gold/30" />
            <span className="hidden sm:inline">Saved Nights</span>
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full bg-cinema-gold text-cinema-950">
              {savedCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
