import React, { useEffect, useState, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { playTickSound, playReelClunk, playAnticipationTick } from '../../utils/sound';

export interface ReelItem {
  id: string;
  title: string;
  subtitle?: string;
  emoji?: string;
  badge?: string;
  color?: string;
}

interface SlotReelProps {
  label: string;
  reelNumber: number;
  items: ReelItem[];
  selectedIndex: number;
  isSpinning: boolean;
  isDecelerating?: boolean;
  isLocked: boolean;
  onToggleLock: () => void;
  soundEnabled: boolean;
}

export const SlotReel: React.FC<SlotReelProps> = ({
  label,
  reelNumber,
  items,
  selectedIndex,
  isSpinning,
  isDecelerating,
  isLocked,
  onToggleLock,
  soundEnabled,
}) => {
  const [displayIndex, setDisplayIndex] = useState(selectedIndex);
  const wasSpinningRef = useRef(false);

  // Fast Spin Phase
  useEffect(() => {
    if (isSpinning) {
      wasSpinningRef.current = true;
      let tickCount = 0;
      const interval = setInterval(() => {
        setDisplayIndex((prev) => (prev + 1) % items.length);
        tickCount++;
        if (tickCount % 2 === 0) {
          playTickSound(soundEnabled);
        }
      }, 70);

      return () => clearInterval(interval);
    }
  }, [isSpinning, items.length, soundEnabled]);

  // Deceleration / Slow-Down Phase (Suspenseful step-by-step crawl to winning item)
  useEffect(() => {
    if (isDecelerating && !isSpinning) {
      // Step through a few items progressively slowing down before landing
      let currentStep = 0;
      const totalSteps = 4;
      const delays = [110, 180, 280, 420];

      const stepCrawl = () => {
        if (currentStep < totalSteps - 1) {
          setDisplayIndex((prev) => (prev + 1) % items.length);
          playAnticipationTick(1 + currentStep * 0.15, soundEnabled);
          currentStep++;
          setTimeout(stepCrawl, delays[currentStep] || 300);
        } else {
          // Final landing on the winning item
          setDisplayIndex(selectedIndex);
          playReelClunk(soundEnabled);
        }
      };

      const timer = setTimeout(stepCrawl, delays[0]);
      return () => clearTimeout(timer);
    } else if (!isSpinning && !isDecelerating) {
      setDisplayIndex(selectedIndex);
    }
  }, [isDecelerating, isSpinning, selectedIndex, items.length, soundEnabled]);

  const currentItem = items[displayIndex] || items[0];

  // Cylinder perspective items
  const prevIndex = (displayIndex - 1 + items.length) % items.length;
  const nextIndex = (displayIndex + 1) % items.length;
  const prevItem = items[prevIndex];
  const nextItem = items[nextIndex];

  return (
    <div className="flex flex-col items-center flex-1 min-w-[100px] max-w-[210px]">
      
      {/* Reel Header Title */}
      <div className="w-full text-center mb-1.5">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-300/90 font-mono truncate px-1">
          {label}
        </div>
      </div>

      {/* 3D Cylindrical Reel Window */}
      <div className={`relative w-full h-[185px] sm:h-[215px] rounded-xl overflow-hidden bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border-2 transition-all ${
        !isSpinning && !isDecelerating
          ? 'border-amber-400 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9),0_0_20px_rgba(245,158,11,0.3)]'
          : 'border-amber-500/40 shadow-[inset_0_4px_16px_rgba(0,0,0,0.9)]'
      }`}>
        
        {/* Curvature Shading Gradients (Top & Bottom Cylinder Shadow) */}
        <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
        
        {/* Specular Center Glass Highlight */}
        <div className="absolute inset-x-0 top-[38%] h-12 bg-gradient-to-b from-white/10 via-white/5 to-transparent z-20 pointer-events-none" />

        {/* Central Payline Marker */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[68px] sm:h-[78px] border-y border-amber-400/50 bg-amber-500/[0.04] z-10 pointer-events-none flex items-center justify-between px-1">
          <span className="w-1.5 h-3.5 bg-red-500 rounded-r shadow-[0_0_8px_#ef4444]" />
          <span className="w-1.5 h-3.5 bg-red-500 rounded-l shadow-[0_0_8px_#ef4444]" />
        </div>

        {/* Items Container */}
        <div className={`w-full h-full flex flex-col justify-between py-2 transition-all ${isSpinning ? 'blur-[0.8px]' : ''}`}>
          
          {/* Top Ghost Item (Cylinder Curve) */}
          <div className="h-12 flex flex-col items-center justify-center opacity-30 scale-90 select-none pointer-events-none transform -translate-y-1">
            <span className="text-base">{prevItem.emoji}</span>
            <span className="text-[10px] font-semibold text-stone-400 truncate max-w-[90%]">
              {prevItem.title}
            </span>
          </div>

          {/* Winning Center Item (Payline) */}
          <div
            className={`h-[68px] sm:h-[78px] flex flex-col items-center justify-center text-center px-2 select-none transition-transform duration-200 z-10 ${
              !isSpinning && !isDecelerating ? 'scale-105' : 'scale-100'
            }`}
          >
            {currentItem.emoji && (
              <span className={`text-2xl sm:text-3xl leading-none mb-1 filter drop-shadow-md ${isSpinning ? 'animate-bounce' : ''}`}>
                {currentItem.emoji}
              </span>
            )}
            <span className="font-display font-black text-xs sm:text-sm text-amber-100 tracking-tight leading-tight line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {currentItem.title}
            </span>
            {currentItem.subtitle && (
              <span className="text-[10px] font-mono text-amber-400/90 mt-0.5 font-bold">
                {currentItem.subtitle}
              </span>
            )}
          </div>

          {/* Bottom Ghost Item (Cylinder Curve) */}
          <div className="h-12 flex flex-col items-center justify-center opacity-30 scale-90 select-none pointer-events-none transform translate-y-1">
            <span className="text-base">{nextItem.emoji}</span>
            <span className="text-[10px] font-semibold text-stone-400 truncate max-w-[90%]">
              {nextItem.title}
            </span>
          </div>

        </div>

        {/* Locked Overlay */}
        {isLocked && !isSpinning && (
          <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] z-30 flex items-center justify-center pointer-events-none border border-amber-400/50">
            <span className="px-2 py-0.5 rounded-full bg-amber-500/80 text-black text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
              <Lock className="w-2.5 h-2.5" /> HELD
            </span>
          </div>
        )}
      </div>

      {/* Reel Footer: HOLD Button */}
      <div className="mt-2 w-full flex justify-center">
        <button
          type="button"
          disabled={isSpinning || isDecelerating}
          onClick={onToggleLock}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-150 border ${
            isLocked
              ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
              : 'bg-stone-900/90 text-stone-400 border-white/10 hover:border-amber-400/50 hover:text-amber-200'
          }`}
          title={`Hold or release Reel ${reelNumber}`}
        >
          {isLocked ? (
            <>
              <Lock className="w-3 h-3" />
              <span>Held</span>
            </>
          ) : (
            <>
              <Unlock className="w-3 h-3 text-stone-500" />
              <span>Hold</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
