import React from 'react';
import { FilterState, MovieGenre, FoodGenre, RuntimeCategory } from '../types';
import { Clock, Film, Utensils, MapPin, Sparkles, RotateCcw } from 'lucide-react';

interface FilterControlsProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onResetFilters: () => void;
}

const ALL_GENRES: MovieGenre[] = [
  'Action',
  'Comedy',
  'Sci-Fi',
  'Horror',
  'Drama',
  'Animation',
  'Thriller',
  'Crime'
];

const ALL_FOODS: { id: FoodGenre; name: string; emoji: string }[] = [
  { id: 'Italian', name: 'Italian Pizza & Pasta', emoji: '🍕' },
  { id: 'Mexican', name: 'Tacos & Birria', emoji: '🌮' },
  { id: 'Burgers & Fries', name: 'Smashburgers & Fries', emoji: '🍔' },
  { id: 'Sushi', name: 'Sushi & Crispy Rice', emoji: '🍣' },
  { id: 'Thai', name: 'Thai Noodles & Curry', emoji: '🍜' },
  { id: 'Comfort Junk Food', name: 'Comfort Junk Food', emoji: '🧀' },
  { id: 'Indian', name: 'Butter Chicken & Naan', emoji: '🍛' },
  { id: 'BBQ & Wings', name: 'Smoked BBQ & Wings', emoji: '🍗' },
];

const RUNTIME_PRESETS: { label: string; desc: string; category: RuntimeCategory; maxMins: number }[] = [
  { label: 'Any Time', desc: 'No limits', category: 'any', maxMins: 210 },
  { label: 'Quick Snack', desc: '< 100 mins', category: 'quick', maxMins: 100 },
  { label: 'Standard Feature', desc: '100 - 140 mins', category: 'standard', maxMins: 140 },
  { label: 'Cinematic Epic', desc: '> 140 mins', category: 'epic', maxMins: 210 },
];

const POPULAR_CITIES = ['New York, NY', 'Austin, TX', 'Los Angeles, CA', 'Chicago, IL'];

export const FilterControls: React.FC<FilterControlsProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  const toggleGenre = (genre: MovieGenre) => {
    let nextGenres: MovieGenre[];
    if (filters.selectedGenres.includes(genre)) {
      nextGenres = filters.selectedGenres.filter((g) => g !== genre);
    } else {
      nextGenres = [...filters.selectedGenres, genre];
    }
    onFilterChange({ ...filters, selectedGenres: nextGenres });
  };

  const selectAllGenres = () => {
    onFilterChange({ ...filters, selectedGenres: [...ALL_GENRES] });
  };

  const clearGenres = () => {
    onFilterChange({ ...filters, selectedGenres: [] });
  };

  const handleRuntimePreset = (category: RuntimeCategory, maxMins: number) => {
    onFilterChange({
      ...filters,
      runtime: category,
      maxRuntimeSlider: maxMins,
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    let category: RuntimeCategory = 'any';
    if (val <= 100) category = 'quick';
    else if (val <= 140) category = 'standard';
    else category = 'epic';

    onFilterChange({
      ...filters,
      maxRuntimeSlider: val,
      runtime: category,
    });
  };

  return (
    <section className="w-full glass-panel rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/10">
      {/* Background glow orb */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cinema-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cinema-crimson/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cinema-gold animate-pulse" />
            Curate Your Night Vibe
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Tune your mood, runtime constraints, and culinary cravings.
          </p>
        </div>

        <button
          onClick={onResetFilters}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        
        {/* Left Column: Movie Runtime & Genres (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Runtime Slider & Presets */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cinema-crimson" />
                Runtime Duration
              </label>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-cinema-900 border border-white/10 text-cinema-gold">
                Up to {filters.maxRuntimeSlider} mins
              </span>
            </div>

            {/* Slider bar */}
            <div className="space-y-2">
              <input
                type="range"
                min="75"
                max="210"
                step="5"
                value={filters.maxRuntimeSlider}
                onChange={handleSliderChange}
                className="w-full h-2 bg-cinema-800 rounded-lg appearance-none cursor-pointer accent-cinema-crimson focus:outline-none"
              />
              <div className="flex justify-between text-[11px] text-slate-400 px-1">
                <span>⚡ Quick (&lt;100m)</span>
                <span>🍿 Standard (~120m)</span>
                <span>👑 Epic (&gt;150m)</span>
              </div>
            </div>

            {/* Runtime Preset Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
              {RUNTIME_PRESETS.map((preset) => {
                const isSelected = filters.runtime === preset.category;
                return (
                  <button
                    key={preset.category}
                    onClick={() => handleRuntimePreset(preset.category, preset.maxMins)}
                    className={`px-3 py-2 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-cinema-crimson bg-cinema-crimson/20 text-white shadow-glow-crimson/20'
                        : 'border-white/5 bg-cinema-900/60 hover:bg-cinema-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 opacity-80">{preset.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Movie Genre Checkboxes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Film className="w-4 h-4 text-cinema-gold" />
                Movie Genres
              </label>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={selectAllGenres}
                  className="text-cinema-gold hover:underline"
                >
                  All
                </button>
                <span className="text-slate-600">•</span>
                <button
                  onClick={clearGenres}
                  className="text-slate-400 hover:underline"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {ALL_GENRES.map((genre) => {
                const checked = filters.selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                      checked
                        ? 'bg-cinema-gold/15 border-cinema-gold text-cinema-gold shadow-glow-gold/20'
                        : 'bg-cinema-900/40 border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${checked ? 'bg-cinema-gold' : 'bg-slate-600'}`} />
                    {genre}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Food Vibe & Location (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 3. Food Genre / Vibe Selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-cinema-neon" />
                Food Genre / Delivery Vibe
              </label>
              <span className="text-xs text-slate-400">
                {filters.selectedFoodGenre === 'all' ? 'Any Munchie' : filters.selectedFoodGenre}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {/* Surprise Me / Any Option */}
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, selectedFoodGenre: 'all' })}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-left text-xs transition-all ${
                  filters.selectedFoodGenre === 'all'
                    ? 'border-cinema-neon bg-cinema-neon/15 text-cinema-neon font-semibold'
                    : 'border-white/5 bg-cinema-900/50 hover:bg-cinema-800/60 text-slate-300'
                }`}
              >
                <span className="text-base">✨</span>
                <span>Surprise Me (Any)</span>
              </button>

              {ALL_FOODS.map((food) => {
                const isSelected = filters.selectedFoodGenre === food.id;
                return (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => onFilterChange({ ...filters, selectedFoodGenre: food.id })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-cinema-neon bg-cinema-neon/15 text-cinema-neon font-semibold shadow-glow-neon/20'
                        : 'border-white/5 bg-cinema-900/50 hover:bg-cinema-800/60 text-slate-300'
                    }`}
                  >
                    <span className="text-base">{food.emoji}</span>
                    <span className="truncate">{food.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Zip code or City input for Local Context */}
          <div>
            <label className="text-sm font-semibold text-slate-200 flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-cinema-gold" />
              Your City or Zip Code (Local Spot Finder)
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.location}
                onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                placeholder="e.g. 78701 or Austin, TX"
                className="w-full bg-cinema-900/80 border border-white/10 rounded-xl px-4 py-2.5 pl-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cinema-gold focus:ring-1 focus:ring-cinema-gold transition-colors"
              />
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>

            {/* Quick city suggestions */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 mr-1">Quick Picks:</span>
              {POPULAR_CITIES.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => onFilterChange({ ...filters, location: city })}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
