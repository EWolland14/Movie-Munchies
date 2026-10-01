import React, { useState } from 'react';
import { Bookmark, Volume2, VolumeX, Users, Check, Edit2, Image } from 'lucide-react';

interface NavbarProps {
  currentUser: string;
  onSelectUser: (user: string) => void;
  savedCount: number;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  casinoVariant: 'floor' | 'ambience';
  onToggleCasinoVariant: () => void;
}

const PRESET_USERS = [
  { name: 'User 1', label: 'User 1 (Host)', emoji: '🍿', badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40' },
  { name: 'User 2', label: 'User 2 (Partner)', emoji: '🍕', badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectUser,
  savedCount,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
  casinoVariant,
  onToggleCasinoVariant,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customName, setCustomName] = useState('');

  const activePreset = PRESET_USERS.find(u => u.name === currentUser);
  const userEmoji = activePreset?.emoji || '👤';

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onSelectUser(customName.trim());
      setIsEditingCustom(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2 select-none">
      <div className="max-w-[1600px] mx-auto liquid-glass-strong rounded-2xl px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between shadow-[0_10px_35px_rgba(0,0,0,0.85)] border border-white/10">
        
        {/* Brand Mark with // NEURAL Style */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 flex items-center justify-center text-base shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              🍿
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-amber-400 text-sm font-bold tracking-tight">//</span>
                <span className="font-display font-black text-base sm:text-lg tracking-tight text-white">
                  MOVIE &amp; MUNCHIES
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-widest bg-amber-400/15 border border-amber-400/40 text-amber-300 rounded-full">
                  ORACLE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Casino Background Variant Switcher */}
          <button
            onClick={onToggleCasinoVariant}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl liquid-pill text-xs font-semibold text-stone-200 transition-all hover:text-white"
            title="Toggle authentic casino background scene"
          >
            <Image className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Scene:</span>
            <span className="font-mono text-amber-300 font-bold uppercase text-[11px]">
              {casinoVariant === 'floor' ? 'Casino Floor' : 'Neon Lounge'}
            </span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl liquid-pill text-xs font-semibold text-stone-200 transition-all hover:text-white flex items-center gap-1.5"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            aria-label="Toggle Sound Effects"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px] font-mono text-amber-300 font-bold">Audio ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden md:inline text-[11px] font-mono text-stone-400">Muted</span>
              </>
            )}
          </button>

          {/* Multi-User Identity Selector for movie-munchies-db */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl liquid-pill text-xs font-semibold text-stone-200 transition-all hover:text-white"
              title="Switch user profile for Watch Together database"
            >
              <span className="text-sm select-none">{userEmoji}</span>
              <span className="hidden md:inline font-mono font-bold">{currentUser}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl liquid-glass-strong border border-amber-500/40 shadow-2xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider px-2 pb-2 border-b border-white/10 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Watch Together As:</span>
                </div>

                <div className="space-y-1.5">
                  {PRESET_USERS.map((user) => (
                    <button
                      key={user.name}
                      onClick={() => {
                        onSelectUser(user.name);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        currentUser === user.name
                          ? 'bg-amber-400/20 text-white border border-amber-400/40'
                          : 'text-stone-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{user.emoji}</span>
                        <span>{user.label}</span>
                      </div>
                      {currentUser === user.name && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </button>
                  ))}
                </div>

                {/* Custom Name Option */}
                <div className="mt-2 pt-2 border-t border-white/10">
                  {isEditingCustom ? (
                    <form onSubmit={handleCustomSubmit} className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Your name..."
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="flex-1 bg-black/80 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 rounded-lg bg-amber-400 text-stone-950 text-xs font-bold"
                      >
                        Set
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsEditingCustom(true)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] text-stone-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Custom profile name...</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Saved Nights Drawer Trigger */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/40 text-amber-300 hover:text-white hover:bg-amber-500/30 font-semibold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
            title="Open saved movie nights from movie-munchies-db"
          >
            <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="hidden sm:inline">Saved Nights</span>
            <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-amber-400 text-stone-950">
              {savedCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};

