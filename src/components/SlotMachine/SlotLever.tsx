import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playLeverPullSound } from '../../utils/sound';

interface SlotLeverProps {
  isSpinning: boolean;
  onPull: () => void;
  soundEnabled: boolean;
}

export const SlotLever: React.FC<SlotLeverProps> = ({ isSpinning, onPull, soundEnabled }) => {
  const [dragProgress, setDragProgress] = useState(0); // 0 (upright) to 1 (fully pulled down)
  const [isPullingAnim, setIsPullingAnim] = useState(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const maxDrag = 120; // px distance to pull down

  const triggerPull = useCallback(() => {
    if (isSpinning) return;
    setIsPullingAnim(true);
    setDragProgress(1);
    playLeverPullSound(soundEnabled);

    // Call onPull after brief mechanical engagement
    setTimeout(() => {
      onPull();
    }, 220);

    // Elastic spring oscillation back upright
    setTimeout(() => {
      setIsPullingAnim(false);
      setDragProgress(0);
    }, 600);
  }, [isSpinning, soundEnabled, onPull]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isSpinning || isPullingAnim) return;
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isSpinning) return;
    const deltaY = e.clientY - startYRef.current;
    if (deltaY > 0) {
      const progress = Math.min(1, deltaY / maxDrag);
      setDragProgress(progress);
      if (progress >= 0.95 && !isPullingAnim) {
        isDraggingRef.current = false;
        triggerPull();
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }

    if (dragProgress > 0.4) {
      triggerPull();
    } else {
      setDragProgress(0);
    }
  };

  // Spacebar / Enter shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && document.activeElement === document.body) {
        if (!isSpinning && !isPullingAnim) {
          triggerPull();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpinning, isPullingAnim, triggerPull]);

  // Precise 3D arc calculations matching Image 2
  // Pivot rotation degrees: 0deg upright -> 65deg forward & down
  const armRotation = dragProgress * 62;
  const knobTranslateY = dragProgress * 95;
  const knobTranslateX = dragProgress * 15;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-16 sm:w-20 h-[300px] sm:h-[340px]">
      
      {/* 1. Heavy Black Circular Flange / Mounting Base Plate (matches reference Image 2) */}
      <div className="absolute right-5 sm:right-6 top-[56%] -translate-y-1/2 w-14 h-14 rounded-full bg-gradient-to-br from-stone-900 via-black to-stone-950 border-[3px] border-stone-800 shadow-[0_6px_20px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15)] z-0 flex items-center justify-center">
        {/* Subtle screw details */}
        <div className="absolute top-1 w-1.5 h-1.5 rounded-full bg-stone-700" />
        <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-stone-700" />
      </div>

      {/* 2. Stepped Cylindrical Chrome Pivot Hub (matches reference Image 2) */}
      <div className="absolute right-4 sm:right-5 top-[56%] -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-r from-stone-400 via-white to-stone-600 border border-stone-400 shadow-[0_4px_12px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center">
        {/* Center Chrome Bolt / Pin */}
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-stone-200 via-stone-400 to-stone-700 border border-stone-500 shadow-inner flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-stone-900" />
        </div>
      </div>

      {/* 3. The Pivot Arm Assembly: Polished Steel Rod + Cherry-Red Ball Knob */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          if (!isSpinning && !isPullingAnim) triggerPull();
        }}
        className={`absolute right-4 sm:right-5 top-[23%] w-12 flex flex-col items-center cursor-grab active:cursor-grabbing z-20 origin-[bottom_center] ${
          isPullingAnim
            ? 'transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275)'
            : 'transition-transform'
        }`}
        style={{
          transform: `translate(${knobTranslateX}px, ${knobTranslateY}px) rotate(${armRotation}deg)`,
          touchAction: 'none',
        }}
        title="Drag down or click to spin the slot machine!"
      >
        
        {/* Glossy Cherry-Red Spherical Ball Knob (matches reference Image 2) */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-950 border border-red-400/60 shadow-[0_8px_18px_rgba(0,0,0,0.7),inset_-3px_-3px_8px_rgba(0,0,0,0.6),0_0_15px_rgba(239,68,68,0.4)] group hover:scale-105 transition-transform flex items-center justify-center">
          
          {/* Specular White Highlight Dot (classic glossy 3D sphere look) */}
          <div className="absolute top-2 left-2.5 w-3.5 h-3.5 rounded-full bg-white/80 blur-[0.4px]" />
          <div className="absolute top-4 left-5 w-1.5 h-1.5 rounded-full bg-white/50 blur-[0.2px]" />
          
          {/* Subtle Bottom Reflected Rim Light */}
          <div className="absolute bottom-1 inset-x-3 h-1.5 rounded-full bg-red-400/30 blur-[0.6px]" />
        </div>

        {/* Polished Stainless Steel / Chrome Cylindrical Shaft */}
        <div className="w-3.5 sm:w-4 h-28 sm:h-32 bg-gradient-to-r from-stone-400 via-white to-stone-500 rounded-sm border-x border-stone-500 shadow-[3px_4px_10px_rgba(0,0,0,0.6)] -mt-1" />

      </div>

      {/* "DRAG LEVER" Animated Cue */}
      <div className="absolute bottom-1 text-center select-none pointer-events-none">
        <span className="text-[10px] font-mono font-black text-amber-400 uppercase tracking-wider block animate-bounce drop-shadow">
          ▼ PULL
        </span>
      </div>

    </div>
  );
};
