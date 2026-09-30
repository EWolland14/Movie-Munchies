import React from 'react';
import { Restaurant, FoodGenre } from '../types';
import { MapPin, Star, ExternalLink, Bike, Navigation } from 'lucide-react';
import { buildMapSearchUrl, buildDeliverySearchUrl } from '../data/mockRestaurants';

interface LocalSpotsProps {
  restaurants: Restaurant[];
  genre: FoodGenre;
  location: string;
}

export const LocalSpots: React.FC<LocalSpotsProps> = ({
  restaurants,
  genre,
  location,
}) => {
  const displayLocation = location.trim() ? location.trim() : 'Your Area';

  return (
    <div className="w-full rounded-2xl bg-cinema-900/50 border border-white/10 p-5 sm:p-6 mt-6">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cinema-neon/10 border border-cinema-neon/30 text-cinema-neon">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-display font-bold text-base sm:text-lg text-white">
              Local Spot Finder
            </h4>
            <p className="text-xs text-slate-400">
              Top-rated {genre} spots matching your film feast near <span className="text-cinema-gold font-medium">{displayLocation}</span>
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cinema-neon/10 text-cinema-neon border border-cinema-neon/20">
          Ready for Delivery
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map((restaurant, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-xl bg-cinema-850/90 border border-white/5 hover:border-white/15 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h5 className="font-bold text-sm sm:text-base text-white group-hover:text-cinema-gold transition-colors">
                    {restaurant.name}
                  </h5>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {restaurant.specialty}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 px-2 py-0.5 rounded bg-cinema-800 border border-white/10 flex-shrink-0">
                  {restaurant.priceTier}
                </span>
              </div>

              {/* Stats badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-3">
                <span className="flex items-center gap-1 font-semibold text-cinema-gold">
                  <Star className="w-3.5 h-3.5 fill-cinema-gold text-cinema-gold" />
                  {restaurant.rating}
                  <span className="text-slate-500 font-normal">({restaurant.reviewCount})</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-cinema-crimson" />
                  {restaurant.distance}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Bike className="w-3.5 h-3.5" />
                  {restaurant.deliveryTime}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 mt-2 truncate">
                📍 {restaurant.addressSnippet}
              </div>
            </div>

            {/* Clickable Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/5">
              <a
                href={buildMapSearchUrl(restaurant.name, location)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-cinema-gold" />
                <span>Open Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <a
                href={buildDeliverySearchUrl(restaurant.name, genre, location)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-cinema-gold/15 hover:bg-cinema-gold/25 text-cinema-gold border border-cinema-gold/30 transition-colors"
              >
                <Bike className="w-3.5 h-3.5" />
                <span>Order Online</span>
                <ExternalLink className="w-3 h-3 text-cinema-gold/70" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
