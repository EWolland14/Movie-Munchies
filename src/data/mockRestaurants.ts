import { FoodGenre, Restaurant } from '../types';

const RESTAURANT_TEMPLATES: Record<FoodGenre, Restaurant[]> = {
  'Italian': [
    {
      name: "Luigi's Wood-Fired Trattoria",
      rating: 4.8,
      reviewCount: 420,
      distance: '1.1 mi away',
      deliveryTime: '25-35 mins',
      priceTier: '$$',
      specialty: 'Neapolitan Brick-Oven Pizza & Truffle Pasta',
      addressSnippet: 'Main St & 4th Ave'
    },
    {
      name: "Nonna's Red Sauce Kitchen",
      rating: 4.9,
      reviewCount: 890,
      distance: '1.8 mi away',
      deliveryTime: '30-40 mins',
      priceTier: '$$',
      specialty: 'House-made Rigatoni Bolognese & Garlic Knots',
      addressSnippet: 'Little Italy Plaza'
    }
  ],
  'Mexican': [
    {
      name: 'Taqueria El Fuego & Birria Bar',
      rating: 4.9,
      reviewCount: 640,
      distance: '0.8 mi away',
      deliveryTime: '20-30 mins',
      priceTier: '$',
      specialty: 'Crispy Birria Quesa-Tacos & Loaded Street Corn',
      addressSnippet: 'Mission Blvd'
    },
    {
      name: 'Cantina Del Sol',
      rating: 4.7,
      reviewCount: 315,
      distance: '1.5 mi away',
      deliveryTime: '25-35 mins',
      priceTier: '$$',
      specialty: 'Sizzling Fajitas, Guacamole Molcajete & Totopos',
      addressSnippet: 'Sunset Way'
    }
  ],
  'Burgers & Fries': [
    {
      name: 'The Smashed Bull Burger Co.',
      rating: 4.8,
      reviewCount: 950,
      distance: '1.2 mi away',
      deliveryTime: '20-30 mins',
      priceTier: '$$',
      specialty: 'Double Oklahoma Onion Smashburgers & Truffle Fries',
      addressSnippet: 'Broadway & 12th'
    },
    {
      name: 'Midnight Diner & Shake Shack',
      rating: 4.6,
      reviewCount: 520,
      distance: '2.0 mi away',
      deliveryTime: '25-40 mins',
      priceTier: '$',
      specialty: 'Crispy Shoestring Fries, Melts & Custard Shakes',
      addressSnippet: 'Commerce St'
    }
  ],
  'Sushi': [
    {
      name: 'Tokyo Drift Sushi & Izakaya',
      rating: 4.9,
      reviewCount: 780,
      distance: '1.4 mi away',
      deliveryTime: '30-45 mins',
      priceTier: '$$$',
      specialty: 'Spicy Tuna Crispy Rice & Cyber Dragon Rolls',
      addressSnippet: 'Grand Avenue Promenade'
    },
    {
      name: 'Kuro Omakase & Roll Bar',
      rating: 4.8,
      reviewCount: 410,
      distance: '2.3 mi away',
      deliveryTime: '35-50 mins',
      priceTier: '$$$',
      specialty: 'Truffle Salmon Nigiri & Miso Black Cod',
      addressSnippet: 'Harbor Arts District'
    }
  ],
  'Thai': [
    {
      name: 'Bangkok Nights Street Food',
      rating: 4.8,
      reviewCount: 560,
      distance: '0.9 mi away',
      deliveryTime: '20-35 mins',
      priceTier: '$$',
      specialty: 'Smoky Drunken Noodles & Crispy Spring Rolls',
      addressSnippet: 'Center Street Marketplace'
    },
    {
      name: 'Lotus Blossom Thai Bistro',
      rating: 4.7,
      reviewCount: 380,
      distance: '1.7 mi away',
      deliveryTime: '25-40 mins',
      priceTier: '$$',
      specialty: 'Creamy Coconut Panang Curry & Mango Sticky Rice',
      addressSnippet: 'Oakwood Terrace'
    }
  ],
  'Comfort Junk Food': [
    {
      name: 'The Meltdown Mac & Melt Shack',
      rating: 4.8,
      reviewCount: 820,
      distance: '1.0 mi away',
      deliveryTime: '20-30 mins',
      priceTier: '$',
      specialty: 'Four-Cheese Skillets, Giant Mozz Sticks & Cookie Pies',
      addressSnippet: 'College Town Row'
    },
    {
      name: 'Late Night Cravings Lab',
      rating: 4.7,
      reviewCount: 640,
      distance: '1.6 mi away',
      deliveryTime: '25-35 mins',
      priceTier: '$',
      specialty: 'Loaded Pulled Pork Nachos & Deep-Fried Oreos',
      addressSnippet: 'Industrial Way'
    }
  ],
  'Indian': [
    {
      name: 'Clay Oven Royal Tandoor',
      rating: 4.9,
      reviewCount: 690,
      distance: '1.3 mi away',
      deliveryTime: '30-45 mins',
      priceTier: '$$',
      specialty: 'Old Delhi Butter Chicken & Garlic Ghee Naan',
      addressSnippet: 'Heritage Village Square'
    },
    {
      name: 'Spice Junction Curries & Biryani',
      rating: 4.8,
      reviewCount: 440,
      distance: '2.1 mi away',
      deliveryTime: '30-45 mins',
      priceTier: '$$',
      specialty: 'Hyderabadi Dum Biryani & Flaky Samosas',
      addressSnippet: 'Valley Blvd'
    }
  ],
  'BBQ & Wings': [
    {
      name: 'Oak & Ember Smokehouse',
      rating: 4.9,
      reviewCount: 1100,
      distance: '1.5 mi away',
      deliveryTime: '25-40 mins',
      priceTier: '$$',
      specialty: '14-Hour Smoked Prime Brisket & Skillet Cornbread',
      addressSnippet: 'Old Mill Road'
    },
    {
      name: 'Lord of the Wings & Tenders',
      rating: 4.7,
      reviewCount: 510,
      distance: '1.0 mi away',
      deliveryTime: '20-30 mins',
      priceTier: '$',
      specialty: 'Hot Honey Lemon Pepper Wings & Loaded Crinkle Cut Fries',
      addressSnippet: 'South Gate Plaza'
    }
  ]
};

export function getNearbyRestaurants(genre: FoodGenre, location?: string): Restaurant[] {
  const baseSpots = RESTAURANT_TEMPLATES[genre] || RESTAURANT_TEMPLATES['Italian'];
  const locDisplay = location && location.trim() ? location.trim() : 'Downtown';

  // Customize location snippet for realism
  return baseSpots.map((spot, index) => ({
    ...spot,
    addressSnippet: index === 0 ? `${spot.addressSnippet}, ${locDisplay}` : `${locDisplay} Central District`
  }));
}

export function buildMapSearchUrl(restaurantName: string, location?: string): string {
  const query = encodeURIComponent(`${restaurantName} ${location || ''}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function buildDeliverySearchUrl(restaurantName: string, genre: string, location?: string): string {
  const query = encodeURIComponent(`${restaurantName} ${genre} food ${location || ''}`);
  return `https://www.google.com/search?q=${query}+order+delivery`;
}
