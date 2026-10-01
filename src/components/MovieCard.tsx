import React, { useState } from 'react';
import { Movie } from '../types';
import { Film, Clock, Star, Tv, Volume2, Video } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  onRespinMovie: () => void;
}

const PLATFORM_COLORS: Record<string, string> = {
  'Netflix': 'bg-red-600/20 text-red-400 border-red-500/40',
  'Max': 'bg-blue-600/20 text-blue-400 border-blue-500/40',
  'Hulu': 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40',
  'Prime Video': 'bg-cyan-600/20 text-cyan-400 border-cyan-500/40',
  'Disney+': 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40',
  'Apple TV+': 'bg-slate-500/20 text-slate-300 border-slate-400/40',
};

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onRespinMovie }) => {
  const [imgError, setImgError] = useState(false);

  const platformBadgeClass =
    PLATFORM_COLORS[movie.streamingPlatform] ||
    'bg-red-600/20 text-red-400 border-red-500/40';

  return (
    <div className="flex flex-col h-full rounded-3xl bg-stone-900/80 border border-red-500/30 p-5 sm:p-7 relative group overflow-hidden shadow-2xl backdrop-blur-xl">
      {/* Subtle top ambient glow */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600/20 text-red-400 border border-red-500/40 shadow-sm">
            <Film className="w-3.5 h-3.5" />
            Featured Film
          </span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${platformBadgeClass} shadow-sm`}>
            <Tv className="w-3 h-3" />
            {movie.streamingPlatform}
          </span>
        </div>

        <button
          onClick={onRespinMovie}
          className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-1 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors shadow-sm"
          title="Respin just this movie"
        >
          🔄 Respin Movie
        </button>
      </div>

      {/* Poster + Core Info */}
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        {/* Poster Image */}
        <div className="w-full sm:w-44 sm:h-64 h-72 rounded-2xl overflow-hidden relative flex-shrink-0 bg-stone-950 border border-white/15 shadow-xl">
          {!imgError ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950">
              <Film className="w-10 h-10 text-red-500/50 mb-2" />
              <span className="font-bold text-sm text-stone-300 line-clamp-2">{movie.title}</span>
              <span className="text-xs text-stone-500 mt-1">{movie.year}</span>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent sm:hidden" />
          
          {/* Quality Pill */}
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-mono font-bold text-amber-300">
            <Video className="w-2.5 h-2.5 text-amber-400" />
            4K UHD
          </div>
        </div>

        {/* Details Column */}
        <div className="flex-1 space-y-3.5">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              {movie.title}
            </h3>
            
            {/* Specs Bar */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-stone-400 mt-1.5 font-medium">
              <span className="font-bold text-stone-200 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                {movie.year}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-white/5 border border-white/10">
                <Clock className="w-3 h-3 text-amber-400" />
                {movie.runtime} mins
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                IMDb {movie.rating}
              </span>
              {movie.rottenTomatoes && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-red-500/10 text-red-300 font-bold border border-red-500/30">
                  🍅 {movie.rottenTomatoes}% Fresh
                </span>
              )}
            </div>
          </div>

          {/* Genre Badges + Audio Spec */}
          <div className="flex flex-wrap items-center gap-1.5">
            {movie.genres.map((genre) => (
              <span
                key={genre}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-stone-950/80 border border-white/10 text-stone-300 shadow-sm"
              >
                {genre}
              </span>
            ))}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-stone-950 border border-white/10 text-stone-400 flex items-center gap-1">
              <Volume2 className="w-3 h-3 text-cyan-400" />
              Dolby 5.1
            </span>
          </div>

          {/* Logline */}
          <p className="text-sm text-stone-300 leading-relaxed italic border-l-2 border-red-500/60 pl-3.5 bg-red-950/20 py-1.5 rounded-r-xl">
            "{movie.logline}"
          </p>

          {/* Cast & Crew */}
          <div className="text-xs text-stone-400 pt-1 space-y-1">
            <div>
              <span className="text-stone-500 uppercase font-mono text-[10px]">Directed by:</span>{' '}
              <span className="text-stone-200 font-semibold">{movie.director}</span>
            </div>
            {movie.leadActors && (
              <div>
                <span className="text-stone-500 uppercase font-mono text-[10px]">Starring:</span>{' '}
                <span className="text-stone-300">{movie.leadActors.join(', ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
