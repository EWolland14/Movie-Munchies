import React, { useState } from 'react';
import { Bookmark, Volume2, VolumeX, Users, Check, Edit2 } from 'lucide-react';

interface NavbarProps {
  currentUser: string;
  onSelectUser: (user: string) => void;
  savedCount: number;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
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
              Curated film & feast pairings • Shared Watch Together DB
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Multi-User Identity Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 bg-stone-900/80 hover:bg-stone-800 text-xs font-semibold text-stone-200 transition-all shadow-sm"
              title="Switch user profile"
            >
              <span className="text-base select-none">{userEmoji}</span>
              <span className="hidden md:inline font-mono">{currentUser}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse hidden sm:inline" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-stone-900 border border-amber-500/30 shadow-2xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider px-2 pb-2 border-b border-white/10 mb-2">
                  <Users className="w-3.5 h-3.5" />
                  <span>Watching Together As:</span>
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
                        className="flex-1 bg-stone-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-amber-400"
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
            className="relative flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-cinema-gold/30 bg-cinema-gold/10 hover:bg-cinema-gold/20 text-cinema-gold font-medium text-xs sm:text-sm transition-all duration-200 shadow-glow-gold/20 hover:shadow-glow-gold/40"
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

