import React from 'react';
import { Volume2, VolumeX, Sparkles, Film, Flame, Cookie } from 'lucide-react';
import { toggleCasinoAmbience } from '../../utils/sound';

export type VibeStakeTier = 'casual' | 'double-feature' | 'midnight-binge';

interface VibeStakesBarProps {
  stakeTier: VibeStakeTier;
  onChangeStakeTier: (tier: VibeStakeTier) => void;
  ambienceEnabled: boolean;
  onToggleAmbience: () => void;
}

export const VibeStakesBar: React.FC<VibeStakesBarProps> = ({
  stakeTier,
  onChangeStakeTier,
  ambienceEnabled,
  onToggleAmbience,
}) => {
  const handleToggleAmbienceClick = () => {
    const next = !ambienceEnabled;
    onToggleAmbience();
    toggleCasinoAmbience(next);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 px-3 sm:px-4 py-2.5 rounded-2xl bg-stone-900/80 border border-amber-500/30 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
      
      {/* Stakes Tier Selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          Vibe Stakes:
        </span>

        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-950 border border-white/5 text-xs">
          <button
            type="button"
            onClick={() => onChangeStakeTier('casual')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              stakeTier === 'casual'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            🍿 Standard Spin
          </button>

          <button
            type="button"
            onClick={() => onChangeStakeTier('double-feature')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              stakeTier === 'double-feature'
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold shadow-md shadow-red-900/50'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Spins a bonus companion film for a complete Double Feature night!"
          >
            <Film className="w-3 h-3" />
            <span>Double Feature</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-200">2x</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeStakeTier('midnight-binge')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              stakeTier === 'midnight-binge'
                ? 'bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold shadow-md shadow-purple-900/50'
                : 'text-stone-400 hover:text-white'
            }`}
            title="Adds a bonus dessert or craft cocktail pairing to your feast!"
          >
            <Cookie className="w-3 h-3" />
            <span>Midnight Feast</span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-amber-200">+Dessert</span>
          </button>
        </div>
      </div>

      {/* Right Controls: Combinations counter + Casino Floor Ambience audio */}
      <div className="flex items-center gap-3">
        {/* Combinations Counter */}
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-stone-400 bg-stone-950/70 px-2.5 py-1 rounded-lg border border-white/5">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>192 Curated Combinations</span>
        </div>

        {/* Casino Room Ambience Toggle */}
        <button
          type="button"
          onClick={handleToggleAmbienceClick}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
            ambienceEnabled
              ? 'bg-purple-900/30 border-purple-500/40 text-purple-300'
              : 'bg-stone-950 border-white/10 text-stone-400 hover:text-white'
          }`}
          title={ambienceEnabled ? 'Mute Casino Floor Ambience' : 'Enable Casino Floor Ambience'}
        >
          {ambienceEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="text-[11px]">Casino Room On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              <span className="text-[11px]">Casino Room Off</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};
