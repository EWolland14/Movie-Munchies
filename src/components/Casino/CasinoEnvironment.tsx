import React from 'react';

interface CasinoEnvironmentProps {
  imageVariant?: 'floor' | 'ambience';
}

export const CasinoEnvironment: React.FC<CasinoEnvironmentProps> = ({
  imageVariant = 'floor',
}) => {
  const imageSrc = imageVariant === 'ambience'
    ? '/images/casino-ambience.jpg'
    : '/images/casino-floor.jpg';

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Real Vegas Casino Background Image */}
      <img
        src={imageSrc}
        alt="Authentic Casino Floor"
        className="w-full h-full object-cover object-center filter brightness-[0.38] contrast-[1.14] saturate-[1.12] scale-105 transition-all duration-700"
      />

      {/* 2. Top Header Scrim */}
      <div className="absolute top-0 inset-x-0 h-44 bg-gradient-to-b from-black/95 via-black/65 to-transparent" />

      {/* 3. Radial Depth Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 38%, rgba(0, 0, 0, 0.42) 0%, rgba(7, 9, 14, 0.82) 75%, rgba(4, 5, 8, 0.96) 100%)',
        }}
      />

      {/* 4. Warm Amber & Neon Glow Halo */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[520px] bg-gradient-to-r from-red-600/10 via-amber-500/15 to-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      {/* 5. Deep Base Vignette */}
      <div className="absolute bottom-0 inset-x-0 h-[480px] bg-gradient-to-t from-[#07090e] via-[#07090e]/85 to-transparent pointer-events-none" />
    </div>
  );
};
