import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterControls } from './components/FilterControls';
import { SpinReelAnimation } from './components/SpinReelAnimation';
import { ResultCard } from './components/ResultCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FilterState, Movie, FoodOption, Restaurant, SavedPairing } from './types';
import { MOCK_MOVIES } from './data/mockMovies';
import { MOCK_FOODS, getThematicTieIn } from './data/mockFoods';
import { getNearbyRestaurants } from './data/mockRestaurants';
import { playSuccessSound } from './utils/sound';
import { Compass, AlertCircle } from 'lucide-react';

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
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [filterFallbackNotice, setFilterFallbackNotice] = useState<string | null>(null);

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

  // Helper to pick a movie matching current filters
  const pickMovie = useCallback((excludeId?: string): { movie: Movie; fallback: boolean } => {
    let pool = MOCK_MOVIES.filter((m) => {
      if (excludeId && m.id === excludeId && MOCK_MOVIES.length > 1) {
        return false;
      }

      // Check runtime slider
      if (m.runtime > filters.maxRuntimeSlider) return false;

      // Check runtime category if specific
      if (filters.runtime !== 'any' && m.runtimeCategory !== filters.runtime) {
        return false;
      }

      // Check genres
      if (filters.selectedGenres.length > 0) {
        const hasGenre = m.genres.some((g) => filters.selectedGenres.includes(g));
        if (!hasGenre) return false;
      }

      return true;
    });

    let fallback = false;
    // Fallback if filters are too restrictive
    if (pool.length === 0) {
      fallback = true;
      pool = MOCK_MOVIES.filter((m) => m.id !== excludeId);
      if (pool.length === 0) pool = MOCK_MOVIES;
    }

    const randomIndex = Math.floor(Math.random() * pool.length);
    return { movie: pool[randomIndex], fallback };
  }, [filters]);

  // Helper to pick a food option
  const pickFood = useCallback((movie: Movie, excludeId?: string): FoodOption => {
    if (filters.selectedFoodGenre !== 'all') {
      const specific = MOCK_FOODS.find((f) => f.genre === filters.selectedFoodGenre);
      if (specific) return specific;
    }

    let foodPool = MOCK_FOODS.filter((f) => !excludeId || f.id !== excludeId);
    if (foodPool.length === 0) foodPool = MOCK_FOODS;

    // Favor recommended food vibes for the movie if available
    if (movie.recommendedFoodVibes && movie.recommendedFoodVibes.length > 0) {
      const recommendedFoods = foodPool.filter((f) =>
        movie.recommendedFoodVibes?.includes(f.genre)
      );
      if (recommendedFoods.length > 0 && Math.random() > 0.3) {
        return recommendedFoods[Math.floor(Math.random() * recommendedFoods.length)];
      }
    }

    return foodPool[Math.floor(Math.random() * foodPool.length)];
  }, [filters.selectedFoodGenre]);

  // Execute full randomizer spin
  const handleSpinTheNight = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setIsLocked(false);
    setFilterFallbackNotice(null);

    // Duration of slot reel shuffle
    setTimeout(() => {
      const { movie, fallback } = pickMovie();
      const food = pickFood(movie);
      const tieIn = getThematicTieIn(food, movie.genres);
      const spots = getNearbyRestaurants(food.genre, filters.location);

      setCurrentMovie(movie);
      setCurrentFood(food);
      setThematicTieIn(tieIn);
      setRestaurants(spots);
      setIsSpinning(false);

      if (fallback) {
        setFilterFallbackNotice('We expanded your filters slightly so you never go empty-handed!');
      } else {
        setFilterFallbackNotice(null);
      }

      playSuccessSound(soundEnabled);
    }, 1100);
  };

  // Respin only the movie
  const handleRespinMovie = () => {
    if (!currentMovie || !currentFood) return;
    const { movie, fallback } = pickMovie(currentMovie.id);
    const tieIn = getThematicTieIn(currentFood, movie.genres);

    setCurrentMovie(movie);
    setThematicTieIn(tieIn);
    setIsLocked(false);

    if (fallback) {
      setFilterFallbackNotice('Filters broadened to find another film!');
    }
  };

  // Respin only the food
  const handleRespinFood = () => {
    if (!currentMovie || !currentFood) return;
    const food = pickFood(currentMovie, currentFood.id);
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
    setFilterFallbackNotice(null);
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
    const { movie } = pickMovie();
    const food = pickFood(movie);
    const tieIn = getThematicTieIn(food, movie.genres);
    const spots = getNearbyRestaurants(food.genre, INITIAL_FILTERS.location);

    setCurrentMovie(movie);
    setCurrentFood(food);
    setThematicTieIn(tieIn);
    setRestaurants(spots);
  }, []);

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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        
        {/* Hero Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cinema-gold/10 border border-cinema-gold/30 text-cinema-gold text-xs font-bold uppercase tracking-wider mb-4 shadow-glow-gold/20">
            <Compass className="w-3.5 h-3.5" />
            The Ultimate Antidote to Decision Fatigue
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            One Spin.{' '}
            <span className="bg-gradient-to-r from-cinema-gold via-amber-400 to-cinema-crimson bg-clip-text text-transparent">
              One Epic Film.
            </span>{' '}
            The Perfect Feast.
          </h1>
          <p className="mt-4 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Stop endlessly scrolling catalogs while dinner gets cold. Let the Oracle pair a cinema masterpiece with local delivery munchies.
          </p>
        </div>

        {/* Filter Controls Panel */}
        <FilterControls
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={handleResetFilters}
        />

        {/* The Randomizer Engine Button & Reel */}
        <SpinReelAnimation
          isSpinning={isSpinning}
          onSpin={handleSpinTheNight}
          soundEnabled={soundEnabled}
        />

        {/* Subtle notice if fallback occurred */}
        {filterFallbackNotice && (
          <div className="max-w-xl mx-auto mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-center gap-2 text-center animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{filterFallbackNotice}</span>
          </div>
        )}

        {/* Result Card Display */}
        {currentMovie && currentFood && (
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
            onRespinBoth={handleSpinTheNight}
            soundEnabled={soundEnabled}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 py-8 mt-16 bg-cinema-950/60 backdrop-blur-sm text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🍿</span>
            <span className="font-bold text-slate-400">The Movie & Munchies Oracle</span>
            <span>• Built for movie lovers & hungry cinephiles</span>
          </div>
          <div>
            Powered by React, Tailwind CSS & Thematic Cinema Curation
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
