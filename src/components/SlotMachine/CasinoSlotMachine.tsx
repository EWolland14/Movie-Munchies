import React, { useState, useEffect, useMemo } from 'react';
import { SlotReel, ReelItem } from './SlotReel';
import { SlotLever } from './SlotLever';
import { GoldCoinShower } from './GoldCoinShower';
import { MovieGenre, FoodGenre, RuntimeCategory, Movie, FoodOption } from '../../types';
import { Sparkles, Dices } from 'lucide-react';
import { playJackpotFanfare } from '../../utils/sound';

interface CasinoSlotMachineProps {
  onSpinComplete: (selected: {
    genre: MovieGenre;
    runtime: RuntimeCategory;
    foodGenre: FoodGenre;
  }) => void;
  activeMovie: Movie | null;
  activeFood: FoodOption | null;
  soundEnabled: boolean;
}

// 1. Reel 1: Movie Genres
const REEL_GENRES: { genre: MovieGenre; item: ReelItem }[] = [
  { genre: 'Action', item: { id: 'Action', title: 'Action', subtitle: 'Adrenaline', emoji: '💥' } },
  { genre: 'Sci-Fi', item: { id: 'Sci-Fi', title: 'Sci-Fi', subtitle: 'Cosmic', emoji: '🚀' } },
  { genre: 'Comedy', item: { id: 'Comedy', title: 'Comedy', subtitle: 'Laughs', emoji: '😂' } },
  { genre: 'Horror', item: { id: 'Horror', title: 'Horror', subtitle: 'Chills', emoji: '👻' } },
  { genre: 'Drama', item: { id: 'Drama', title: 'Drama', subtitle: 'Deep Stakes', emoji: '🎭' } },
  { genre: 'Animation', item: { id: 'Animation', title: 'Animation', subtitle: 'Artistry', emoji: '🎨' } },
  { genre: 'Thriller', item: { id: 'Thriller', title: 'Thriller', subtitle: 'Suspense', emoji: '🕵️' } },
  { genre: 'Crime', item: { id: 'Crime', title: 'Crime', subtitle: 'Underworld', emoji: '💼' } },
];

// 2. Reel 2: Runtime Categories
const REEL_RUNTIMES: { runtime: RuntimeCategory; item: ReelItem }[] = [
  { runtime: 'quick', item: { id: 'quick', title: 'Quick Snack', subtitle: '< 100 mins', emoji: '⚡' } },
  { runtime: 'standard', item: { id: 'standard', title: 'Standard Feature', subtitle: '~120 mins', emoji: '🍿' } },
  { runtime: 'epic', item: { id: 'epic', title: 'Cinematic Epic', subtitle: '> 150 mins', emoji: '👑' } },
];

// 3. Reel 3: Food Feasts
const REEL_FOODS: { food: FoodGenre; item: ReelItem }[] = [
  { food: 'Italian', item: { id: 'Italian', title: 'Italian Pizza', subtitle: 'Brick Oven', emoji: '🍕' } },
  { food: 'Mexican', item: { id: 'Mexican', title: 'Birria Tacos', subtitle: 'Street Heat', emoji: '🌮' } },
  { food: 'Burgers & Fries', item: { id: 'Burgers & Fries', title: 'Smashburgers', subtitle: 'Crispy Fries', emoji: '🍔' } },
  { food: 'Sushi', item: { id: 'Sushi', title: 'Tokyo Sushi', subtitle: 'Crispy Rice', emoji: '🍣' } },
  { food: 'Thai', item: { id: 'Thai', title: 'Thai Noodles', subtitle: 'Spicy Wok', emoji: '🍜' } },
  { food: 'Comfort Junk Food', item: { id: 'Comfort Junk Food', title: 'Comfort Junk', subtitle: 'Mac & Cheese', emoji: '🧀' } },
  { food: 'BBQ & Wings', item: { id: 'BBQ & Wings', title: 'Smoked BBQ', subtitle: 'Crispy Wings', emoji: '🍗' } },
  { food: 'Indian', item: { id: 'Indian', title: 'Butter Chicken', subtitle: 'Garlic Naan', emoji: '🍛' } },
];

