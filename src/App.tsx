import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterControls } from './components/FilterControls';
import { CasinoSlotMachine } from './components/SlotMachine/CasinoSlotMachine';
import { ResultCard } from './components/ResultCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FilterState, Movie, FoodOption, Restaurant, SavedPairing, MovieGenre, FoodGenre, RuntimeCategory } from './types';
import { MOCK_MOVIES } from './data/mockMovies';
import { MOCK_FOODS, getThematicTieIn } from './data/mockFoods';
import { getNearbyRestaurants } from './data/mockRestaurants';
import { Compass, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';

const STORAGE_KEY_SAVED = 'movie_munchies_saved_pairings_v1';
const STORAGE_KEY_SOUND = 'movie_munchies_sound_enabled';

const INITIAL_FILTERS: FilterState = {
  runtime: 'any',
  maxRuntimeSlider: 170,
  selectedGenres: ['Action', 'Comedy', 'Sci-Fi', 'Horror', 'Drama', 'Animation', 'Thriller', 'Crime'],
  selectedFoodGenre: 'all',
  location: 'Austin, TX',
};

export function App() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [currentFood, setCurrentFood] = useState<FoodOption | null>(null);
  const [thematicTieIn, setThematicTieIn] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Sound preference state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Saved Pairings in localStorage
  const [savedPairings, setSavedPairings] = useState<SavedPairing[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Sync saved pairings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(savedPairings));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedPairings]);

  // Sync sound setting
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Helper to pick a movie matching filters
  const pickMovie = useCallback((genre?: MovieGenre, runtime?: RuntimeCategory, excludeId?: string): Movie => {
    let pool = MOCK_MOVIES.filter((m) => {
      if (excludeId && m.id === excludeId && MOCK_MOVIES.length > 1) return false;
      if (genre && !m.genres.includes(genre)) return false;
      if (runtime && runtime !== 'any' && m.runtimeCategory !== runtime) return false;
      return true;
    });

    if (pool.length === 0 && genre) {
      pool = MOCK_MOVIES.filter((m) => m.genres.includes(genre));
    }
    if (pool.length === 0) pool = MOCK_MOVIES;

    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }, []);

  // When Slot Machine finishes spinning all 3 category reels
  const handleSlotSpinComplete = ({
    genre,
    runtime,
    foodGenre,
  }: {
    genre: MovieGenre;
    runtime: RuntimeCategory;
    foodGenre: FoodGenre;
  }) => {
    const movie = pickMovie(genre, runtime, currentMovie?.id);
    const food = MOCK_FOODS.find((f) => f.genre === foodGenre) || MOCK_FOODS[0];
    const tieIn = getThematicTieIn(food, movie.genres);
    const spots = getNearbyRestaurants(food.genre, filters.location);

    setCurrentMovie(movie);
    setCurrentFood(food);
    setThematicTieIn(tieIn);
    setRestaurants(spots);
    setIsLocked(false);
  };

  // Respin only the movie
  const handleRespinMovie = () => {
    if (!currentMovie || !currentFood) return;
    const movie = pickMovie(undefined, undefined, currentMovie.id);
    const tieIn = getThematicTieIn(currentFood, movie.genres);

    setCurrentMovie(movie);
    setThematicTieIn(tieIn);
    setIsLocked(false);
  };

  // Respin only the food
  const handleRespinFood = () => {
    if (!currentMovie || !currentFood) return;
    const availableFoods = MOCK_FOODS.filter((f) => f.id !== currentFood.id);
    const food = availableFoods[Math.floor(Math.random() * availableFoods.length)] || MOCK_FOODS[0];
    const tieIn = getThematicTieIn(food, currentMovie.genres);
    const spots = getNearbyRestaurants(food.genre, filters.location);

    setCurrentFood(food);
    setThematicTieIn(tieIn);
    setRestaurants(spots);
    setIsLocked(false);
  };

  // Lock In pairing to localStorage
  const handleLockIn = () => {
    if (!currentMovie || !currentFood) return;

    const newSaved: SavedPairing = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      savedAt: new Date().toISOString(),
      location: filters.location,
      movie: currentMovie,
      food: currentFood,
      thematicTieIn,
      restaurants,
    };

    setSavedPairings((prev) => [newSaved, ...prev]);
    setIsLocked(true);
  };

  // Load past combo from history drawer
  const handleSelectFromHistory = (pairing: SavedPairing) => {
    setCurrentMovie(pairing.movie);
    setCurrentFood(pairing.food);
    setThematicTieIn(pairing.thematicTieIn);
    setRestaurants(pairing.restaurants || getNearbyRestaurants(pairing.food.genre, pairing.location));
    setIsLocked(true);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedPairings((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllSaved = () => {
    if (window.confirm('Clear all saved pairings from your history?')) {
      setSavedPairings([]);
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // On initial mount, spin a great starting pair
  useEffect(() => {
    const movie = pickMovie('Sci-Fi', 'epic');
    const food = MOCK_FOODS.find((f) => f.genre === 'Sushi') || MOCK_FOODS[0];
    const tieIn = getThematicTieIn(food, movie.genres);
    const spots = getNearbyRestaurants(food.genre, INITIAL_FILTERS.location);

    setCurrentMovie(movie);
    setCurrentFood(food);
    setThematicTieIn(tieIn);
    setRestaurants(spots);
  }, [pickMovie]);

  // Update restaurants when location input changes
  useEffect(() => {
    if (currentFood) {
      setRestaurants(getNearbyRestaurants(currentFood.genre, filters.location));
    }
  }, [filters.location, currentFood?.genre]);

  return (
    <div className="min-h-screen bg-cinema-950 text-slate-100 flex flex-col relative selection:bg-cinema-crimson selection:text-white">
      {/* Background radial atmosphere */}
      <div className="fixed inset-0 bg-radial-gradient pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cinema-crimson/5 blur-[140px] pointer-events-none rounded-full" />

      {/* Navigation Header */}
      <Navbar
        savedCount={savedPairings.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 relative z-10">
        
        {/* Hero Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold text-xs font-bold uppercase tracking-wider mb-3 shadow-glow-gold/20">
            <Compass className="w-3.5 h-3.5" />
            Vegas Casino Cinema Randomizer
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Pull The Lever.{' '}
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Hit The Jackpot.
            </span>{' '}
            Feast Tonight.
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Drag the mechanical arm or press spin to roll your Film Genre, Runtime Pace, and Delivery Munchies!
          </p>
        </div>

        {/* THE VEGAS CASINO SLOT MACHINE */}
        <CasinoSlotMachine
          onSpinComplete={handleSlotSpinComplete}
          activeMovie={currentMovie}
          activeFood={currentFood}
          soundEnabled={soundEnabled}
        />

        {/* Advanced Filters Drawer / Toggle */}
        <div className="max-w-2xl mx-auto my-6 text-center">
          <button
            type="button"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-white/10 bg-cinema-900/60 hover:bg-cinema-800 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cinema-gold" />
            <span>{showAdvancedFilters ? 'Hide Location & Preferences' : 'Customize Location & Preferences'}</span>
            {showAdvancedFilters ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Filter Controls Panel */}
        {showAdvancedFilters && (
          <div className="mb-10 transition-all duration-300">
            <FilterControls
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
            />
          </div>
        )}

        {/* Result Card Display */}
        {currentMovie && currentFood && (
          <div className="mt-8">
            <ResultCard
              movie={currentMovie}
              food={currentFood}
              thematicTieIn={thematicTieIn}
              restaurants={restaurants}
              location={filters.location}
              isLocked={isLocked}
              onLockIn={handleLockIn}
              onRespinMovie={handleRespinMovie}
              onRespinFood={handleRespinFood}
              onRespinBoth={handleRespinMovie}
              soundEnabled={soundEnabled}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-16 bg-cinema-950/60 backdrop-blur-sm text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🎰</span>
            <span className="font-bold text-slate-400">The Movie & Munchies Oracle</span>
            <span>• Vegas Casino Edition</span>
          </div>
          <div>
            Powered by React, Tailwind CSS & High-Stakes Cinema Curation
          </div>
        </div>
      </footer>

      {/* Saved Pairings Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPairings={savedPairings}
        onSelectPairing={handleSelectFromHistory}
        onDeletePairing={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
      />
    </div>
  );
}

export default App;
