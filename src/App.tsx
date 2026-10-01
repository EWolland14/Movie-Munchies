import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { FilterControls } from './components/FilterControls';
import { CasinoEnvironment } from './components/Casino/CasinoEnvironment';
import { VibeStakesBar, VibeStakeTier } from './components/Casino/VibeStakesBar';
import { CasinoSlotMachine } from './components/SlotMachine/CasinoSlotMachine';
import { ResultCard } from './components/ResultCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { FilterState, Movie, FoodOption, Restaurant, SavedPairing, MovieGenre, FoodGenre, RuntimeCategory } from './types';
import { MOCK_MOVIES } from './data/mockMovies';
import { MOCK_FOODS, getThematicTieIn } from './data/mockFoods';
import { getNearbyRestaurants } from './data/mockRestaurants';
import { Compass, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import {
  savePairingToDatabase,
  getAllPairingsFromDatabase,
  deletePairingFromDatabase,
  clearAllPairingsFromDatabase,
  DatabaseWriteConfirmation,
  DB_NAME
} from './services/db';

const STORAGE_KEY_SAVED = 'movie_munchies_saved_pairings_v1';
const STORAGE_KEY_SOUND = 'movie_munchies_sound_enabled';
const STORAGE_KEY_USER = 'movie_munchies_current_user';

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
  const [companionMovie, setCompanionMovie] = useState<Movie | null>(null);
  const [currentFood, setCurrentFood] = useState<FoodOption | null>(null);
  const [thematicTieIn, setThematicTieIn] = useState<string>('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [dbConfirmation, setDbConfirmation] = useState<DatabaseWriteConfirmation | null>(null);

  // Multi-user profile state (User 1 vs User 2 vs custom)
  const [currentUser, setCurrentUser] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_USER) || 'User 1';
    } catch {
      return 'User 1';
    }
  });

  const handleSetUser = (user: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEY_USER, user);
    } catch {
      // Ignore
    }
  };

  // Casino Vibe Stakes & Ambience state
  const [stakeTier, setStakeTier] = useState<VibeStakeTier>('casual');
  const [ambienceEnabled, setAmbienceEnabled] = useState<boolean>(false);

  // Sound preference state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Saved Pairings in localStorage & movie-munchies-db
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
    // If Double Feature stake active, pick a complementary companion movie!
    if (stakeTier === 'double-feature') {
      const companion = pickMovie(genre, undefined, movie.id);
      setCompanionMovie(companion);
    } else {
      setCompanionMovie(null);
    }

    setCurrentFood(food);
    setThematicTieIn(tieIn);
    setRestaurants(spots);
    setIsLocked(false);
    setDbConfirmation(null);
  };

  // Respin only the movie
  const handleRespinMovie = () => {
    if (!currentMovie || !currentFood) return;
    const movie = pickMovie(undefined, undefined, currentMovie.id);
    const tieIn = getThematicTieIn(currentFood, movie.genres);

    setCurrentMovie(movie);
    if (stakeTier === 'double-feature') {
      const companion = pickMovie(undefined, undefined, movie.id);
      setCompanionMovie(companion);
    }
    setThematicTieIn(tieIn);
    setIsLocked(false);
    setDbConfirmation(null);
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
    setDbConfirmation(null);
  };

  // Lock In pairing & commit directly to movie-munchies-db
  const handleLockIn = async () => {
    if (!currentMovie || !currentFood) return;

    const newSaved: SavedPairing = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      savedAt: new Date().toISOString(),
      location: filters.location,
      movie: currentMovie,
      food: currentFood,
      thematicTieIn,
      restaurants,
      databaseName: DB_NAME,
      stakeTier,
      savedBy: currentUser,
    };

    // Transactional write to movie-munchies-db
    const confirmation = await savePairingToDatabase(newSaved);
    setSavedPairings((prev) => [newSaved, ...prev.filter((p) => p.id !== newSaved.id)]);
    setIsLocked(true);
    setDbConfirmation(confirmation);
  };

  // Load past combo from history drawer
  const handleSelectFromHistory = (pairing: SavedPairing) => {
    setCurrentMovie(pairing.movie);
    setCurrentFood(pairing.food);
    setThematicTieIn(pairing.thematicTieIn);
    setRestaurants(pairing.restaurants || getNearbyRestaurants(pairing.food.genre, pairing.location));
    setCompanionMovie(null);
    setIsLocked(true);
    setDbConfirmation({
      success: true,
      databaseName: DB_NAME,
      recordId: pairing.id,
      timestamp: new Date(pairing.savedAt).toLocaleTimeString(),
      movieTitle: pairing.movie.title,
      category: pairing.movie.genres.join(', '),
      runtime: `${pairing.movie.runtime}m (${pairing.movie.runtimeCategory})`,
      savedBy: pairing.savedBy || 'User 1'
    });
  };

  const handleDeleteSaved = async (id: string) => {
    await deletePairingFromDatabase(id);
    setSavedPairings((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearAllSaved = async () => {
    if (window.confirm(`Purge all records from database ${DB_NAME}?`)) {
      await clearAllPairingsFromDatabase();
      setSavedPairings([]);
      setDbConfirmation(null);
    }
  };

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  // Live auto-sync with movie-munchies-db so both User 1 and User 2 see each other's saved movie nights in real-time
  useEffect(() => {
    let isMounted = true;

    const syncRecords = async () => {
      try {
        const records = await getAllPairingsFromDatabase();
        if (isMounted && records) {
          setSavedPairings(records);
        }
      } catch (e) {
        console.warn('Could not sync movie-munchies-db:', e);
      }
    };

    syncRecords();
    const intervalId = setInterval(syncRecords, 4000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);


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
    <div className="min-h-screen bg-stone-950 text-slate-100 flex flex-col relative selection:bg-red-600 selection:text-white overflow-x-hidden">
      
      {/* 1. Photorealistic Vegas Casino Floor Environment (matches reference Image 1) */}
      <CasinoEnvironment />

      {/* Navigation Header */}
      <Navbar
        currentUser={currentUser}
        onSelectUser={handleSetUser}
        savedCount={savedPairings.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />


      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10 relative z-10">
        
        {/* Full-Width Expansive Hero Section */}
        <div className="text-center w-full max-w-6xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/90 border border-red-500/50 text-amber-300 text-xs font-mono font-black uppercase tracking-widest mb-4 shadow-[0_0_20px_rgba(239,68,68,0.4)]">
            <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
            Vegas High Roller Cinema Randomizer &amp; Kitchen Oracle
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_5px_20px_rgba(0,0,0,0.9)]">
            Pull The Lever.{' '}
            <span className="bg-gradient-to-r from-yellow-200 via-amber-400 to-amber-500 bg-clip-text text-transparent underline decoration-amber-500/30 decoration-wavy">
              Hit The Jackpot.
            </span>{' '}
            Feast Tonight.
          </h1>
          <p className="mt-3.5 text-stone-200 text-base sm:text-lg md:text-xl font-medium max-w-4xl mx-auto drop-shadow-md leading-relaxed">
            Drag the mechanical arm to spin Cinema Genre, Runtime, and Delivery Feast in high-suspense deceleration—then choose between instant delivery or chef-crafted home recipes!
          </p>
        </div>

        {/* Live Vegas Cinephile Marquee Ticker */}
        <div className="w-full max-w-6xl mx-auto mb-6 overflow-hidden rounded-2xl bg-stone-950/90 border border-amber-500/30 p-2.5 text-xs font-mono backdrop-blur-xl shadow-lg">
          <div className="flex items-center gap-6 whitespace-nowrap overflow-x-auto no-scrollbar py-0.5 px-3 text-stone-300">
            <span className="inline-flex items-center gap-2 text-amber-400 font-bold flex-shrink-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              LIVE CASINO FEED:
            </span>
            <span className="text-stone-300 flex-shrink-0">
              🎬 <strong>High Roller Hit:</strong> Into the Spider-Verse + Fiery Drunken Noodles
            </span>
            <span className="text-amber-500 flex-shrink-0">•</span>
            <span className="text-stone-300 flex-shrink-0">
              🍳 <strong>Chef Station:</strong> 8 Gourmet Cook-at-Home Recipes Unlocked
            </span>
            <span className="text-amber-500 flex-shrink-0">•</span>
            <span className="text-stone-300 flex-shrink-0">
              ⚡ <strong>192 Curated Combos:</strong> 100% Payout Rate / Zero House Edge
            </span>
            <span className="text-amber-500 flex-shrink-0">•</span>
            <span className="text-stone-300 flex-shrink-0">
              🍿 <strong>VIP Perks:</strong> Double Feature 2x &amp; Midnight Feast Dessert Boost
            </span>
          </div>
        </div>

        {/* Casino Vibe Stakes & Ambience Bar */}
        <VibeStakesBar
          stakeTier={stakeTier}
          onChangeStakeTier={setStakeTier}
          ambienceEnabled={ambienceEnabled}
          onToggleAmbience={() => setAmbienceEnabled(!ambienceEnabled)}
        />

        {/* 3D VEGAS CASINO SLOT MACHINE (matches reference Image 2) */}
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
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-white/10 bg-stone-900/80 hover:bg-stone-800 text-slate-300 hover:text-white transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
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
              companionMovie={companionMovie}
              stakeTier={stakeTier}
              food={currentFood}
              thematicTieIn={thematicTieIn}
              restaurants={restaurants}
              location={filters.location}
              isLocked={isLocked}
              dbConfirmation={dbConfirmation}
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
      <footer className="w-full border-t border-white/10 py-8 mt-16 bg-stone-950/80 backdrop-blur-md text-center text-xs text-stone-500 relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base">🎰</span>
            <span className="font-bold text-stone-300">The Movie & Munchies Oracle</span>
            <span>• Vegas Casino High Roller Edition</span>
          </div>
          <div>
            Crafted for Film Cinephiles &amp; Hungry High Rollers
          </div>
        </div>
      </footer>

      {/* Saved Pairings Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        savedPairings={savedPairings}
        currentUser={currentUser}
        onSelectPairing={handleSelectFromHistory}
        onDeletePairing={handleDeleteSaved}
        onClearAll={handleClearAllSaved}
      />

    </div>
  );
}

export default App;
