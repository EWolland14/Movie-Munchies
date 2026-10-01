import { VolumeX, Sparkles, Film, Flame, Cookie } from 'lucide-react';
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
    <div className="w-full max-w-5xl mx-auto mb-6 px-4 py-3 rounded-2xl bg-stone-900/90 border border-amber-500/40 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.15)] flex flex-wrap items-center justify-center gap-3 text-center">
      
      {/* Vibe Stakes Label */}
      <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/30">
        <Flame className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        Vibe Stakes:
      </span>

      {/* Centered Tier Selector Buttons */}
      <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-950 border border-white/10 text-xs shadow-inner">
        <button
          type="button"
          onClick={() => onChangeStakeTier('casual')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            stakeTier === 'casual'
              ? 'bg-amber-400 text-stone-950 shadow-md shadow-amber-400/30 scale-[1.02]'
              : 'text-stone-400 hover:text-white hover:bg-white/5'
          }`}
        >
          🍿 Standard Spin
        </button>

        <button
          type="button"
          onClick={() => onChangeStakeTier('double-feature')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            stakeTier === 'double-feature'
              ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-md shadow-red-900/50 scale-[1.02]'
              : 'text-stone-400 hover:text-white hover:bg-white/5'
          }`}
          title="Spins a bonus companion film for a complete Double Feature marathon!"
        >
          <Film className="w-3.5 h-3.5" />
          <span>Double Feature</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/50 text-amber-200 border border-amber-300/30">2x</span>
        </button>

        <button
          type="button"
          onClick={() => onChangeStakeTier('midnight-binge')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            stakeTier === 'midnight-binge'
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md shadow-purple-900/50 scale-[1.02]'
              : 'text-stone-400 hover:text-white hover:bg-white/5'
          }`}
          title="Adds a gourmet bonus dessert or craft drink pairing to your feast!"
        >
          <Cookie className="w-3.5 h-3.5" />
          <span>Midnight Feast</span>
          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-black/50 text-purple-200 border border-purple-300/30">+Dessert</span>
        </button>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px h-6 bg-white/10" />

      {/* Curated Jackpots Badge */}
      <div className="flex items-center gap-1.5 text-stone-300 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-white/10 shadow-sm text-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-mono font-bold text-amber-300">192+</span>
        <span className="text-stone-400">Curated Jackpots</span>
      </div>

      {/* Centered Vegas Music Toggle */}
      <button
        type="button"
        onClick={handleToggleAmbienceClick}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md ${
          ambienceEnabled
            ? 'bg-gradient-to-r from-amber-500/20 to-purple-600/30 border-amber-400/60 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
            : 'bg-stone-950 border-white/10 text-stone-400 hover:text-white hover:border-white/20'
        }`}
        title={ambienceEnabled ? 'Mute Upbeat Vegas Groove' : 'Play Upbeat Vegas Groove'}
      >
        {ambienceEnabled ? (
          <>
            <div className="flex items-end gap-0.5 h-3.5">
              <span className="w-0.5 h-2.5 bg-amber-400 animate-pulse" />
              <span className="w-0.5 h-3.5 bg-yellow-300 animate-bounce" />
              <span className="w-0.5 h-1.5 bg-amber-400 animate-pulse" />
            </div>
            <span className="font-mono text-[11px] tracking-wide">Vegas Groove ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono text-[11px] tracking-wide">Vegas Music OFF</span>
          </>
        )}
      </button>

    </div>
  );
};
