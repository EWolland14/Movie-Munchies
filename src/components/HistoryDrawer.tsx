import React from 'react';
import { SavedPairing } from '../types';
import { X, Trash2, Calendar, MapPin, Film, RotateCcw } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPairings: SavedPairing[];
  onSelectPairing: (pairing: SavedPairing) => void;
  onDeletePairing: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  savedPairings,
  onSelectPairing,
  onDeletePairing,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cinema-950 border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">📜</span>
              <div>
                <h3 className="font-display font-bold text-lg text-white">
                  Saved Movie Nights
                </h3>
                <p className="text-xs text-slate-400">
                  {savedPairings.length} {savedPairings.length === 1 ? 'pairing' : 'pairings'} locked in
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {savedPairings.length > 0 && (
                <button
                  onClick={onClearAll}
                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Close saved pairings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedPairings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
                <span className="text-5xl opacity-40">🍿</span>
                <p className="font-bold text-slate-300">No locked-in nights yet</p>
                <p className="text-xs text-slate-500 max-w-xs">
                  Whenever you find a winning film & feast combo, hit <span className="text-cinema-gold font-semibold">"Lock It In"</span> to store it here.
                </p>
              </div>
            ) : (
              savedPairings.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-cinema-900/80 border border-white/10 p-4 transition-all hover:border-cinema-gold/40 group"
                >
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 mb-2 border-b border-white/5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      {new Date(item.savedAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-3 h-3 text-cinema-crimson" />
                      {item.location || 'Local Area'}
                    </span>
                  </div>

                  {/* Movie Info */}
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={item.movie.posterUrl}
                      alt={item.movie.title}
                      className="w-12 h-16 rounded-lg object-cover bg-cinema-800 flex-shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-cinema-crimson flex-shrink-0" />
                        <h4 className="font-bold text-sm text-white truncate">
                          {item.movie.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.movie.year} • {item.movie.runtime}m • {item.movie.streamingPlatform}
                      </p>
                    </div>
                  </div>

                  {/* Food Info */}
                  <div className="p-2.5 rounded-xl bg-cinema-850/80 border border-white/5 text-xs">
                    <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{item.food.emoji}</span>
                      <span>{item.food.genre}</span>
                      <span className="text-slate-500 font-normal">({item.food.vibeTitle})</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                      "{item.thematicTieIn}"
                    </p>
                  </div>

                  {/* Item Actions */}
                  <div className="flex items-center justify-between gap-2 mt-3 pt-2">
                    <button
                      onClick={() => {
                        onSelectPairing(item);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cinema-gold/15 text-cinema-gold hover:bg-cinema-gold/25 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Load This Combo
                    </button>

                    <button
                      onClick={() => onDeletePairing(item.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete from history"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
