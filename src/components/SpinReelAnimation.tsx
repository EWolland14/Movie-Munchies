import React, { useEffect, useState } from 'react';
import { Sparkles, Dices, Film } from 'lucide-react';
import { MOCK_MOVIES } from '../data/mockMovies';
import { MOCK_FOODS } from '../data/mockFoods';
import { playTickSound } from '../utils/sound';

interface SpinReelAnimationProps {
  isSpinning: boolean;
  onSpin: () => void;
  soundEnabled: boolean;
}

export const SpinReelAnimation: React.FC<SpinReelAnimationProps> = ({
  isSpinning,
  onSpin,
  soundEnabled,
}) => {
  const [reelMovieIndex, setReelMovieIndex] = useState(0);
  const [reelFoodIndex, setReelFoodIndex] = useState(0);

  useEffect(() => {
    if (!isSpinning) return;

    let intervalTime = 60;
    let timerId: ReturnType<typeof setTimeout>;

    const runReel = () => {
      setReelMovieIndex((prev) => (prev + 1) % MOCK_MOVIES.length);
      setReelFoodIndex((prev) => (prev + 1) % MOCK_FOODS.length);
      playTickSound(soundEnabled);

      timerId = setTimeout(runReel, intervalTime);
      intervalTime += 12; // slow down gradually
    };

    timerId = setTimeout(runReel, intervalTime);

    return () => clearTimeout(timerId);
  }, [isSpinning, soundEnabled]);

  return (
    <div className="flex flex-col items-center justify-center my-8">
      {/* Primary CTA Button */}
      <button
        type="button"
        disabled={isSpinning}
        onClick={onSpin}
        className={`group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 rounded-2xl font-display font-black text-lg sm:text-2xl text-white tracking-wide transition-all duration-300 transform active:scale-95 ${
          isSpinning
            ? 'bg-slate-800 cursor-not-allowed border border-white/20'
            : 'bg-gradient-to-r from-cinema-crimson via-purple-600 to-cinema-gold hover:opacity-95 shadow-glow-crimson hover:shadow-glow-gold hover:-translate-y-1'
        }`}
      >
        {/* Glowing border ring effect */}
        <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cinema-crimson via-purple-600 to-cinema-gold opacity-30 blur-lg group-hover:opacity-75 transition duration-300 pointer-events-none" />

        <Dices className={`w-7 h-7 ${isSpinning ? 'animate-spin text-cinema-gold' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        <span>{isSpinning ? 'Consulting The Oracle...' : 'Spin The Night'}</span>
        <Sparkles className="w-5 h-5 text-cinema-gold group-hover:scale-125 transition-transform" />
      </button>

      {/* Reel Cycling Banner (Active while spinning) */}
      {isSpinning && (
        <div className="mt-6 w-full max-w-xl mx-auto glass-panel rounded-2xl p-4 border border-cinema-gold/40 shadow-glow-gold/30 animate-pulse">
          <div className="text-center text-xs font-bold uppercase tracking-wider text-cinema-gold mb-2">
            ✨ Aligning The Stars & Snacks...
          </div>
          <div className="grid grid-cols-2 gap-4 divide-x divide-white/10 text-center">
            <div className="flex items-center justify-center gap-2 py-2">
              <Film className="w-4 h-4 text-cinema-crimson animate-bounce" />
              <span className="font-bold text-sm sm:text-base text-white truncate">
                {MOCK_MOVIES[reelMovieIndex].title}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <span className="text-xl animate-bounce">
                {MOCK_FOODS[reelFoodIndex].emoji}
              </span>
              <span className="font-bold text-sm sm:text-base text-cinema-neon truncate">
                {MOCK_FOODS[reelFoodIndex].vibeTitle}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
