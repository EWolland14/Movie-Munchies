import React from 'react';

export const CasinoEnvironment: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      
      {/* 1. Deep Casino Ceiling Ambient Glow (Magenta / Violet / Warm Amber) */}
      <div className="absolute top-0 inset-x-0 h-[480px] bg-gradient-to-b from-purple-950/70 via-fuchsia-950/40 to-transparent" />
      
      {/* Overhead Curved Neon Light Tubes (Inspired by Vegas Casino Coves) */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1100px] h-[350px] rounded-full border-b-[8px] border-fuchsia-500/25 blur-[10px]" />
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full border-b-[6px] border-amber-400/20 blur-[8px]" />
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full border-b-[4px] border-cyan-400/20 blur-[6px]" />

      {/* 2. Flanking Casino Slot Machine Rows in Bokeh Depth-of-Field */}
      
      {/* Left Row of Glowing Slot Cabinets */}
      <div className="absolute -left-16 sm:-left-8 top-28 w-44 sm:w-64 h-[650px] opacity-35 sm:opacity-45 blur-[4px] transform -rotate-6 select-none hidden md:block">
        <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-stone-900 via-stone-950 to-red-950 border-r-4 border-cyan-500/80 shadow-[0_0_40px_rgba(6,182,212,0.4)] p-4 flex flex-col justify-between">
          <div className="h-28 rounded-2xl bg-cyan-950/80 border border-cyan-400/50 shadow-[0_0_15px_#06b6d4] flex items-center justify-center">
            <span className="text-cyan-300 font-mono text-xs font-black tracking-widest animate-pulse">JACKPOT $14,890</span>
          </div>
          <div className="h-44 rounded-2xl bg-gradient-to-b from-blue-900/60 to-purple-900/60 border border-purple-500/40" />
          <div className="h-16 rounded-xl bg-red-950 border border-red-500/60 shadow-[0_0_20px_#ef4444]" />
        </div>
      </div>

      {/* Right Row of Glowing Slot Cabinets */}
      <div className="absolute -right-16 sm:-right-8 top-28 w-44 sm:w-64 h-[650px] opacity-35 sm:opacity-45 blur-[4px] transform rotate-6 select-none hidden md:block">
        <div className="w-full h-full rounded-3xl bg-gradient-to-tl from-stone-900 via-stone-950 to-red-950 border-l-4 border-fuchsia-500/80 shadow-[0_0_40px_rgba(217,70,239,0.4)] p-4 flex flex-col justify-between">
          <div className="h-28 rounded-2xl bg-fuchsia-950/80 border border-fuchsia-400/50 shadow-[0_0_15px_#d946ef] flex items-center justify-center">
            <span className="text-fuchsia-300 font-mono text-xs font-black tracking-widest animate-pulse">MEGA WIN $25,400</span>
          </div>
          <div className="h-44 rounded-2xl bg-gradient-to-b from-fuchsia-900/60 to-amber-900/60 border border-amber-500/40" />
          <div className="h-16 rounded-xl bg-amber-950 border border-amber-500/60 shadow-[0_0_20px_#f59e0b]" />
        </div>
      </div>

      {/* 3. Authentic Vegas Red & Black Geometric Patterned Casino Carpet (Bottom Perspective) */}
      <div className="absolute inset-x-0 bottom-0 h-[480px] bg-gradient-to-t from-stone-950 via-stone-950/95 to-transparent overflow-hidden">
        {/* Carpet Pattern Layer with 3D Perspective Plane */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 50% 100%, rgba(225, 29, 72, 0.4) 0%, transparent 70%),
              repeating-linear-gradient(45deg, #1c1917 0px, #1c1917 18px, #7f1d1d 19px, #7f1d1d 24px, #1c1917 25px, #1c1917 40px),
              repeating-linear-gradient(-45deg, #0c0a09 0px, #0c0a09 18px, #991b1b 19px, #991b1b 24px, #0c0a09 25px, #0c0a09 40px)
            `,
            transform: 'perspective(450px) rotateX(48deg) scale(1.6)',
            transformOrigin: 'bottom center',
          }}
        />

        {/* Floor Spotlight directly beneath our central slot machine */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[750px] h-[160px] bg-gradient-to-t from-amber-500/20 via-red-600/15 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Atmospheric Smoke / Haze */}
      <div className="absolute inset-0 bg-radial-gradient opacity-70" />

    </div>
  );
};
