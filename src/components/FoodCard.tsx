import React, { useState } from 'react';
import { FoodOption } from '../types';
import {
  Utensils,
  Sparkles,
  GlassWater,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  Users,
  Check,
  Copy,
  ShoppingBag,
  Info,
  Layers
} from 'lucide-react';
import { playRecipeCheckSound, playTabSwitchSound } from '../utils/sound';

interface FoodCardProps {
  food: FoodOption;
  thematicTieIn: string;
  onRespinFood: () => void;
  soundEnabled?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  thematicTieIn,
  onRespinFood,
  soundEnabled = true,
}) => {
  const [activeTab, setActiveTab] = useState<'delivery' | 'recipe'>('delivery');
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [copiedRecipe, setCopiedRecipe] = useState(false);

  const toggleTab = (tab: 'delivery' | 'recipe') => {
    setActiveTab(tab);
    playTabSwitchSound(soundEnabled);
  };

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => {
      const next = { ...prev, [idx]: !prev[idx] };
      if (next[idx]) {
        playRecipeCheckSound(soundEnabled);
      }
      return next;
    });
  };

  const handleCopyRecipe = async () => {
    if (!food.recipe) return;
    const { dishName, prepTime, cookTime, servings, ingredients, instructions, chefTips } = food.recipe;
    const text = `🍳 MOVIE & MUNCHIES CHEF RECIPE: ${dishName}\n` +
      `⏱️ Prep: ${prepTime} | Cook: ${cookTime} | Servings: ${servings}\n\n` +
      `🛒 INGREDIENTS:\n` +
      ingredients.map((ing) => `• ${ing.amount} ${ing.item}`).join('\n') +
      `\n\n👨‍🍳 DIRECTIONS:\n` +
      instructions.map((ins) => `${ins.step}. ${ins.instruction}`).join('\n') +
      `\n\n💡 CHEF SECRET: ${chefTips}\n` +
      `🍹 DRINK SYNERGY: ${food.drinkPairing}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setCopiedRecipe(true);
      setTimeout(() => setCopiedRecipe(false), 2500);
    }
  };

  return (
    <div className="flex flex-col h-full rounded-3xl bg-stone-900/80 border border-amber-500/30 p-5 sm:p-7 relative group overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge & Respin Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm">
            <Utensils className="w-3.5 h-3.5" />
            The Feast Pairing
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-950/80 border border-white/10 text-stone-200">
            {food.emoji} {food.genre}
          </span>
        </div>

        <button
          onClick={onRespinFood}
          className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-sm"
          title="Respin just this food"
        >
          🔄 Respin Food
        </button>
      </div>

      {/* Gourmet Photography Banner */}
      {food.imageUrl && (
        <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 relative border border-white/15 shadow-xl">
          <img
            src={food.imageUrl}
            alt={food.vibeTitle}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-amber-300 bg-stone-950/90 px-3 py-1 rounded-full border border-amber-500/40 shadow-md">
              ★ Curated Gourmet Dining
            </span>
            {food.recipe && (
              <span className="text-[11px] font-mono text-emerald-300 bg-emerald-950/90 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Cook at Home Ready
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Feast Title */}
      <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3">
        {food.vibeTitle}
      </h3>

      {/* Thematic Tie-In Callout */}
      <div className="mb-5 p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-stone-900/40 border border-amber-500/30 text-stone-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase tracking-wider mb-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          The Oracle's Thematic Tie-In
        </div>
        <p className="text-sm font-medium leading-relaxed text-stone-200 italic">
          "{thematicTieIn}"
        </p>
      </div>

      {/* Delivery vs Cook-at-Home Tabs */}
      <div className="flex items-center p-1 rounded-2xl bg-stone-950 border border-white/10 mb-5 shadow-inner">
        <button
          type="button"
          onClick={() => toggleTab('delivery')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'delivery'
              ? 'bg-amber-400 text-stone-950 shadow-md font-black scale-[1.01]'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Order Delivery Blueprint</span>
        </button>

        <button
          type="button"
          onClick={() => toggleTab('recipe')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recipe'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md font-black scale-[1.01]'
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Cook at Home Recipe</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-emerald-200 font-mono">
            New
          </span>
        </button>
      </div>

      {/* TAB CONTENT: DELIVERY BLUEPRINT */}
      {activeTab === 'delivery' && (
        <div className="space-y-3 flex-1 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider">
            <span>Suggested Order Blueprint:</span>
            <span className="text-stone-500 lowercase font-mono">3 items</span>
          </div>

          <div className="grid gap-2.5">
            {food.curatedOrder.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-stone-950/60 border border-white/5 hover:border-amber-400/20 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-sm text-white flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    {item.name}
                  </span>
                  {item.tag && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30 flex-shrink-0">
                      {item.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-400 mt-1 pl-6 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COOK-AT-HOME RECIPE */}
      {activeTab === 'recipe' && food.recipe && (
        <div className="space-y-4 flex-1 animate-fadeIn">
          {/* Recipe Quick Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5 text-center">
              <Clock className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
              <div className="text-[10px] text-stone-500 uppercase font-mono">Total Time</div>
              <div className="text-xs font-bold text-white">{food.recipe.totalTime}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5 text-center">
              <Flame className="w-3.5 h-3.5 text-orange-400 mx-auto mb-1" />
              <div className="text-[10px] text-stone-500 uppercase font-mono">Skill Level</div>
              <div className="text-xs font-bold text-amber-300">{food.recipe.difficulty}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5 text-center">
              <Users className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
              <div className="text-[10px] text-stone-500 uppercase font-mono">Yield</div>
              <div className="text-xs font-bold text-white">{food.recipe.servings}</div>
            </div>

            <div className="p-2.5 rounded-xl bg-stone-950 border border-white/5 text-center">
              <Layers className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
              <div className="text-[10px] text-stone-500 uppercase font-mono">Calories</div>
              <div className="text-xs font-bold text-purple-200">{food.recipe.calories || '700 kcal'}</div>
            </div>
          </div>

          {/* Dish Description & Equipment */}
          <div className="text-xs text-stone-300 bg-stone-950/40 p-3 rounded-xl border border-white/5 leading-relaxed">
            <p className="font-semibold text-white mb-2">{food.recipe.dishName}</p>
            <p className="text-stone-400">{food.recipe.description}</p>
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase">Equipment:</span>
              {food.recipe.equipment.map((eq, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-stone-300 border border-white/5">
                  {eq}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients Checklist */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              <span>Ingredients (Click to check off):</span>
              <span className="text-emerald-400 text-[11px] font-mono">
                {Object.values(checkedIngredients).filter(Boolean).length} / {food.recipe.ingredients.length} Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.recipe.ingredients.map((ing, idx) => {
                const isChecked = !!checkedIngredients[idx];
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleIngredient(idx)}
                    className={`flex items-start gap-2.5 p-2 rounded-xl text-left border transition-all ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-stone-400 line-through'
                        : 'bg-stone-950/60 border-white/5 hover:border-white/15 text-stone-200'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        isChecked
                          ? 'bg-emerald-500 border-emerald-500 text-stone-950'
                          : 'border-stone-600 bg-stone-900'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                    <span className="text-xs">
                      <strong className="text-white font-semibold">{ing.amount}</strong> {ing.item}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Directions */}
          <div>
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Step-by-Step Directions:
            </div>

            <div className="space-y-2">
              {food.recipe.instructions.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-3 p-3 rounded-xl bg-stone-950/60 border border-white/5 text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center flex-shrink-0 border border-amber-500/40">
                    {step.step}
                  </span>
                  <p className="text-stone-300 leading-relaxed pt-0.5">
                    {step.instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Chef Secret Box */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-amber-300 uppercase tracking-wide mb-1">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              Pitmaster &amp; Chef Secret Technique
            </div>
            <p className="text-stone-300 leading-relaxed">
              {food.recipe.chefTips}
            </p>
          </div>

          {/* Copy Recipe Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleCopyRecipe}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-950 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
            >
              {copiedRecipe ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Recipe Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Recipe Blueprint</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Drink Synergy Footer */}
      <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center gap-2 text-xs text-stone-300">
        <GlassWater className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          <strong className="text-stone-200">Drink Synergy:</strong> {food.drinkPairing}
        </span>
      </div>
    </div>
  );
};
