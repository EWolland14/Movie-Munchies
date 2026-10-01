import React, { useState } from 'react';
import { SavedPairing } from '../types';
import {
  X,
  Trash2,
  Calendar,
  Film,
  RotateCcw,
  Database,
  Clock,
  Tag,
  Search,
  CheckCircle,
  ChefHat,
  Users,
  UserCheck
} from 'lucide-react';
import { DB_NAME } from '../services/db';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPairings: SavedPairing[];
  currentUser?: string;
  onSelectPairing: (pairing: SavedPairing) => void;
  onDeletePairing: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedPairings,
  currentUser = 'User 1',
  onSelectPairing,
  onDeletePairing,
  onClearAll,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('all');

  if (!isOpen) return null;

  // Extract unique users who have saved movies
  const savedUsers = Array.from(
    new Set(savedPairings.map((p) => p.savedBy || 'User 1'))
  );
  // Ensure User 1 and User 2 are in the list if relevant
  ['User 1', 'User 2'].forEach((u) => {
    if (!savedUsers.includes(u)) savedUsers.push(u);
  });

  // Filter saved pairings
  const filteredPairings = savedPairings.filter((item) => {
    const itemUser = item.savedBy || 'User 1';
    const matchesUser = selectedUserFilter === 'all' || itemUser === selectedUserFilter;

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


  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-lg bg-stone-950 border-l border-amber-500/30 shadow-2xl flex flex-col">
          
          {/* Database Header */}
          <div className="p-5 sm:p-6 border-b border-white/10 bg-stone-900/90 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Database className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-black text-lg text-white tracking-tight">
                      Historical Database
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <p className="text-xs font-mono text-amber-300/80">
                    Database: <strong className="text-amber-200">{DB_NAME}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {savedPairings.length > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg hover:bg-red-500/10 border border-red-500/20 transition-colors font-medium"
                    title="Clear all database records"
                  >
                    Purge DB
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close database viewer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total Records Counter */}
            <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
              <span>
                Total Stored Combinations: <strong className="text-white">{savedPairings.length}</strong>
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                IndexedDB Persistent Storage
              </span>
            </div>

            {/* Search & Category Filter Controls */}
            {savedPairings.length > 0 && (
              <div className="mt-3.5 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search movie title or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950/80 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400/50"
                  />
                </div>

                {/* User / Watch Together Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <button
                    onClick={() => setSelectedUserFilter('all')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      selectedUserFilter === 'all'
                        ? 'bg-amber-400 text-stone-950 shadow-sm'
                        : 'bg-stone-950 text-stone-400 border border-white/5 hover:text-white'
                    }`}
                  >
                    <Users className="w-3 h-3" />
                    <span>All (Watch Together) ({savedPairings.length})</span>
                  </button>
                  {savedUsers.map((user) => {
                    const userCount = savedPairings.filter((p) => (p.savedBy || 'User 1') === user).length;
                    const isSelected = selectedUserFilter === user;
                    const isCurrentUser = user === currentUser;
                    return (
                      <button
                        key={user}
                        onClick={() => setSelectedUserFilter(user)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                          isSelected
                            ? 'bg-purple-500 text-white shadow-sm'
                            : 'bg-stone-950 text-stone-400 border border-white/5 hover:text-white'
                        }`}
                      >
                        <span>{user === 'User 2' ? '🍕' : '🍿'}</span>
                        <span>{user}{isCurrentUser ? ' (You)' : ''} ({userCount})</span>
                      </button>
                    );
                  })}
                </div>

                {/* Category Filters */}
                {uniqueGenres.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
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
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        (item.savedBy || 'User 1') === currentUser
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}>
                        <UserCheck className="w-3 h-3" />
                        Saved by: <strong className="font-mono">{item.savedBy || 'User 1'}{(item.savedBy || 'User 1') === currentUser ? ' (You)' : ''}</strong>
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
