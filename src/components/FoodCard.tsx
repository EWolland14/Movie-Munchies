import React from 'react';
import { FoodOption } from '../types';
import { Utensils, Sparkles, GlassWater, CheckCircle2 } from 'lucide-react';

interface FoodCardProps {
  food: FoodOption;
  thematicTieIn: string;
  onRespinFood: () => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  thematicTieIn,
  onRespinFood,
}) => {
  return (
    <div className="flex flex-col h-full rounded-2xl bg-cinema-900/60 border border-white/10 p-5 sm:p-6 relative group overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cinema-gold/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-cinema-gold/15 text-cinema-gold border-cinema-gold/30">
            <Utensils className="w-3.5 h-3.5" />
            The Feast Pairing
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/5 border border-white/10 text-slate-200">
            {food.emoji} {food.genre}
          </span>
        </div>

        <button
          onClick={onRespinFood}
          className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          title="Respin just this food"
        >
          🔄 Respin Food
        </button>
      </div>

      {/* Main Title & Vibe */}
      <div className="mb-4">
        <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
          <span>{food.emoji}</span>
          <span>{food.vibeTitle}</span>
        </h3>
      </div>

      {/* Thematic Tie-In Callout */}
      <div className="mb-5 p-4 rounded-xl bg-gradient-to-r from-cinema-gold/15 via-cinema-gold/5 to-transparent border border-cinema-gold/30 text-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-cinema-gold uppercase tracking-wider mb-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          The Oracle's Thematic Tie-In
        </div>
        <p className="text-sm font-medium leading-relaxed text-slate-100">
          "{thematicTieIn}"
        </p>
      </div>

      {/* Curated Order Items */}
      <div className="space-y-2.5 flex-1">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Suggested Order Blueprint:
        </div>

        <div className="grid gap-2.5">
          {food.curatedOrder.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-cinema-850/80 border border-white/5 hover:border-white/15 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cinema-neon flex-shrink-0" />
                  {item.name}
                </span>
                {item.tag && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cinema-neon/15 text-cinema-neon border border-cinema-neon/30 flex-shrink-0">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 pl-6">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Drink Pairing Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-slate-300">
        <GlassWater className="w-4 h-4 text-cinema-neon flex-shrink-0" />
        <span>
          <strong className="text-slate-200">Drink Synergy:</strong> {food.drinkPairing}
        </span>
      </div>
    </div>
  );
};
