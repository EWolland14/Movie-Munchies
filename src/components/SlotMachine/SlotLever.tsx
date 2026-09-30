import React, { useState, useRef, useEffect, useCallback } from 'react';
import { playLeverPullSound } from '../../utils/sound';

interface SlotLeverProps {
  isSpinning: boolean;
  onPull: () => void;
  soundEnabled: boolean;
}

export const SlotLever: React.FC<SlotLeverProps> = ({ isSpinning, onPull, soundEnabled }) => {
  const [dragProgress, setDragProgress] = useState(0); // 0 to 1
  const [isPullingAnim, setIsPullingAnim] = useState(false);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const maxDrag = 110; // max px pull down

  const triggerPull = useCallback(() => {
    if (isSpinning) return;
    setIsPullingAnim(true);
    setDragProgress(1);
    playLeverPullSound(soundEnabled);

    // Call onPull after brief mechanical initiation
    setTimeout(() => {
      onPull();
    }, 180);

    // Snap lever back up after pull
    setTimeout(() => {
      setIsPullingAnim(false);
      setDragProgress(0);
    }, 450);
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

    if (dragProgress > 0.45) {
      triggerPull();
    } else {
      // Snap back without triggering
      setDragProgress(0);
    }
  };

  // Keyboard shortcut (spacebar or enter can also pull)
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

  // Lever calculations
  // Arm rotation goes from 0deg (upright) to 65deg (down)
  const rotationDeg = dragProgress * 65;
  // Ball Y goes from 0 to 100px
  const ballY = dragProgress * 105;

  return (
    <div className="relative flex flex-col items-center justify-center select-none w-14 sm:w-16 h-[260px] sm:h-[300px]">
      
      {/* Chrome Mounting Bracket attached to slot machine */}
      <div className="absolute right-6 sm:right-7 top-1/2 -translate-y-1/2 w-8 h-16 rounded-l-md bg-gradient-to-r from-stone-600 via-stone-400 to-amber-600 border-l border-amber-300 shadow-md z-0" />
      
      {/* Circular Pivot Hinge */}
      <div className="absolute right-4 sm:right-5 top-[58%] -translate-y-1/2 w-9 h-9 rounded-full bg-gradient-to-br from-amber-200 via-amber-500 to-stone-900 border-2 border-amber-300 shadow-[0_4px_10px_rgba(0,0,0,0.6)] z-10 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-stone-950 border border-amber-400/50" />
      </div>

      {/* Lever Arm & Ball Handle (Draggable / Clickable) */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={() => {
          if (!isSpinning && !isPullingAnim) triggerPull();
        }}
        className={`absolute right-5 sm:right-6 top-[28%] w-10 flex flex-col items-center cursor-grab active:cursor-grabbing z-20 origin-bottom transition-transform ${
          isPullingAnim ? 'transition-all duration-300 ease-out' : ''
        }`}
        style={{
          transform: `translateY(${ballY}px) rotate(${rotationDeg}deg)`,
          touchAction: 'none',
        }}
        title="Pull or click to spin the slot machine!"
      >
        {/* Golden Ball Knob */}
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-amber-100 via-amber-400 to-amber-700 border-2 border-yellow-200 shadow-[0_6px_14px_rgba(0,0,0,0.7),inset_-3px_-3px_8px_rgba(0,0,0,0.5),0_0_15px_rgba(245,158,11,0.5)] group hover:scale-105 transition-transform flex items-center justify-center">
          
          {/* Specular Highlight on Ball */}
          <div className="absolute top-1.5 left-2 w-3.5 h-3.5 rounded-full bg-white/70 blur-[0.5px]" />
          <div className="text-[10px] font-black text-amber-950/60 uppercase select-none">
            PULL
          </div>
        </div>

        {/* Chrome Metallic Shaft */}
        <div className="w-3.5 sm:w-4 h-24 sm:h-28 bg-gradient-to-r from-stone-400 via-white to-stone-500 rounded-sm border-x border-stone-600 shadow-[2px_2px_8px_rgba(0,0,0,0.5)] -mt-1" />
      </div>

      {/* "PULL" Indicator Label below */}
      <div className="absolute bottom-2 text-center select-none pointer-events-none">
        <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-tighter block animate-pulse">
          ▼ DRAG
        </span>
      </div>

    </div>
  );
};