export const CasinoSlotMachine: React.FC<CasinoSlotMachineProps> = ({
  onSpinComplete,
  activeMovie,
  activeFood,
  soundEnabled,
}) => {
  // Reel Selection Indices
  const [genreIdx, setGenreIdx] = useState(0);
  const [runtimeIdx, setRuntimeIdx] = useState(1);
  const [foodIdx, setFoodIdx] = useState(0);

  // Spinning states for each reel
  const [isSpinning1, setIsSpinning1] = useState(false);
  const [isSpinning2, setIsSpinning2] = useState(false);
  const [isSpinning3, setIsSpinning3] = useState(false);

  // Reel Holds
  const [hold1, setHold1] = useState(false);
  const [hold2, setHold2] = useState(false);
  const [hold3, setHold3] = useState(false);

  // Mode: 'cascading' (All at once with staggered stops) vs 'step' (lever spins one reel at a time)
  const [spinMode, setSpinMode] = useState<'cascading' | 'step'>('cascading');
  const [stepStage, setStepStage] = useState<1 | 2 | 3>(1); // which reel to spin next in step mode

  // Visual effects
  const [showCoinShower, setShowCoinShower] = useState(false);
  const [tickerMessage, setTickerMessage] = useState('★ PULL LEVER TO SPIN ★');
  const [isJackpot, setIsJackpot] = useState(false);

  // Sync initial indices with active props if provided
  useEffect(() => {
    if (activeMovie) {
      const gIndex = REEL_GENRES.findIndex((g) => activeMovie.genres.includes(g.genre));
      if (gIndex !== -1) setGenreIdx(gIndex);

      const rIndex = REEL_RUNTIMES.findIndex((r) => r.runtime === activeMovie.runtimeCategory);
      if (rIndex !== -1) setRuntimeIdx(rIndex);
    }
    if (activeFood) {
      const fIndex = REEL_FOODS.findIndex((f) => f.food === activeFood.genre);
      if (fIndex !== -1) setFoodIdx(fIndex);
    }
  }, [activeMovie, activeFood]);

  const anySpinning = isSpinning1 || isSpinning2 || isSpinning3;

  // Execute Cascading Spin (All at once with timed stops)
  const triggerCascadingSpin = () => {
    if (anySpinning) return;
    setIsJackpot(false);
    setTickerMessage('ROLLING THE ORACLE REELS...');

    // Pick target indices ahead of time
    const nextGIdx = hold1 ? genreIdx : Math.floor(Math.random() * REEL_GENRES.length);
    const nextRIdx = hold2 ? runtimeIdx : Math.floor(Math.random() * REEL_RUNTIMES.length);
    const nextFIdx = hold3 ? foodIdx : Math.floor(Math.random() * REEL_FOODS.length);

    // Launch reels that aren't held
    if (!hold1) setIsSpinning1(true);
    if (!hold2) setIsSpinning2(true);
    if (!hold3) setIsSpinning3(true);

    // Staggered stops:
    // Reel 1 stops at 1.1s
    setTimeout(() => {
      if (!hold1) {
        setGenreIdx(nextGIdx);
        setIsSpinning1(false);
        setTickerMessage(`REEL 1: ${REEL_GENRES[nextGIdx].item.title.toUpperCase()}!`);
      }
    }, 1100);

    // Reel 2 stops at 1.9s
    setTimeout(() => {
      if (!hold2) {
        setRuntimeIdx(nextRIdx);
        setIsSpinning2(false);
        setTickerMessage(`REEL 2: ${REEL_RUNTIMES[nextRIdx].item.title.toUpperCase()}!`);
      }
    }, 1900);

    // Reel 3 stops at 2.7s -> Final celebration!
    setTimeout(() => {
      if (!hold3) {
        setFoodIdx(nextFIdx);
        setIsSpinning3(false);
      }

      // Finish spin & reward
      setTickerMessage('💰 JACKPOT! FEAST & FILM LOCKED! 💰');
      setIsJackpot(true);
      setShowCoinShower(true);
      playJackpotFanfare(soundEnabled);

      onSpinComplete({
        genre: REEL_GENRES[nextGIdx].genre,
        runtime: REEL_RUNTIMES[nextRIdx].runtime,
        foodGenre: REEL_FOODS[nextFIdx].food,
      });
    }, 2700);
  };

  // Execute Step-by-Step Spin (One column per lever pull)
  const triggerStepSpin = () => {
    if (anySpinning) return;
    setIsJackpot(false);

    if (stepStage === 1) {
      if (!hold1) {
        setIsSpinning1(true);
        setTickerMessage('SPINNING REEL 1: MOVIE GENRE...');
        const nextGIdx = Math.floor(Math.random() * REEL_GENRES.length);
        setTimeout(() => {
          setGenreIdx(nextGIdx);
          setIsSpinning1(false);
          setTickerMessage(`REEL 1: ${REEL_GENRES[nextGIdx].item.title.toUpperCase()}! PULL FOR RUNTIME`);
          setStepStage(2);
        }, 1100);
      } else {
        setStepStage(2);
      }
    } else if (stepStage === 2) {
      if (!hold2) {
        setIsSpinning2(true);
        setTickerMessage('SPINNING REEL 2: RUNTIME PACE...');
        const nextRIdx = Math.floor(Math.random() * REEL_RUNTIMES.length);
        setTimeout(() => {
          setRuntimeIdx(nextRIdx);
          setIsSpinning2(false);
          setTickerMessage(`REEL 2: ${REEL_RUNTIMES[nextRIdx].item.title.toUpperCase()}! PULL FOR FEAST`);
          setStepStage(3);
        }, 1100);
      } else {
        setStepStage(3);
      }
    } else if (stepStage === 3) {
      if (!hold3) {
        setIsSpinning3(true);
        setTickerMessage('SPINNING REEL 3: FOOD FEAST...');
        const nextFIdx = Math.floor(Math.random() * REEL_FOODS.length);
        setTimeout(() => {
          setFoodIdx(nextFIdx);
          setIsSpinning3(false);
          setTickerMessage('💰 JACKPOT! ALL REELS LOCKED! 💰');
          setIsJackpot(true);
          setShowCoinShower(true);
          playJackpotFanfare(soundEnabled);
          setStepStage(1);

          onSpinComplete({
            genre: REEL_GENRES[genreIdx].genre,
            runtime: REEL_RUNTIMES[runtimeIdx].runtime,
            foodGenre: REEL_FOODS[nextFIdx].food,
          });
        }, 1100);
      } else {
        setStepStage(1);
      }
    }
  };

  const handleLeverOrButtonPull = () => {
    if (spinMode === 'cascading') {
      triggerCascadingSpin();
    } else {
      triggerStepSpin();
    }
  };

  // Bulbs around top marquee arch
  const bulbs = useMemo(() => Array.from({ length: 18 }), []);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6 select-none">
      
      {/* Falling Gold Coins & Sparkles Particle Overlay */}
      <GoldCoinShower
        active={showCoinShower}
        onComplete={() => setShowCoinShower(false)}
      />

      {/* Main Outer Cabinet Shell */}
      <div className="relative flex items-center justify-center">
        
        {/* SLOT MACHINE CHASSIS */}
        <div className="relative w-full max-w-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-black rounded-3xl p-4 sm:p-7 border-4 border-amber-500/60 shadow-[0_0_50px_rgba(245,158,11,0.3),0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Metallic Gold Trim & Corner Rivet Highlights */}
          <div className="absolute inset-0 rounded-3xl border border-amber-300/40 pointer-events-none" />
          <div className="absolute top-2 left-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <div className="absolute top-2 right-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <div className="absolute bottom-2 left-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
          <div className="absolute bottom-2 right-3 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />

          {/* 1. TOP ARCHED MARQUEE: "JACKPOT ORACLE" with chasing casino bulbs */}
          <div className="relative w-full mx-auto mb-5 rounded-2xl bg-gradient-to-r from-red-950 via-red-900 to-red-950 p-2 border-2 border-amber-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            
            {/* Chasing Marquee Bulbs Ring */}
            <div className="flex items-center justify-between px-2 mb-1">
              {bulbs.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    i % 2 === 0
                      ? 'bg-amber-300 shadow-[0_0_8px_#fde047] animate-pulse'
                      : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                  style={{ animationDelay: `${(i * 120) % 1000}ms` }}
                />
              ))}
            </div>

            {/* Glowing Marquee Text */}
            <div className="text-center py-1 sm:py-2">
              <div className="inline-block font-display font-black text-2xl sm:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-400 to-amber-600 filter drop-shadow-[0_2px_10px_rgba(245,158,11,0.8)] uppercase">
                ★ JACKPOT ORACLE ★
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-amber-200/80 uppercase">
                Spin Your Film &amp; Feast
              </div>
            </div>

            <div className="flex items-center justify-between px-2 mt-1">
              {bulbs.map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                    i % 2 !== 0
                      ? 'bg-amber-300 shadow-[0_0_8px_#fde047] animate-pulse'
                      : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                  style={{ animationDelay: `${((i + 1) * 120) % 1000}ms` }}
                />
              ))}
            </div>

          </div>

          {/* 2. REEL DISPLAY WINDOW (Beveled Gold Frame) */}
          <div className="relative rounded-2xl bg-stone-950 p-3 sm:p-4 border-4 border-amber-600/80 shadow-[inset_0_4px_25px_rgba(0,0,0,0.95)]">
            
            {/* The 3 Slot Reels */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <SlotReel
                label="Reel 1: Genre"
                reelNumber={1}
                items={REEL_GENRES.map((g) => g.item)}
                selectedIndex={genreIdx}
                isSpinning={isSpinning1}
                isLocked={hold1}
                onToggleLock={() => setHold1(!hold1)}
                soundEnabled={soundEnabled}
              />

              <div className="w-[2px] h-36 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

              <SlotReel
                label="Reel 2: Runtime"
                reelNumber={2}
                items={REEL_RUNTIMES.map((r) => r.item)}
                selectedIndex={runtimeIdx}
                isSpinning={isSpinning2}
                isLocked={hold2}
                onToggleLock={() => setHold2(!hold2)}
                soundEnabled={soundEnabled}
              />

              <div className="w-[2px] h-36 bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

              <SlotReel
                label="Reel 3: Feast"
                reelNumber={3}
                items={REEL_FOODS.map((f) => f.item)}
                selectedIndex={foodIdx}
                isSpinning={isSpinning3}
                isLocked={hold3}
                onToggleLock={() => setHold3(!hold3)}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* Glowing Payline Beams Indicator */}
            <div className="mt-3 flex items-center justify-between px-2 text-[10px] text-amber-500/80 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                PAYLINE ACTIVE
              </span>
              <span>100% RANDOMIZED MATCH</span>
            </div>

          </div>

          {/* 3. DIGITAL LED STATUS TICKER SCREEN */}
          <div className="my-4 px-4 py-2.5 rounded-xl bg-black border-2 border-stone-800 shadow-[inset_0_2px_8px_rgba(0,0,0,1)] flex items-center justify-between">
            <span className="text-[11px] font-mono text-red-700 uppercase font-black tracking-wider">
              DISPLAY:
            </span>
            <div className={`font-mono text-xs sm:text-sm font-black tracking-widest text-center flex-1 ${
              isJackpot
                ? 'text-yellow-400 shadow-[0_0_12px_#facc15] animate-pulse'
                : anySpinning
                ? 'text-amber-400'
                : 'text-red-500 shadow-[0_0_8px_#ef4444]'
            }`}>
              {tickerMessage}
            </div>
            {spinMode === 'step' && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                STAGE {stepStage}/3
              </span>
            )}
          </div>

          {/* 4. CONTROL CONSOLE SHELF */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            {/* Spin Mode Selector Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-white/10 text-xs">
              <button
                type="button"
                disabled={anySpinning}
                onClick={() => {
                  setSpinMode('cascading');
                  setTickerMessage('★ PULL LEVER TO SPIN ALL ★');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  spinMode === 'cascading'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                All-At-Once
              </button>
              <button
                type="button"
                disabled={anySpinning}
                onClick={() => {
                  setSpinMode('step');
                  setStepStage(1);
                  setTickerMessage('PULL LEVER FOR REEL 1 (GENRE)');
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  spinMode === 'step'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                Step-By-Step
              </button>
            </div>

            {/* Central Big Brass "SPIN / PULL" Button */}
            <button
              type="button"
              disabled={anySpinning}
              onClick={handleLeverOrButtonPull}
              className={`flex-1 min-w-[160px] py-3.5 px-6 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider text-stone-950 transition-all transform active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.5)] ${
                anySpinning
                  ? 'bg-stone-700 cursor-not-allowed text-stone-400 shadow-none'
                  : 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:brightness-110 shadow-glow-gold'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Dices className={`w-5 h-5 ${anySpinning ? 'animate-spin' : ''}`} />
                <span>
                  {anySpinning
                    ? 'Rolling...'
                    : spinMode === 'step'
                    ? `Spin Reel ${stepStage} (${stepStage === 1 ? 'Genre' : stepStage === 2 ? 'Runtime' : 'Feast'})`
                    : 'Spin The Oracle'}
                </span>
                <Sparkles className="w-4 h-4 text-amber-900" />
              </div>
            </button>

            {/* Clear Holds Button */}
            {(hold1 || hold2 || hold3) && (
              <button
                type="button"
                onClick={() => {
                  setHold1(false);
                  setHold2(false);
                  setHold3(false);
                }}
                className="text-xs text-amber-400/80 hover:text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors"
              >
                Reset Holds
              </button>
            )}

          </div>

          {/* 5. COIN PAYOUT TRAY AT THE BASE */}
          <div className="mt-5 pt-3 border-t border-amber-600/30 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              <span className="font-mono text-[11px] text-stone-400">CASINO SLOTS ENGINE • READY</span>
            </div>

            {/* Glowing "WIN" Plaque */}
            <div className="px-3 py-1 rounded-md bg-stone-900 border border-amber-500/40 text-amber-400 font-mono font-black tracking-widest text-xs shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              WINNER EVERY TIME
            </div>
          </div>

        </div>

        {/* MECHANICAL PULL LEVER (Attached directly on the right) */}
        <div className="ml-1 sm:ml-3">
          <SlotLever
            isSpinning={anySpinning}
            onPull={handleLeverOrButtonPull}
            soundEnabled={soundEnabled}
          />
        </div>

      </div>

    </div>
  );
};
