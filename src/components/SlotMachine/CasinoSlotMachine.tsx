import React, { useState, useEffect, useMemo } from 'react';
import { SlotReel, ReelItem } from './SlotReel';
import { SlotLever } from './SlotLever';
import { GoldCoinShower } from './GoldCoinShower';
import { MovieGenre, FoodGenre, RuntimeCategory, Movie, FoodOption } from '../../types';
import { Sparkles, Dices } from 'lucide-react';
import { playJackpotFanfare, playSubBassClunk } from '../../utils/sound';

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
  { genre: 'Action', item: { id: 'Action', title: 'Action', subtitle: 'Adrenaline', emoji: '💥', imageUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Sci-Fi', item: { id: 'Sci-Fi', title: 'Sci-Fi', subtitle: 'Cosmic', emoji: '🚀', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Comedy', item: { id: 'Comedy', title: 'Comedy', subtitle: 'Laughs', emoji: '😂', imageUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Horror', item: { id: 'Horror', title: 'Horror', subtitle: 'Chills', emoji: '👻', imageUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Drama', item: { id: 'Drama', title: 'Drama', subtitle: 'Deep Stakes', emoji: '🎭', imageUrl: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Animation', item: { id: 'Animation', title: 'Animation', subtitle: 'Artistry', emoji: '🎨', imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Thriller', item: { id: 'Thriller', title: 'Thriller', subtitle: 'Suspense', emoji: '🕵️', imageUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=300&q=80' } },
  { genre: 'Crime', item: { id: 'Crime', title: 'Crime', subtitle: 'Underworld', emoji: '💼', imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80' } },
];

// 2. Reel 2: Runtime Categories
const REEL_RUNTIMES: { runtime: RuntimeCategory; item: ReelItem }[] = [
  { runtime: 'quick', item: { id: 'quick', title: 'Quick Snack', subtitle: '< 100 mins', emoji: '⚡', imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=80' } },
  { runtime: 'standard', item: { id: 'standard', title: 'Standard Feature', subtitle: '~120 mins', emoji: '🍿', imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=300&q=80' } },
  { runtime: 'epic', item: { id: 'epic', title: 'Cinematic Epic', subtitle: '> 150 mins', emoji: '👑', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80' } },
];

// 3. Reel 3: Food Feasts
const REEL_FOODS: { food: FoodGenre; item: ReelItem }[] = [
  { food: 'Italian', item: { id: 'Italian', title: 'Italian Pizza', subtitle: 'Brick Oven', emoji: '🍕', imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Mexican', item: { id: 'Mexican', title: 'Birria Tacos', subtitle: 'Street Heat', emoji: '🌮', imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Burgers & Fries', item: { id: 'Burgers & Fries', title: 'Smashburgers', subtitle: 'Crispy Fries', emoji: '🍔', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Sushi', item: { id: 'Sushi', title: 'Tokyo Sushi', subtitle: 'Crispy Rice', emoji: '🍣', imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Thai', item: { id: 'Thai', title: 'Thai Noodles', subtitle: 'Spicy Wok', emoji: '🍜', imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Comfort Junk Food', item: { id: 'Comfort Junk Food', title: 'Comfort Junk', subtitle: 'Mac & Cheese', emoji: '🧀', imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=300&q=80' } },
  { food: 'BBQ & Wings', item: { id: 'BBQ & Wings', title: 'Smoked BBQ', subtitle: 'Crispy Wings', emoji: '🍗', imageUrl: 'https://images.unsplash.com/photo-1527477378407-63e26424c3d4?auto=format&fit=crop&w=300&q=80' } },
  { food: 'Indian', item: { id: 'Indian', title: 'Butter Chicken', subtitle: 'Garlic Naan', emoji: '🍛', imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80' } },
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

  // Fast spinning states
  const [isSpinning1, setIsSpinning1] = useState(false);
  const [isSpinning2, setIsSpinning2] = useState(false);
  const [isSpinning3, setIsSpinning3] = useState(false);

  // Slower deceleration crawl states
  const [isDecel1, setIsDecel1] = useState(false);
  const [isDecel2, setIsDecel2] = useState(false);
  const [isDecel3, setIsDecel3] = useState(false);

  // Reel Holds
  const [hold1, setHold1] = useState(false);
  const [hold2, setHold2] = useState(false);
  const [hold3, setHold3] = useState(false);

  // Spin Mode: Cascading vs Step-by-Step
  const [spinMode, setSpinMode] = useState<'cascading' | 'step'>('cascading');
  const [stepStage, setStepStage] = useState<1 | 2 | 3>(1);

  // Visual effects
  const [showCoinShower, setShowCoinShower] = useState(false);
  const [tickerMessage, setTickerMessage] = useState('★ PULL LEVER TO SPIN ★');
  const [isJackpot, setIsJackpot] = useState(false);

  // Sync initial indices with active props
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

  const anySpinning =
    isSpinning1 || isSpinning2 || isSpinning3 || isDecel1 || isDecel2 || isDecel3;

  // ==========================================
  // DRAMATIC SLOW CASCADING REVEAL (~7 Seconds)
  // ==========================================
  const triggerCascadingSpin = () => {
    if (anySpinning) return;
    setIsJackpot(false);
    setTickerMessage('ROLLING THE ORACLE REELS...');

    const nextGIdx = hold1 ? genreIdx : Math.floor(Math.random() * REEL_GENRES.length);
    const nextRIdx = hold2 ? runtimeIdx : Math.floor(Math.random() * REEL_RUNTIMES.length);
    const nextFIdx = hold3 ? foodIdx : Math.floor(Math.random() * REEL_FOODS.length);

    // Launch all reels in fast spin
    if (!hold1) setIsSpinning1(true);
    if (!hold2) setIsSpinning2(true);
    if (!hold3) setIsSpinning3(true);

    // --- REEL 1 (GENRE) ---
    // At 2.2s: transition to deceleration crawl
    setTimeout(() => {
      if (!hold1) {
        setIsSpinning1(false);
        setIsDecel1(true);
        setTickerMessage('DECELERATING REEL 1 (GENRE)...');
      }
    }, 2200);

    // At 3.4s: Reel 1 firmly locks
    setTimeout(() => {
      if (!hold1) {
        setGenreIdx(nextGIdx);
        setIsDecel1(false);
        setTickerMessage(`REEL 1 LOCKED: ${REEL_GENRES[nextGIdx].item.title.toUpperCase()}!`);
      }
    }, 3400);

    // --- REEL 2 (RUNTIME) ---
    // At 3.9s: transition to deceleration crawl
    setTimeout(() => {
      if (!hold2) {
        setIsSpinning2(false);
        setIsDecel2(true);
        setTickerMessage('DECELERATING REEL 2 (RUNTIME)...');
      }
    }, 3900);

    // At 5.1s: Reel 2 firmly locks
    setTimeout(() => {
      if (!hold2) {
        setRuntimeIdx(nextRIdx);
        setIsDecel2(false);
        setTickerMessage(`REEL 2 LOCKED: ${REEL_RUNTIMES[nextRIdx].item.title.toUpperCase()}!`);
      }
    }, 5100);

    // --- REEL 3 (FEAST & MUNCHIES) ---
    // At 5.5s: transition to slow suspenseful anticipation crawl
    setTimeout(() => {
      if (!hold3) {
        setIsSpinning3(false);
        setIsDecel3(true);
        setTickerMessage('★ ANTICIPATION: LOCKING IN FEAST... ★');
      }
    }, 5500);

    // At 7.0s: Dramatic sub-bass impact lock & grand jackpot celebration!
    setTimeout(() => {
      if (!hold3) {
        setFoodIdx(nextFIdx);
        setIsDecel3(false);
      }

      playSubBassClunk(soundEnabled);
      setTickerMessage('💰 JACKPOT! FEAST & FILM LOCKED! 💰');
      setIsJackpot(true);
      setShowCoinShower(true);
      playJackpotFanfare(soundEnabled);

      onSpinComplete({
        genre: REEL_GENRES[nextGIdx].genre,
        runtime: REEL_RUNTIMES[nextRIdx].runtime,
        foodGenre: REEL_FOODS[nextFIdx].food,
      });
    }, 7000);
  };

  // ==========================================
  // STEP-BY-STEP REEL SPIN (One per pull)
  // ==========================================
  const triggerStepSpin = () => {
    if (anySpinning) return;
    setIsJackpot(false);

    if (stepStage === 1) {
      if (!hold1) {
        setIsSpinning1(true);
        setTickerMessage('SPINNING REEL 1: MOVIE GENRE...');
        const nextGIdx = Math.floor(Math.random() * REEL_GENRES.length);
        setTimeout(() => {
          setIsSpinning1(false);
          setIsDecel1(true);
        }, 1600);
        setTimeout(() => {
          setGenreIdx(nextGIdx);
          setIsDecel1(false);
          setTickerMessage(`REEL 1: ${REEL_GENRES[nextGIdx].item.title.toUpperCase()}! PULL FOR RUNTIME`);
          setStepStage(2);
        }, 2800);
      } else {
        setStepStage(2);
      }
    } else if (stepStage === 2) {
      if (!hold2) {
        setIsSpinning2(true);
        setTickerMessage('SPINNING REEL 2: RUNTIME PACE...');
        const nextRIdx = Math.floor(Math.random() * REEL_RUNTIMES.length);
        setTimeout(() => {
          setIsSpinning2(false);
          setIsDecel2(true);
        }, 1600);
        setTimeout(() => {
          setRuntimeIdx(nextRIdx);
          setIsDecel2(false);
          setTickerMessage(`REEL 2: ${REEL_RUNTIMES[nextRIdx].item.title.toUpperCase()}! PULL FOR FEAST`);
          setStepStage(3);
        }, 2800);
      } else {
        setStepStage(3);
      }
    } else if (stepStage === 3) {
      if (!hold3) {
        setIsSpinning3(true);
        setTickerMessage('SPINNING REEL 3: FOOD FEAST...');
        const nextFIdx = Math.floor(Math.random() * REEL_FOODS.length);
        setTimeout(() => {
          setIsSpinning3(false);
          setIsDecel3(true);
        }, 1600);
        setTimeout(() => {
          setFoodIdx(nextFIdx);
          setIsDecel3(false);
          playSubBassClunk(soundEnabled);
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
        }, 2900);
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

  // Marquee bulbs
  const bulbs = useMemo(() => Array.from({ length: 20 }), []);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-6 select-none">
      
      {/* Falling Gold Coins Particle Overlay */}
      <GoldCoinShower
        active={showCoinShower}
        onComplete={() => setShowCoinShower(false)}
      />

      {/* Main Outer Cabinet Shell with 3D Depth */}
      <div className="relative flex items-center justify-center w-full">
        
        {/* Invisible Left Counter-Spacer of identical width to the lever on the right */}
        <div className="w-16 sm:w-20 hidden md:block pointer-events-none opacity-0 select-none mr-1 sm:mr-3" aria-hidden="true" />

        {/* 3D SLOT MACHINE CABINET (Crimson Enamel & Chrome from Image 2) */}
        <div
          className="relative w-full max-w-2xl rounded-3xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(220,38,38,0.25)] border-[5px] border-stone-800 flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 30%, #581212 70%, #2b0808 100%)',
          }}
        >
          
          {/* Beveled Chrome Cabinet Highlight Ring */}
          <div className="absolute inset-0 rounded-3xl border-2 border-stone-300/30 pointer-events-none" />
          
          {/* 1. ARCHED TOP CASINO MARQUEE (Classic Vegas from Image 2) */}
          <div className="relative w-full mx-auto mb-4 rounded-t-full rounded-b-2xl bg-gradient-to-b from-stone-900 via-stone-950 to-red-950 p-3 border-[3px] border-amber-400/90 shadow-[0_0_25px_rgba(245,158,11,0.5)]">
            
            {/* Chasing Light Bulbs Arch */}
            <div className="flex items-center justify-between px-3 mb-1">
              {bulbs.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                    i % 2 === 0
                      ? 'bg-amber-300 shadow-[0_0_10px_#fde047] animate-pulse'
                      : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                  style={{ animationDelay: `${(i * 100) % 1000}ms` }}
                />
              ))}
            </div>

            {/* Glowing Golden Fan Text Plaque */}
            <div className="text-center py-1 sm:py-2">
              <div className="inline-block font-display font-black text-2xl sm:text-4xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-amber-300 to-amber-600 filter drop-shadow-[0_2px_12px_rgba(245,158,11,0.9)] uppercase">
                ★ CASINO ORACLE ★
              </div>
              <div className="text-[10px] sm:text-xs font-mono font-black tracking-widest text-amber-200/90 uppercase mt-0.5">
                Spin Your Film &amp; Feast Pairing
              </div>
            </div>

            <div className="flex items-center justify-between px-3 mt-1">
              {bulbs.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all ${
                    i % 2 !== 0
                      ? 'bg-amber-300 shadow-[0_0_10px_#fde047] animate-pulse'
                      : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                  }`}
                  style={{ animationDelay: `${((i + 1) * 100) % 1000}ms` }}
                />
              ))}
            </div>

          </div>

          {/* 2. CHROME-BEVELED REEL VIEWPORT (Image 2 Silver Window) */}
          <div className="relative rounded-2xl bg-stone-950 p-3 sm:p-4 border-[4px] border-stone-300/80 shadow-[inset_0_6px_30px_rgba(0,0,0,0.95),0_4px_15px_rgba(0,0,0,0.7)]">
            
            {/* The 3 Cylindrical Slot Reels */}
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <SlotReel
                label="Reel 1: Genre"
                reelNumber={1}
                items={REEL_GENRES.map((g) => g.item)}
                selectedIndex={genreIdx}
                isSpinning={isSpinning1}
                isDecelerating={isDecel1}
                isLocked={hold1}
                onToggleLock={() => setHold1(!hold1)}
                soundEnabled={soundEnabled}
              />

              <div className="w-[3px] h-40 bg-gradient-to-b from-stone-700 via-stone-300 to-stone-800 shadow-sm" />

              <SlotReel
                label="Reel 2: Runtime"
                reelNumber={2}
                items={REEL_RUNTIMES.map((r) => r.item)}
                selectedIndex={runtimeIdx}
                isSpinning={isSpinning2}
                isDecelerating={isDecel2}
                isLocked={hold2}
                onToggleLock={() => setHold2(!hold2)}
                soundEnabled={soundEnabled}
              />

              <div className="w-[3px] h-40 bg-gradient-to-b from-stone-700 via-stone-300 to-stone-800 shadow-sm" />

              <SlotReel
                label="Reel 3: Feast"
                reelNumber={3}
                items={REEL_FOODS.map((f) => f.item)}
                selectedIndex={foodIdx}
                isSpinning={isSpinning3}
                isDecelerating={isDecel3}
                isLocked={hold3}
                onToggleLock={() => setHold3(!hold3)}
                soundEnabled={soundEnabled}
              />
            </div>

            {/* Glowing Center Payline Indicators */}
            <div className="mt-3 flex items-center justify-between px-2 text-[10px] text-amber-400 font-mono font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                PAYLINE ACTIVE
              </span>
              <span className="text-stone-400">AUTHENTIC REEL DECELERATION</span>
            </div>

          </div>

          {/* 3. DIGITAL LED STATUS TICKER SCREEN */}
          <div className="my-3.5 px-4 py-2.5 rounded-xl bg-black border-2 border-stone-800 shadow-[inset_0_2px_10px_rgba(0,0,0,1)] flex items-center justify-between">
            <span className="text-[11px] font-mono text-red-600 uppercase font-black tracking-wider">
              DISPLAY:
            </span>
            <div className={`font-mono text-xs sm:text-sm font-black tracking-widest text-center flex-1 px-2 ${
              isJackpot
                ? 'text-yellow-400 shadow-[0_0_15px_#facc15] animate-pulse'
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

          {/* 4. CANTILEVERED CONSOLE SHELF WITH COLORED ARCADE BUTTONS (from Image 2) */}
          <div className="rounded-xl bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 p-3 border-t-2 border-stone-600 shadow-[0_4px_12px_rgba(0,0,0,0.8)] flex flex-col sm:flex-row items-center justify-center gap-3">
            
            {/* Mode Toggle Buttons */}
            <div className="flex items-center justify-center gap-1.5 p-1 rounded-xl bg-stone-950 border border-white/5 text-xs">
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
              className={`w-full sm:flex-1 min-w-[170px] py-3.5 px-6 rounded-2xl font-display font-black text-sm sm:text-base uppercase tracking-wider text-stone-950 transition-all transform active:scale-95 shadow-[0_4px_15px_rgba(245,158,11,0.5)] ${
                anySpinning
                  ? 'bg-stone-700 cursor-not-allowed text-stone-400 shadow-none'
                  : 'bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 hover:brightness-110 shadow-glow-gold'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Dices className={`w-5 h-5 ${anySpinning ? 'animate-spin' : ''}`} />
                <span>
                  {anySpinning
                    ? 'Revealing...'
                    : spinMode === 'step'
                    ? `Spin Reel ${stepStage}`
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
                className="text-xs text-amber-400/90 hover:text-amber-200 px-2.5 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 transition-colors"
              >
                Reset Holds
              </button>
            )}

          </div>

          {/* 5. BLACK COIN PAYOUT HOPPER TRAY (from Image 2) */}
          <div className="mt-4 pt-3 border-t border-red-950 flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
              <span className="font-mono text-[11px] text-stone-400">HIGH ROLLER EDITION • LIVE</span>
            </div>

            {/* Glowing "WIN" Plaque */}
            <div className="px-3 py-1 rounded-md bg-stone-950 border border-amber-500/50 text-amber-400 font-mono font-black tracking-widest text-xs shadow-[0_0_10px_rgba(245,158,11,0.4)]">
              ★ JACKPOT GUARANTEE ★
            </div>
          </div>

        </div>

        {/* ACCURATE 3D MECHANICAL PULL LEVER (Attached directly on the right) */}
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
