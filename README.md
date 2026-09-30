# 🍿 The Movie & Munchies Oracle

> **Stop scrolling. Start streaming and snacking.** The ultimate cure for decision paralysis, pairing curated films with the ideal food delivery feast based on runtime, mood, cravings, and local context.

---

## ✨ Features

- **🎬 Streaming App Aesthetic**: Sleek, immersive dark-mode interface inspired by Netflix and Max, featuring deep charcoals, glowing gold and crimson accents, and responsive glassmorphism cards.
- **🎛️ Dynamic Filter Controls**:
  - **Runtime Slider**: Filter movies by max duration or choose quick presets (*Quick Snack < 100 mins*, *Standard Feature ~120 mins*, *Cinematic Epic > 150 mins*).
  - **Movie Genre Multi-Select**: Seamlessly mix and match Action, Comedy, Sci-Fi, Horror, Drama, Animation, Thriller, and Crime.
  - **Food Genre & Vibe Selector**: Choose Italian, Mexican, Burgers & Fries, Sushi, Thai, Comfort Junk Food, Indian, or BBQ & Wings (or keep it on *Surprise Me*).
  - **Local Context Finder**: Enter your zip code or city (e.g. *78701* or *Austin, TX*) to customize local delivery recommendations.
- **🎰 The Randomizer Engine ("Spin the Night")**:
  - High-energy CTA with glowing ambient hover effects.
  - Satisfying 1.1s slot reel shuffle animation cycling titles, posters, and emojis.
  - Native Web Audio synthesizer clicks and celebration chimes (with global mute toggle).
  - Smart fallback algorithm ensuring you never hit a dead end if filters are restrictive.
- **🏆 Split Hero Result Card**:
  - **Movie Section**: High-res poster, streaming badge (*Netflix*, *Max*, *Prime Video*, *Hulu*, *Disney+*, *Apple TV+*), IMDb rating, Rotten Tomatoes score, year, runtime, director, and logline.
  - **Feast Section**: Food emoji, vibe title, "The Oracle's Thematic Tie-In" explanation, curated 3-item order blueprint with specialty badges, and recommended drink pairing.
  - **Local Spot Finder**: 2 nearby restaurant suggestions with real-world distance estimates, star ratings, delivery timeframes, price tiers, and clickable **Open Maps** and **Order Online** actions.
- **⚡ Action Controls & History**:
  - **Respin Movie**: Roll a different film matching your runtime and genres while keeping your current food.
  - **Respin Food**: Roll a different food pairing while preserving your current movie.
  - **Lock It In**: Saves the combo with timestamp and location to browser `localStorage` and triggers a celebratory confetti burst.
  - **Saved Nights Drawer**: Slide-out drawer to view, reload, delete, or clear saved movie night combinations.
  - **Share Night**: Copies a formatted text summary of your movie and meal straight to your clipboard.

---

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **Vite** (Next-generation frontend tooling)
- **Tailwind CSS** (Custom dark-mode cinema palette & glowing utilities)
- **Lucide React** (Clean icons)
- **Canvas Confetti** (Celebratory burst on lock-in)
- **Web Audio API** (Zero-asset sound effects synthesizer)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

```bash
# Clone the repository
git clone https://github.com/EWolland14/Movie-Munchies.git
cd Movie-Munchies

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Building for Production

```bash
npm run build
```

The optimized static build will be generated in the `dist/` directory.

---

## 📁 Project Structure

```text
Movie_Munchies/
├── index.html                   # HTML entry point with fonts & metadata
├── package.json                 # Dependencies & build scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Cinema theme & glowing shadows
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration
└── src/
    ├── main.tsx                 # React app root entry
    ├── App.tsx                  # Main layout, state orchestrator & logic
    ├── index.css                # Tailwind directives & glassmorphism
    ├── types/
    │   └── index.ts             # TypeScript interfaces for movies, food & filters
    ├── data/
    │   ├── mockMovies.ts        # Curated catalog of 30+ movies across genres
    │   ├── mockFoods.ts         # Food genres, curated menus & thematic tie-in rules
    │   └── mockRestaurants.ts   # Local spot generator & delivery search links
    ├── utils/
    │   └── sound.ts             # Web Audio API sound synthesis
    └── components/
        ├── Navbar.tsx           # Brand header, sound toggle & saved nights badge
        ├── FilterControls.tsx   # Runtime slider, genre tags & food vibe picker
        ├── SpinReelAnimation.tsx# CTA button & roulette reel animation
        ├── ResultCard.tsx       # Unified hero card with actions & confetti
        ├── MovieCard.tsx        # Movie poster, platform badge & details
        ├── FoodCard.tsx         # Food pairing, thematic rationale & menu
        ├── LocalSpots.tsx       # Nearby restaurant cards with maps/order links
        └── HistoryDrawer.tsx    # Slide-out saved pairings drawer
```

---

## 📄 License

MIT License. Crafted with ❤️ for film fans and food lovers.
