export type MovieGenre = 
  | 'Action' 
  | 'Comedy' 
  | 'Sci-Fi' 
  | 'Horror' 
  | 'Drama' 
  | 'Animation'
  | 'Thriller'
  | 'Crime';

export type FoodGenre = 
  | 'Italian' 
  | 'Mexican' 
  | 'Burgers & Fries' 
  | 'Sushi' 
  | 'Thai' 
  | 'Comfort Junk Food'
  | 'Indian'
  | 'BBQ & Wings';

export type RuntimeCategory = 'any' | 'quick' | 'standard' | 'epic';

export interface Movie {
  id: string;
  title: string;
  year: number;
  runtime: number; // in minutes
  runtimeCategory: 'quick' | 'standard' | 'epic';
  genres: MovieGenre[];
  streamingPlatform: 'Netflix' | 'Max' | 'Hulu' | 'Prime Video' | 'Disney+' | 'Apple TV+';
  rating: number; // IMDb style 0.0 - 10.0
  rottenTomatoes?: number; // e.g. 94%
  logline: string;
  posterUrl: string;
  director: string;
  leadActors?: string[];
  recommendedFoodVibes?: FoodGenre[];
}

export interface RecipeIngredient {
  item: string;
  amount: string;
  category?: string;
}

export interface RecipeInstruction {
  step: number;
  instruction: string;
  tip?: string;
}

export interface Recipe {
  dishName: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  servings: string;
  calories?: string;
  description: string;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  chefTips: string;
  equipment: string[];
}

export interface FoodOption {
  id: string;
  genre: FoodGenre;
  vibeTitle: string;
  emoji: string;
  imageUrl?: string;
  thematicTieIns: Record<string, string>; // mapping from MovieGenre or specific film vibe to funny rationale
  defaultTieIn: string;
  curatedOrder: {
    name: string;
    description: string;
    tag?: string;
  }[];
  drinkPairing: string;
  recipe?: Recipe;
}

export interface Restaurant {
  name: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  priceTier: '$' | '$$' | '$$$';
  specialty: string;
  addressSnippet: string;
}

export interface FilterState {
  runtime: RuntimeCategory;
  maxRuntimeSlider: number; // 60 to 210 mins
  selectedGenres: MovieGenre[];
  selectedFoodGenre: FoodGenre | 'all';
  location: string;
}

export interface SavedPairing {
  id: string;
  savedAt: string;
  location: string;
  movie: Movie;
  food: FoodOption;
  thematicTieIn: string;
  restaurants: Restaurant[];
  databaseName?: string;
  stakeTier?: string;
  savedBy?: string;
  savedByAvatar?: string;
}
