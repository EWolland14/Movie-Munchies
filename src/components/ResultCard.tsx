import React, { useState } from 'react';
import { Movie, FoodOption, Restaurant } from '../types';
import { MovieCard } from './MovieCard';
import { FoodCard } from './FoodCard';
import { LocalSpots } from './LocalSpots';
import { Lock, Check, Share2, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/sound';

interface ResultCardProps {
  movie: Movie;
  food: FoodOption;
  thematicTieIn: string;
  restaurants: Restaurant[];
  location: string;
  isLocked: boolean;
  onLockIn: () => void;
  onRespinMovie: () => void;
  onRespinFood: () => void;
  onRespinBoth: () => void;
  soundEnabled: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  movie,
  food,
  thematicTieIn,
  restaurants,
  location,
  isLocked,
  onLockIn,
  onRespinMovie,
  onRespinFood,
  onRespinBoth,
  soundEnabled,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);

  const handleLockInWithCelebration = () => {
    onLockIn();
    playSuccessSound(soundEnabled);

    // Fire celebratory confetti burst
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#06b6d4', '#8b5cf6', '#ffffff']
      });
    } catch {
      // Ignore if canvas is unsupported
    }
  };

  const handleShareNight = async () => {
    const summary = `🎬 MOVIE & MUNCHIES ORACLE PAIRING 🍿\n` +
      `Film: ${movie.title} (${movie.year}) • ${movie.runtime}m [${movie.streamingPlatform}]\n` +
      `Munchies: ${food.emoji} ${food.genre} - ${food.vibeTitle}\n` +
      `Tie-In: "${thematicTieIn}"\n` +
      `Suggested Order: ${food.curatedOrder.map(o => o.name).join(', ')}\n` +
      `Drink: ${food.drinkPairing}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(summary);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <section className="w-full glass-panel rounded-3xl p-6 sm:p-8 border border-cinema-gold/30 shadow-2xl relative">
      {/* Top Banner Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cinema-crimson to-cinema-gold text-cinema-950 font-black shadow-glow-gold">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cinema-gold">
                The Oracle Has Spoken
              </span>
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" /> Locked In!
                </span>
              )}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white">
              Tonight's Cinematic & Culinary Pairing
            </h3>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Share Button */}
          <button
            onClick={handleShareNight}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all"
            title="Copy pairing summary to clipboard"
          >
            {copiedShare ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Night</span>
              </>
            )}
          </button>

          {/* Respin All */}
          <button
            onClick={onRespinBoth}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold transition-all"
            title="Respin both film and feast"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cinema-gold" />
            <span>Shuffle Both</span>
          </button>

          {/* Lock It In Button */}
          <button
            onClick={handleLockInWithCelebration}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-lg ${
              isLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-cinema-gold to-amber-500 hover:from-amber-400 hover:to-amber-500 text-cinema-950 shadow-glow-gold'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? 'Saved to History!' : 'Lock It In'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Movie on Left, Food on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <MovieCard movie={movie} onRespinMovie={onRespinMovie} />
        <FoodCard food={food} thematicTieIn={thematicTieIn} onRespinFood={onRespinFood} />
      </div>

      {/* Local Spot Finder */}
      <LocalSpots
        restaurants={restaurants}
        genre={food.genre}
        location={location}
      />
    </section>
  );
};
