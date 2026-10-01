import React, { useState } from 'react';
import { Bookmark, Volume2, VolumeX, Check, UserPlus, Image, Database } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenCreateAccount: () => void;
  savedCount: number;
  onOpenHistory: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  casinoVariant: 'floor' | 'ambience';
  onToggleCasinoVariant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  onOpenCreateAccount,
  savedCount,
  onOpenHistory,
  soundEnabled,
  onToggleSound,
  casinoVariant,
  onToggleCasinoVariant,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

          {/* USER TAB: Only shows users who have created an account */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                currentUser
                  ? 'liquid-pill text-stone-200 hover:text-white'
                  : 'bg-amber-400/20 border border-amber-400/50 text-amber-300 hover:bg-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
              }`}
              title="User account switcher for movie-munchies-db"
            >
              {currentUser ? (
                <>
                  <span className="text-sm select-none">{currentUser.emoji}</span>
                  <span className="font-mono font-bold">{currentUser.username}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono font-bold">Create Account</span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </>
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl liquid-glass-strong border border-amber-500/40 shadow-2xl p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between px-2 pb-2.5 border-b border-white/10 mb-2.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5" />
                    <span>movie-munchies-db Accounts</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    {allUsers.length} Users
                  </span>
                </div>

                {/* Only users who have created an account appear here! */}
                {allUsers.length === 0 ? (
                  <div className="py-4 px-2 text-center text-xs text-stone-400">
                    <p className="mb-2">No accounts created in <strong className="text-amber-300">movie-munchies-db</strong> yet.</p>
                    <p className="text-[11px] text-stone-500">Create the first account below to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {allUsers.map((user) => (
                      <button
                        key={user.id}
                        onClick={() => {
                          onSelectUser(user);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          currentUser?.username.toLowerCase() === user.username.toLowerCase()
                            ? 'bg-amber-400/20 text-white border border-amber-400/50 shadow-sm'
                            : 'text-stone-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base">{user.emoji}</span>
                          <div className="text-left">
                            <span className="font-bold block text-white">{user.username}</span>
                            <span className="text-[10px] text-stone-400 font-mono">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        {currentUser?.username.toLowerCase() === user.username.toLowerCase() && (
                          <div className="flex items-center gap-1 text-[11px] text-amber-300 font-mono">
                            <Check className="w-3.5 h-3.5 text-amber-400" />
                            <span>Active</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Create Account Trigger Button */}
                <div className="mt-3 pt-2.5 border-t border-white/10">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenCreateAccount();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Create New Account</span>
                  </button>
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


