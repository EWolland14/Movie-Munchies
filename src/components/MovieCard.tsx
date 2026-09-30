import React, { useState } from 'react';
import { Movie } from '../types';
import { Film, Clock, Star, Tv } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onRespinMovie: () => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  'Netflix': 'bg-red-600/20 text-red-400 border-red-500/30',
  'Max': 'bg-blue-600/20 text-blue-400 border-blue-500/30',
  'Hulu': 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30',
  'Prime Video': 'bg-cyan-600/20 text-cyan-400 border-cyan-500/30',
  'Disney+': 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
  'Apple TV+': 'bg-slate-500/20 text-slate-300 border-slate-400/30',
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onRespinMovie }) => {
  const [imgError, setImgError] = useState(false);

  const platformBadgeClass =
    PLATFORM_COLORS[movie.streamingPlatform] ||
    'bg-cinema-crimson/20 text-cinema-crimson border-cinema-crimson/30';

  return (
    <div className="flex flex-col h-full rounded-2xl bg-cinema-900/60 border border-white/10 p-5 sm:p-6 relative group overflow-hidden">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cinema-crimson/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header Badge Row */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-cinema-crimson/15 text-cinema-crimson border-cinema-crimson/30">
            <Film className="w-3.5 h-3.5" />
            Featured Film
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${platformBadgeClass}`}>
            <Tv className="w-3 h-3" />
            {movie.streamingPlatform}
          </span>
        </div>

        <button
          onClick={onRespinMovie}
          className="text-xs font-semibold text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          title="Respin just this movie"
        >
          🔄 Respin Movie
        </button>
      </div>

      {/* Poster + Core Info */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Poster Image */}
        <div className="w-full sm:w-40 sm:h-56 h-64 rounded-xl overflow-hidden relative flex-shrink-0 bg-cinema-800 border border-white/10 shadow-lg">
          {!imgError ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-cinema-900 via-cinema-850 to-cinema-800">
              <Film className="w-10 h-10 text-cinema-crimson/50 mb-2" />
              <span className="font-bold text-sm text-slate-300 line-clamp-2">{movie.title}</span>
              <span className="text-xs text-slate-500 mt-1">{movie.year}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-950/80 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Details Column */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              {movie.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-400 mt-1">
              <span className="font-bold text-slate-200">{movie.year}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cinema-gold" />
                {movie.runtime} mins
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-cinema-gold">
                <Star className="w-3.5 h-3.5 fill-cinema-gold text-cinema-gold" />
                {movie.rating} / 10
              </span>
              {movie.rottenTomatoes && (
                <>
                  <span>•</span>
                  <span className="text-red-400 font-semibold">
                    🍅 {movie.rottenTomatoes}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1.5">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-300"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Logline */}
          <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-cinema-crimson/50 pl-3">
            "{movie.logline}"
          </p>

          <div className="text-xs text-slate-400 pt-1">
            <span className="text-slate-500">Directed by:</span>{' '}
            <span className="text-slate-200 font-medium">{movie.director}</span>
            {movie.leadActors && (
              <span className="block mt-0.5">
                <span className="text-slate-500">Starring:</span>{' '}
                <span className="text-slate-300">{movie.leadActors.join(', ')}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
