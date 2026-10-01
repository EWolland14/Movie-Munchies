import React, { useState } from 'react';
import { SavedPairing, UserProfile } from '../types';
import {
  X,
  Calendar,
  Film,
  RotateCcw,
  Database,
  Clock,
  Tag,
  Search,
  CheckCircle,
  Users,
  ChefHat,
  UserPlus,
  Trash2
} from 'lucide-react';
import { DB_NAME } from '../services/db';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPairings: SavedPairing[];
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  onSelectPairing: (pairing: SavedPairing) => void;
  onDeletePairing: (id: string) => void;
  onClearAll: (userFilter?: string) => void;
  onOpenCreateAccount: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedPairings,
  currentUser,
  allUsers,
  onSelectPairing,
  onDeletePairing,
  onClearAll,
  onOpenCreateAccount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Build list of distinct users: merge registered users + any saved usernames
  const knownUsernames = new Map<string, { username: string; emoji: string }>();
  allUsers.forEach((u) => {
    knownUsernames.set(u.username.toLowerCase(), { username: u.username, emoji: u.emoji || '🍿' });
  });
  savedPairings.forEach((p) => {
    if (p.savedBy) {
      const key = p.savedBy.toLowerCase();
      if (!knownUsernames.has(key)) {
        knownUsernames.set(key, { username: p.savedBy, emoji: p.savedByAvatar || '🍿' });
      }
    }
  });

  const distinctUsers = Array.from(knownUsernames.values());

  // Filter saved pairings
  const filteredPairings = savedPairings.filter((item) => {
    const itemUser = item.savedBy || 'Guest';
    const matchesUser =
      selectedUserFilter === 'all' ||
      itemUser.toLowerCase() === selectedUserFilter.toLowerCase();

    const matchesSearch =
      searchQuery === '' ||
      item.movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.movie.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.food.vibeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itemUser.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === 'all' || item.movie.genres.includes(selectedGenre as any);

    return matchesUser && matchesSearch && matchesGenre;
  });

  // Extract unique genres across saved pairings
  const uniqueGenres = Array.from(
    new Set(savedPairings.flatMap((p) => p.movie.genres))
  );

  const selectedPersonObj = distinctUsers.find(
    (u) => u.username.toLowerCase() === selectedUserFilter.toLowerCase()
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-xl liquid-glass-strong border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Database Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-stone-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                  <Database className="w-5 h-5 text-stone-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg sm:text-xl text-white tracking-tight">
                      Historical Database
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE SYNC
                    </span>
                  </div>
                  <p className="text-xs font-mono text-amber-300">
                    Database Name: <strong className="text-amber-200 underline">{DB_NAME}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close database viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total Stored Records Counter */}
            <div className="flex items-center justify-between text-xs text-stone-300 pt-1">
              <span>
                Total Stored Combinations: <strong className="text-amber-300 font-bold">{savedPairings.length}</strong>
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Shared Multi-User Database
              </span>
            </div>

            {/* SEE EACH PERSON'S DATABASE SECTION */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>See Each Person's Database:</span>
                </span>
                <button
                  onClick={onOpenCreateAccount}
                  className="text-[11px] font-mono text-amber-300 hover:text-white flex items-center gap-1 hover:underline"
                >
                  <UserPlus className="w-3 h-3" />
                  <span>+ Add Person</span>
                </button>
              </div>

              {/* Person-by-Person Database Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {/* Watch Together All Databases */}
                <button
                  onClick={() => setSelectedUserFilter('all')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedUserFilter === 'all'
                      ? 'bg-amber-400 text-stone-950 shadow-md font-black'
                      : 'bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Watch Together (All)</span>
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/25 font-mono">
                    {savedPairings.length}
                  </span>
                </button>

                {/* Each Individual Person's Database Tab */}
                {distinctUsers.map((user) => {
                  const userCount = savedPairings.filter(
                    (p) => (p.savedBy || '').toLowerCase() === user.username.toLowerCase()
                  ).length;
                  const isSelected = selectedUserFilter.toLowerCase() === user.username.toLowerCase();
                  const isCurrent = currentUser?.username.toLowerCase() === user.username.toLowerCase();

                  return (
                    <button
                      key={user.username}
                      onClick={() => setSelectedUserFilter(user.username)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950 shadow-md font-black'
                          : 'bg-white/5 border border-white/10 text-stone-300 hover:text-white hover:bg-white/10'
                      }`}
                      title={`View ${user.username}'s personal saved database`}
                    >
                      <span className="text-sm">{user.emoji}</span>
                      <span>{user.username}'s Database</span>
                      {isCurrent && (
                        <span className="text-[9px] px-1 rounded bg-black/30 font-normal">You</span>
                      )}
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/25 font-mono">
                        {userCount}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Database Sub-Banner */}
            {selectedUserFilter !== 'all' && selectedPersonObj && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-amber-200">
                  <span className="text-base">{selectedPersonObj.emoji}</span>
                  <span>
                    Viewing <strong>{selectedPersonObj.username}'s</strong> private database in{' '}
                    <code className="text-amber-400 font-mono">{DB_NAME}</code>
                  </span>
                </div>
                <button
                  onClick={() => onClearAll(selectedPersonObj.username)}
                  className="text-[11px] text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                  title={`Clear only ${selectedPersonObj.username}'s saved picks`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            )}

            {/* Search & Category Filter Controls */}
            {savedPairings.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search movie title, category, or food in database..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950/80 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* Category Filters */}
                {uniqueGenres.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                    <button
                      onClick={() => setSelectedGenre('all')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                        selectedGenre === 'all'
                          ? 'bg-amber-400 text-stone-950'
                          : 'bg-stone-950 text-stone-400 border border-white/5 hover:text-white'
                      }`}
                    >
                      All Categories
                    </button>
                    {uniqueGenres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                          selectedGenre === genre
                            ? 'bg-amber-400 text-stone-950'
                            : 'bg-stone-950 text-stone-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {savedPairings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl mb-1">
                  💾
                </div>
                <p className="font-bold text-stone-200 text-base">No database records yet</p>
                <p className="text-xs text-stone-400 max-w-xs leading-relaxed">
                  Whenever you find a winning film & feast combo, click <span className="text-amber-400 font-bold">"Lock It In"</span> to write it directly to the <span className="font-mono text-amber-300 font-semibold">{DB_NAME}</span> historical database.
                </p>
              </div>
            ) : filteredPairings.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No database records match your filter.
              </div>
            ) : (
              filteredPairings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-stone-900/90 border border-white/10 p-4 transition-all hover:border-amber-400/40 shadow-lg space-y-3"
                >
                  {/* Database Metadata Header */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-stone-400 pb-2 border-b border-white/5 gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        {DB_NAME}
                      </span>
                      {/* Saved By User Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        currentUser && (item.savedBy || '').toLowerCase() === currentUser.username.toLowerCase()
                          ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-sm'
                          : 'bg-stone-800 text-stone-300 border-white/10'
                      }`}>
                        <span>{item.savedByAvatar || '👤'}</span>
                        <span>Saved by: <strong className="font-mono">{item.savedBy || 'Guest'}{currentUser && (item.savedBy || '').toLowerCase() === currentUser.username.toLowerCase() ? ' (You)' : ''}</strong></span>
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-stone-400">
                      <Calendar className="w-3 h-3 text-stone-500" />
                      {new Date(item.savedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Individual Movie & Specs */}
                  <div className="flex items-start gap-3">
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-14 h-20 rounded-xl object-cover bg-stone-950 flex-shrink-0 border border-white/10 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                        <h4 className="font-bold text-sm text-white truncate">
                          {item.movie.title}
                        </h4>
                      </div>
                      
                      {/* Movie Category Set */}
                      <div className="flex flex-wrap items-center gap-1 mt-1.5">
                        <Tag className="w-3 h-3 text-amber-400 flex-shrink-0" />
                        {item.movie.genres.map((genre) => (
                          <span
                            key={genre}
                            className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>

                      {/* Runtime Set & Platform */}
                      <div className="flex items-center gap-2 text-xs text-stone-300 mt-1.5 font-medium">
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <strong>Runtime:</strong> {item.movie.runtime}m ({item.movie.runtimeCategory})
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {item.movie.streamingPlatform}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Food & Recipe Info */}
                  <div className="p-3 rounded-xl bg-stone-950/80 border border-white/5 text-xs space-y-1">
                    <div className="font-bold text-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span>{item.food.emoji}</span>
                        <span>{item.food.genre}: {item.food.vibeTitle}</span>
                      </div>
                      {item.food.recipe && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <ChefHat className="w-3 h-3 text-emerald-400" />
                          Recipe Stored
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 line-clamp-1 italic pt-0.5">
                      "{item.thematicTieIn}"
                    </p>
                  </div>

                  {/* Actions & DB Key */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                    <button
                      onClick={() => {
                        onSelectPairing(item);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-amber-400 text-stone-950 hover:bg-amber-300 transition-colors shadow-sm"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Load This Combo
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-stone-500 hidden sm:inline">
                        ID: {item.id.slice(-6)}
                      </span>
                      <button
                        onClick={() => onDeletePairing(item.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete from database"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
