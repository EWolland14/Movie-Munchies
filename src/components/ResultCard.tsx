import React, { useState } from 'react';
import { Movie, FoodOption, Restaurant } from '../types';
import { MovieCard } from './MovieCard';
import { FoodCard } from './FoodCard';
import { LocalSpots } from './LocalSpots';
import { Lock, Check, Share2, Sparkles, RefreshCw, Film, Cookie } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/sound';
import { VibeStakeTier } from './Casino/VibeStakesBar';

interface ResultCardProps {
  movie: Movie;
  companionMovie?: Movie | null;
  stakeTier?: VibeStakeTier;
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
  companionMovie,
  stakeTier = 'casual',
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

    try {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#e11d48', '#f59e0b', '#06b6d4', '#8b5cf6', '#ffd700']
      });
    } catch {
      // Ignore
    }
  };

  const handleShareNight = async () => {
    let summary = `🎬 MOVIE & MUNCHIES ORACLE CASINO PAIRING 🍿\n` +
      `Feature: ${movie.title} (${movie.year}) • ${movie.runtime}m [${movie.streamingPlatform}]\n`;

    if (stakeTier === 'double-feature' && companionMovie) {
      summary += `Double Feature Sequel: ${companionMovie.title} (${companionMovie.year}) • ${companionMovie.runtime}m [${companionMovie.streamingPlatform}]\n`;
    }

    summary += `Feast: ${food.emoji} ${food.genre} - ${food.vibeTitle}\n` +
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
    <section className="w-full glass-panel rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(245,158,11,0.2)] relative">
      
      {/* Top Banner Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-red-600 via-amber-500 to-yellow-400 text-stone-950 font-black shadow-[0_0_15px_rgba(245,158,11,0.6)]">
            <Sparkles className="w-5 h-5 text-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-black uppercase tracking-wider text-amber-400">
                ★ Casino Jackpot Payout ★
              </span>
              {isLocked && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                  <Check className="w-3 h-3" /> Locked In!
                </span>
              )}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-black text-white">
              Tonight's Curated Film &amp; Feast Jackpot
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
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Shuffle Combo</span>
          </button>

          {/* Lock It In Button */}
          <button
            onClick={handleLockInWithCelebration}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all duration-200 shadow-lg ${
              isLocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-stone-950 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>{isLocked ? 'Locked in History!' : 'Lock It In'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Movie on Left, Food on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <MovieCard movie={movie} onRespinMovie={onRespinMovie} />
        <FoodCard
          food={food}
          thematicTieIn={thematicTieIn}
          onRespinFood={onRespinFood}
          soundEnabled={soundEnabled}
        />
      </div>

      {/* Double Feature Companion Card (if Double Feature Stake active) */}
      {stakeTier === 'double-feature' && companionMovie && (
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-red-950/60 via-stone-900/80 to-stone-900 border border-red-500/40 shadow-lg">
          <div className="flex items-center gap-2 text-xs font-mono font-black uppercase tracking-wider text-red-400 mb-3">
            <Film className="w-4 h-4" />
            High Roller Double Feature: Companion Sequel Film
          </div>
          <MovieCard movie={companionMovie} onRespinMovie={onRespinMovie} />
        </div>
      )}

      {/* Midnight Feast Bonus Banner (if Midnight Binge Stake active) */}
      {stakeTier === 'midnight-binge' && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-stone-900 to-stone-900 border border-purple-500/40 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-sm block">Midnight Munchie Bonus Unlocked!</span>
              <span className="text-purple-300">
                The Oracle recommends adding a <strong>Warm Skillet Cookie with Vanilla Bean Ice Cream</strong> or a <strong>Craft Midnight Milkshake</strong>.
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 whitespace-nowrap">
            Bonus Treat Included
          </span>
        </div>
      )}

      {/* Local Spot Finder */}
      <LocalSpots
        restaurants={restaurants}
        genre={food.genre}
        location={location}
      />
    </section>
  );
};
