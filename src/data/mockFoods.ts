import { FoodOption, MovieGenre } from '../types';

export const MOCK_FOODS: FoodOption[] = [
  {
    id: 'food-italian',
    genre: 'Italian',
    vibeTitle: 'The Sunday Sauce & Brick-Oven Feast',
    emoji: '🍕',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Crime': 'Watching mobsters make deals in dimly-lit red sauce joints? You physically cannot watch this without crispy, blistered garlic knots and a hot honey pepperoni pie.',
      'Drama': 'Rich family drama and heated dialogue calls for slow-simmered bolognese that took 6 hours to reduce. Mangia!',
      'Animation': 'Wholesome storytelling deserves heartwarming carbs. Twirl that spaghetti like you are dining in Paris or Little Italy.',
      'Comedy': 'Carb coma laughter fuel. A massive folded slice is the ultimate couch-friendly comedy companion.',
      'Action': 'High-octane car chases require portable fuel. Fold that slice in half and keep your eyes on the screen.'
    },
    defaultTieIn: 'Nothing pairs better with great cinema than wood-fired crust, gooey fresh mozzarella, and aromatic basil.',
    curatedOrder: [
      {
        name: 'Hot Honey & Pepperoni Brick-Oven Pie',
        description: 'Crispy cup-and-char pepperoni, house-made chili infused hot honey, fresh mozzarella, and shaved pecorino.',
        tag: 'Fan Favorite'
      },
      {
        name: 'Truffle Ricotta Garlic Knots (6 pcs)',
        description: 'Warm dough tossed in roasted garlic butter, grated parmesan, and whipped ricotta dip.',
        tag: 'Must Order'
      },
      {
        name: 'Classic Tiramisu Cup',
        description: 'Espresso-soaked ladyfingers with whipped mascarpone cream and dusted Dutch cocoa.',
        tag: 'Sweet Finish'
      }
    ],
    drinkPairing: 'San Pellegrino Blood Orange or a Bold Chianti',
    recipe: {
      dishName: 'Cast Iron Hot Honey & Crispy Pepperoni Pizza',
      prepTime: '15 mins',
      cookTime: '12 mins',
      totalTime: '27 mins',
      difficulty: 'Easy',
      servings: '2-3 cinephiles',
      calories: '680 kcal/serving',
      description: 'Achieve restaurant-quality blistered crust and crispy cup pepperoni right in your home cast-iron skillet without needing a wood-fired oven.',
      equipment: ['10-inch or 12-inch Cast Iron Skillet', 'Rolling Pin or Hands', 'Pastry Brush'],
      ingredients: [
        { item: 'Store-bought or homemade pizza dough', amount: '1 lb (room temp)' },
        { item: 'Whole milk low-moisture mozzarella', amount: '6 oz, freshly shredded' },
        { item: 'Crushed San Marzano tomatoes', amount: '1/2 cup' },
        { item: 'Cup-and-char pepperoni slices', amount: '20-25 slices' },
        { item: 'Hot honey (Mike\'s or chili honey)', amount: '2 tbsp' },
        { item: 'Fresh basil leaves & grated Pecorino', amount: 'Handful' },
        { item: 'Extra virgin olive oil & flake sea salt', amount: '1 tbsp' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat oven to 500°F (260°C). Generously coat a heavy cast-iron skillet with olive oil.' },
        { step: 2, instruction: 'Press and stretch room-temperature dough into the bottom and up the sides of the skillet. Dock lightly with a fork.' },
        { step: 3, instruction: 'Spoon crushed tomatoes evenly, layer freshly shredded mozzarella edge-to-edge, and distribute pepperoni generously.' },
        { step: 4, instruction: 'Place skillet on the stovetop over medium-high heat for 3 minutes to jumpstart bottom crust browning.' },
        { step: 5, instruction: 'Transfer skillet to the top rack of your oven and bake for 10-12 minutes until cheese bubbles and pepperoni edges char.' },
        { step: 6, instruction: 'Remove from oven, drizzle immediately with hot honey, scatter fresh basil and pecorino, slice and feast!' }
      ],
      chefTips: 'Room temperature dough is essential—cold dough will resist stretching and spring back. Shred your own block mozzarella for supreme stretch!'
    }
  },
  {
    id: 'food-mexican',
    genre: 'Mexican',
    vibeTitle: 'Street Tacos & Loaded Queso Extravaganza',
    emoji: '🌮',
    imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Action': 'Explosions on screen demand explosive spice in your mouth. Birria tacos dipped in rich consome keep the adrenaline pumping.',
      'Comedy': 'Chips, salsa, and endless guac are made for laughing with a mouthful without missing a punchline.',
      'Sci-Fi': 'Navigating alternate dimensions works best with multi-layered nachos engineered to perfection.',
      'Horror': 'Terrified out of your mind? Let spicy habanero salsa distract your senses from the jump scares.',
      'Drama': 'Intense emotional stakes pair with rich, slow-braised carnitas and warm handmade corn tortillas.'
    },
    defaultTieIn: 'Crispy chips, smoky salsa, and sizzling tacos bring fiery cinematic excitement straight to your living room.',
    curatedOrder: [
      {
        name: 'Crispy Birria Quesa-Tacos Trio',
        description: 'Slow-braised beef brisket folded with Oaxaca cheese on griddled corn tortillas, served with rich consomé for dipping.',
        tag: 'Showstopper'
      },
      {
        name: 'Loaded Chorizo Queso Fundido & Totopos',
        description: 'Bubbling melted pepper jack and Chihuahua cheeses topped with spiced chorizo, jalapeño, and fresh house chips.',
        tag: 'Crowd Pleaser'
      },
      {
        name: 'Cinnamon-Sugar Churro Bites',
        description: 'Warm crispy churros filled with dulce de leche and chocolate dip.',
        tag: 'Sweet Crunch'
      }
    ],
    drinkPairing: 'Ice-Cold Mexican Jarritos Lime or Topo Chico with Lime',
    recipe: {
      dishName: 'Skillet Birria-Style Quesa-Tacos with Dipping Consomé',
      prepTime: '20 mins',
      cookTime: '20 mins',
      totalTime: '40 mins',
      difficulty: 'Medium',
      servings: '3-4 people',
      calories: '590 kcal/serving',
      description: 'Crisp griddled corn tortillas infused in seasoned chili broth, stuffed with juicy shredded beef, melting Oaxaca cheese, and served with dipping consomé.',
      equipment: ['Non-stick or Cast Iron Griddle', 'Tongs', 'Small Saucepan'],
      ingredients: [
        { item: 'Shredded braised beef chuck or barbacoa', amount: '1 lb' },
        { item: 'Oaxaca cheese or Monterey Jack, shredded', amount: '2 cups' },
        { item: 'Yellow corn tortillas', amount: '8-10 tortillas' },
        { item: 'Rich beef bone broth + adobo chili paste', amount: '1.5 cups' },
        { item: 'Fresh cilantro & diced white onion', amount: '1/2 cup each' },
        { item: 'Fresh lime wedges & smoked paprika', amount: '2 limes' }
      ],
      instructions: [
        { step: 1, instruction: 'In a saucepan, whisk beef broth with adobo paste, cumin, and oregano; simmer on low to create your dipping consomé.' },
        { step: 2, instruction: 'Heat griddle or skillet over medium heat with a light sheen of oil.' },
        { step: 3, instruction: 'Dip each corn tortilla into the warm top layer of chili consomé, then lay flat on the sizzling griddle.' },
        { step: 4, instruction: 'Cover one half with shredded Oaxaca cheese, a hearty spoonful of warm beef, cilantro, and diced onion.' },
        { step: 5, instruction: 'Fold the tortilla in half and press firmly. Fry for 2-3 minutes per side until deeply golden and shatteringly crisp.' },
        { step: 6, instruction: 'Ladle hot consomé into ramekins, garnish with onion and cilantro, and dunk tacos directly before every bite.' }
      ],
      chefTips: 'Dunking the tortilla into the chili fat layer of the broth creates the signature red color and restaurant-level crispiness.'
    }
  },
  {
    id: 'food-burgers',
    genre: 'Burgers & Fries',
    vibeTitle: 'Smashburgers & Crispy Tallow Fries',
    emoji: '🍔',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Action': 'Heavy hits, explosions, and tire screeches demand a double-patty smashburger with extra secret sauce and zero regrets.',
      'Comedy': 'Bite-sized slider joy! When you are laughing out loud, you need greasy, salty perfection right at arm’s reach.',
      'Sci-Fi': 'High-tech future meets primal comfort. The burger is timeless in any timeline or quadrant.',
      'Crime': 'Classic American heist movies require classic diner smashburgers wrapped in foil.',
      'Thriller': 'Nail-biting tension calls for crispy shoestring fries you can nervously munch without pausing the movie.'
    },
    defaultTieIn: 'Juicy, lacy-edged griddled patties with melty American cheese and crispy fries are the undisputed kings of movie night.',
    curatedOrder: [
      {
        name: 'Double Truffle Smashburger',
        description: 'Two dry-aged smashed patties, melted sharp cheddar, caramelized shallots, and black truffle aioli on a toasted brioche bun.',
        tag: 'Chef Signature'
      },
      {
        name: 'Cajun Garlic Parmesan Loaded Fries',
        description: 'Double-fried crispy skin-on potatoes dusted with Creole seasoning, roasted garlic oil, and aged parmesan.',
        tag: 'Craving Smasher'
      },
      {
        name: 'Malted Salted Caramel Shake',
        description: 'Hand-spun Madagascar vanilla bean ice cream with flaky sea salt and dark caramel ribbon.',
        tag: 'Decadent'
      }
    ],
    drinkPairing: 'Classic Cherry Cola or Handcrafted Craft Root Beer',
    recipe: {
      dishName: 'Double Truffle Butter Smashburgers & Crispy Spiced Fries',
      prepTime: '15 mins',
      cookTime: '15 mins',
      totalTime: '30 mins',
      difficulty: 'Easy',
      servings: '2 hearty servings',
      calories: '820 kcal/serving',
      description: 'Lacy-edged, crispy griddled beef patties layered with gooey American cheese, caramelized onions, and black truffle garlic aioli on toasted brioche.',
      equipment: ['Heavy Flat Griddle or Cast Iron', 'Heavy Burger Press or Flat Spatula', 'Parchment Paper Squares'],
      ingredients: [
        { item: '80/20 Ground chuck beef (chilled)', amount: '1 lb, divided into four 4oz balls' },
        { item: 'American cheese or sharp cheddar slices', amount: '4 thick slices' },
        { item: 'Brioche burger buns', amount: '2 buns, split' },
        { item: 'Truffle garlic aioli (mayo + garlic + truffle oil)', amount: '3 tbsp' },
        { item: 'Thinly shaved sweet onions', amount: '1 small onion' },
        { item: 'Kosher salt & coarse black pepper', amount: 'Generous pinch' },
        { item: 'Crispy shoestring fries (air-fried or baked)', amount: '1 bag' }
      ],
      instructions: [
        { step: 1, instruction: 'Preheat dry cast-iron skillet on high heat until smoking hot. Lightly butter and toast brioche buns until golden.' },
        { step: 2, instruction: 'Place chilled beef balls on the dry smoking hot griddle. Top each ball with thinly shaved sweet onions.' },
        { step: 3, instruction: 'Place parchment paper over each ball and SMASH down hard with a heavy press until wafer thin with lacy edges.' },
        { step: 4, instruction: 'Season aggressively with salt and black pepper. Sear undisturbed for 2 minutes until dark caramelized crust forms.' },
        { step: 5, instruction: 'Scrape vigorously to flip, keeping all the browned crust. Immediately crown each patty with cheese. Stack patties in pairs.' },
        { step: 6, instruction: 'Spread truffle aioli on both bun halves, rest double-stacked patties on bottom bun, close, and serve with hot salted fries.' }
      ],
      chefTips: 'Do not grease the pan beforehand! The dry hot steel allows the beef proteins to adhere and create the coveted Maillard reaction crust.'
    }
  },
  {
    id: 'food-sushi',
    genre: 'Sushi',
    vibeTitle: 'Tokyo Midnight Rolls & Crispy Rice',
    emoji: '🍣',
    imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Sci-Fi': 'Neon cityscapes, cybernetics, and dystopian aesthetics practically beg for spicy tuna crispy rice and fresh salmon sashimi.',
      'Thriller': 'Sleek, meticulous plots deserve clean, sophisticated finger food that won\'t distract from subtle plot twists.',
      'Action': 'Choreographed martial arts and razor-sharp stunts pair gracefully with artisan nigiri and crunchy tempura.',
      'Drama': 'Contemplative, gorgeous cinematography matches the delicate balance of fresh wasabi, soy, and pristine fish.',
      'Animation': 'Studio Ghibli-level food art come to life in a wooden bento tray of colorful maki rolls.'
    },
    defaultTieIn: 'Fresh, clean, and artfully assembled rolls provide high-vibe snacking without greasy fingers touching your remote.',
    curatedOrder: [
      {
        name: 'Truffle Seared Salmon & Crispy Rice (4 pcs)',
        description: 'Golden pan-crisped sushi rice cakes topped with spicy tuna tartar, avocado, sliced serrano, and white truffle glaze.',
        tag: 'Top Pick'
      },
      {
        name: 'Midnight Cyber Dragon Roll',
        description: 'Shrimp tempura and cucumber wrapped in barbecue eel, avocado slices, tobiko, and unagi sweet sauce.',
        tag: 'Signature Roll'
      },
      {
        name: 'Charred Edamame with Togarashi Sea Salt',
        description: 'Wok-charred young soybeans tossed in sesame oil, roasted garlic flakes, and Japanese seven-spice.',
        tag: 'Snack Essential'
      }
    ],
    drinkPairing: 'Sparkling Yuzu Soda or Iced Genmaicha Green Tea',
    recipe: {
      dishName: 'Spicy Salmon Crispy Rice & Cyber Dragon Rolls',
      prepTime: '20 mins',
      cookTime: '15 mins',
      totalTime: '35 mins',
      difficulty: 'Medium',
      servings: '2 people',
      calories: '520 kcal/serving',
      description: 'Golden pan-crisped sushi rice cubes topped with creamy sriracha sashimi-grade salmon, jalapeño, sweet unagi drizzle, and toasted sesame.',
      equipment: ['Non-Stick Frying Pan', 'Sharp Chef\'s Knife', 'Plastic Wrap & Square Container'],
      ingredients: [
        { item: 'Seasoned sushi rice (cooked short-grain with rice vinegar & sugar)', amount: '2 cups cooked' },
        { item: 'Sashimi-grade salmon or tuna, finely diced', amount: '8 oz' },
        { item: 'Japanese Kewpie mayonnaise & sriracha', amount: '2 tbsp mayo + 1 tsp sriracha' },
        { item: 'Sesame oil & neutral oil for frying', amount: '2 tbsp' },
        { item: 'Serrano or jalapeño pepper, thinly sliced', amount: '1 pepper' },
        { item: 'Sweet eel/unagi sauce or teriyaki glaze', amount: '2 tbsp' },
        { item: 'Nori seaweed sheets', amount: '2 sheets, cut into snack strips' }
      ],
      instructions: [
        { step: 1, instruction: 'Pack warm seasoned sushi rice tightly into a plastic-lined square dish. Chill in the freezer for 20 minutes to firm up.' },
        { step: 2, instruction: 'In a bowl, gently fold diced salmon with Kewpie mayo, sriracha, a drop of sesame oil, and scallions.' },
        { step: 3, instruction: 'Turn rice block onto cutting board. Using a wet knife, slice into bite-sized rectangles.' },
        { step: 4, instruction: 'Heat 1/4 inch of oil in a skillet over medium-high heat. Fry rice blocks for 3-4 minutes per side until shatteringly golden crisp.' },
        { step: 5, instruction: 'Drain crispy rice on paper towels. Spoon spicy salmon tartar onto each golden cake.' },
        { step: 6, instruction: 'Garnish with a serrano pepper round, drizzle sweet unagi glaze, and sprinkle toasted sesame seeds.' }
      ],
      chefTips: 'Chilling the rice before cutting is the golden secret—it prevents the grains from falling apart when they hit the hot oil!'
    }
  },
  {
    id: 'food-thai',
    genre: 'Thai',
    vibeTitle: 'Fiery Drunken Noodles & Crispy Spring Rolls',
    emoji: '🍜',
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Action': 'Pad Kee Mao (Drunken Noodles) packs high heat and bold Thai basil to match non-stop adrenaline.',
      'Drama': 'Complex layered storytelling matches the harmonized sweet, sour, salty, and spicy notes of rich coconut panang curry.',
      'Sci-Fi': 'Spicy street food vibes reminiscent of Blade Runner noodles in the neon rain.',
      'Comedy': 'A piping hot bowl of pad thai with crushed peanuts is the coziest comfort bowl for a hilarious night in.',
      'Horror': 'Keep the lights on and your taste buds on fire with spicy tom yum soup to keep you sharp.'
    },
    defaultTieIn: 'Bold aromatics, lime leaves, Thai basil, and smoky wok heat turn any standard couch night into an epic sensory feast.',
    curatedOrder: [
      {
        name: 'Smoky Street-Style Drunken Noodles (Pad Kee Mao)',
        description: 'Wide flat rice noodles charred in high-heat wok with tender chicken, holy basil, bell peppers, baby corn, and chili garlic sauce.',
        tag: 'Spicy Favorite'
      },
      {
        name: 'Crispy Golden Veggie Spring Rolls (4 pcs)',
        description: 'Hand-rolled wrapper filled with glass noodles, cabbage, shiitake mushrooms, served with sweet plum dipping sauce.',
        tag: 'Crunchy Starter'
      },
      {
        name: 'Warm Mango Sticky Rice',
        description: 'Sweet coconut-infused glutinous rice served with ripe sliced honey mango and toasted sesame seeds.',
        tag: 'Iconic Dessert'
      }
    ],
    drinkPairing: 'Sweet Cream Thai Iced Tea or Lychee Sparkler',
    recipe: {
      dishName: 'Wok-Seared Pad Kee Mao (Fiery Drunken Noodles)',
      prepTime: '15 mins',
      cookTime: '10 mins',
      totalTime: '25 mins',
      difficulty: 'Easy',
      servings: '2-3 servings',
      calories: '610 kcal/serving',
      description: 'Chewy wide rice noodles charred in high-heat wok sauce with tender chicken, sweet Thai holy basil, bird\'s eye chilies, and crisp vegetables.',
      equipment: ['Large Wok or Deep Cast Iron Skillet', 'Spatula'],
      ingredients: [
        { item: 'Fresh wide flat rice noodles (Sen Yai) or dried pad thai noodles', amount: '12 oz' },
        { item: 'Boneless chicken breast or thighs, thinly sliced', amount: '8 oz' },
        { item: 'Thai holy basil or Italian sweet basil', amount: '1.5 cups fresh leaves' },
        { item: 'Garlic cloves & Thai bird\'s eye chilies, pounded together', amount: '5 cloves + 2-4 chilies' },
        { item: 'Sauce: Oyster sauce, dark sweet soy sauce, fish sauce, sugar', amount: '2 tbsp oyster, 1 tbsp sweet soy, 1 tbsp fish sauce' },
        { item: 'Red bell pepper & baby corn, sliced', amount: '1 cup' },
        { item: 'High-heat cooking oil', amount: '2 tbsp' }
      ],
      instructions: [
        { step: 1, instruction: 'Whisk the sauce ingredients in a small bowl. Separate wide rice noodles so they don\'t stick.' },
        { step: 2, instruction: 'Heat wok on high until smoking. Add oil, swirl, and drop pounded garlic and chilies; stir-fry for 20 seconds until fragrant.' },
        { step: 3, instruction: 'Toss in sliced chicken, searing for 2-3 minutes until lightly browned.' },
        { step: 4, instruction: 'Add bell peppers and baby corn; cook for 1 minute.' },
        { step: 5, instruction: 'Dump in rice noodles and pour the savory sauce directly over noodles. Toss vigorously on max heat for 2 minutes to let noodles char and absorb wok smoky flavor (wok hei).' },
        { step: 6, instruction: 'Turn off heat, dump in fresh basil leaves, and toss for 15 seconds until wilted. Serve piping hot with lime wedges!' }
      ],
      chefTips: 'Wok must be smoking hot before starting. Dark sweet soy sauce gives the noodles their deep caramelized amber glow.'
    }
  },
  {
    id: 'food-comfort-junk',
    genre: 'Comfort Junk Food',
    vibeTitle: 'Loaded Mac & Cheese, Mozz Sticks & Cookie Skillet',
    emoji: '🧀',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Comedy': 'You’re here to laugh till your stomach hurts, so you might as well fill it with golden mozzarella sticks and loaded nachos.',
      'Horror': 'When you are clutching the couch pillows in sheer dread, you need carb-dense comfort food to ground you in reality.',
      'Animation': 'Pure childhood nostalgia on screen calls for pure childhood junk food indulgence on your plate.',
      'Drama': 'Crying your eyes out? Creamy four-cheese macaroni and warm gooey cookies are cheaper than therapy.',
      'Action': 'Mindless blockbuster popcorn flick? Mindless cheesy finger food goodness!'
    },
    defaultTieIn: 'Zero culinary pretense, 100% endorphins. The ultimate midnight binge food crafted for movie marathons.',
    curatedOrder: [
      {
        name: 'Four-Cheese Bacon Mac & Cheese Skillet',
        description: 'Cavatappi pasta drenched in smoked gouda, sharp white cheddar, crispy applewood bacon crumbles, and toasted panko topping.',
        tag: 'Ultimate Comfort'
      },
      {
        name: 'Giant Pull-Apart Beer-Battered Mozz Sticks',
        description: 'Half-pound stretchy whole-milk mozzarella logs fried to golden perfection with spicy marinara sauce.',
        tag: 'Cheese Pull'
      },
      {
        name: 'Warm Gooey Chocolate Chip Cookie Pie',
        description: 'Deep-dish half-baked chocolate chip cookie topped with vanilla bean ice cream and warm fudge drizzle.',
        tag: 'Heavenly'
      }
    ],
    drinkPairing: 'Frothy Milkshake or Ice Cold Dr Pepper',
    recipe: {
      dishName: 'Skillet Smoked Gouda Mac & Cheese with Bacon Herb Crust',
      prepTime: '15 mins',
      cookTime: '20 mins',
      totalTime: '35 mins',
      difficulty: 'Easy',
      servings: '4 hungry snackers',
      calories: '750 kcal/serving',
      description: 'Cavatappi spirals bathed in a velvety four-cheese roux with crisp bacon crumbles and buttered garlic panko crust.',
      equipment: ['Large Pot', 'Oven-Safe Skillet or Baking Dish', 'Whisk'],
      ingredients: [
        { item: 'Cavatappi or elbow macaroni', amount: '12 oz' },
        { item: 'Smoked gouda & sharp white cheddar, shredded', amount: '1.5 cups each' },
        { item: 'Whole milk & heavy cream', amount: '1.5 cups milk + 1/2 cup cream' },
        { item: 'Unsalted butter & all-purpose flour', amount: '3 tbsp each' },
        { item: 'Crispy applewood bacon crumbles', amount: '6 strips cooked' },
        { item: 'Panko breadcrumbs tossed in melted butter', amount: '1/2 cup' },
        { item: 'Dijon mustard, garlic powder, pinch of cayenne', amount: '1 tsp Dijon, 1/2 tsp each' }
      ],
      instructions: [
        { step: 1, instruction: 'Boil pasta in heavily salted water until 1 minute shy of al dente; drain and set aside.' },
        { step: 2, instruction: 'In skillet over medium heat, melt butter and whisk in flour for 1 minute to form a golden roux.' },
        { step: 3, instruction: 'Slowly stream in warm milk and cream, whisking continuously until smooth and bubbling gently.' },
        { step: 4, instruction: 'Take pan off the heat! Whisk in Dijon, garlic powder, cayenne, then fold in shredded cheeses in handfuls until silky smooth.' },
        { step: 5, instruction: 'Fold cooked pasta and half the bacon into the cheese sauce. Crown with buttered panko and remaining bacon.' },
        { step: 6, instruction: 'Broil on HIGH for 3-4 minutes until panko is deeply golden and cheese bubbles with crispy edges.' }
      ],
      chefTips: 'Always remove the pan from direct heat before melting the cheese. High direct heat breaks the emulsion and makes sauce grainy!'
    }
  },
  {
    id: 'food-indian',
    genre: 'Indian',
    vibeTitle: 'Butter Chicken & Garlic Naan Feast',
    emoji: '🍛',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Sci-Fi': 'Mind-bending epics like Dune or Interstellar require deep, aromatic spices and slow-cooked rich gravies.',
      'Drama': 'Intense emotional journeys demand deeply flavorful lamb rogan josh and warm pillow-soft naan bread.',
      'Action': 'Vibrant spice mixtures and crispy samosas to keep your senses engaged through epic three-hour sagas.',
      'Comedy': 'Sharing a giant tandoori platter and dipping naan with friends makes any comedy night unforgettable.'
    },
    defaultTieIn: 'Velvety curries, fragrant basmati rice, and blistered garlic naan straight from the tandoor bring supreme warmth to any film.',
    curatedOrder: [
      {
        name: 'Old Delhi Velvet Butter Chicken (Murgh Makhani)',
        description: 'Tender tandoor-roasted chicken simmered in a velvety tomato cream sauce scented with fenugreek and butter.',
        tag: 'House Hero'
      },
      {
        name: 'Blistered Garlic Cilantro Naan (2 pcs)',
        description: 'Soft leavened tandoor flatbread brushed generously with roasted garlic ghee and fresh coriander.',
        tag: 'Mandatory Dip'
      },
      {
        name: 'Crispy Potato & Green Pea Samosas (3 pcs)',
        description: 'Flaky pastry filled with spiced potatoes, cumin seeds, and peas, served with mint chutney and tamarind sauce.',
        tag: 'Appetizer Gem'
      }
    ],
    drinkPairing: 'Chilled Mango Lassi with crushed cardamom',
    recipe: {
      dishName: 'Velvet Restaurant Butter Chicken & Garlic Naan',
      prepTime: '20 mins',
      cookTime: '25 mins',
      totalTime: '45 mins',
      difficulty: 'Medium',
      servings: '3-4 servings',
      calories: '640 kcal/serving',
      description: 'Tender yogurt-marinated spiced chicken simmered in a luscious tomato-butter gravy scented with kasuri methi (fenugreek) and garam masala.',
      equipment: ['Heavy Dutch Oven or Deep Pan', 'Blender or Immersion Blender', 'Tongs'],
      ingredients: [
        { item: 'Boneless chicken thighs, cut into bite-sized chunks', amount: '1.5 lbs' },
        { item: 'Greek yogurt, ginger-garlic paste, chili, lemon juice', amount: '1/2 cup yogurt + 1 tbsp marinade mix' },
        { item: 'Canned San Marzano whole peeled tomatoes or puree', amount: '14 oz' },
        { item: 'Heavy whipping cream', amount: '1/2 cup' },
        { item: 'Butter (cold, cubed)', amount: '4 tbsp' },
        { item: 'Kasuri methi (dried fenugreek leaves), crushed', amount: '1 tbsp' },
        { item: 'Garam masala, Kashmiri chili powder, sugar', amount: '1 tsp each' },
        { item: 'Garlic naan breads', amount: '4 pieces, warmed with ghee' }
      ],
      instructions: [
        { step: 1, instruction: 'Marinate chicken chunks in yogurt, ginger-garlic paste, Kashmiri chili, and lemon juice for at least 15 minutes.' },
        { step: 2, instruction: 'Sear marinated chicken in a screaming hot skillet for 5-6 minutes until charred on edges; set aside.' },
        { step: 3, instruction: 'In a pot, simmer tomatoes, ginger, and garlic for 10 minutes, then blend until silky smooth.' },
        { step: 4, instruction: 'Return sauce to pot. Stir in garam masala, chili powder, salt, and a pinch of sugar to balance tomato acidity.' },
        { step: 5, instruction: 'Add seared chicken, reduce heat to low, and stir in cold butter cubes and heavy cream until velvety.' },
        { step: 6, instruction: 'Crush dried kasuri methi between your palms into the curry for that signature restaurant aroma. Serve with warm garlic naan!' }
      ],
      chefTips: 'Crushing Kasuri Methi (fenugreek leaves) between your palms at the very end is the single non-negotiable secret to authentic butter chicken flavor.'
    }
  },
  {
    id: 'food-bbq',
    genre: 'BBQ & Wings',
    vibeTitle: 'Smoked Brisket & Crispy Double-Dipped Wings',
    emoji: '🍗',
    imageUrl: 'https://images.unsplash.com/photo-1527477378407-63e26424c3d4?auto=format&fit=crop&w=800&q=80',
    thematicTieIns: {
      'Action': 'Fast cars and heavy artillery demand sticky barbecue fingers, smoky dry-rub wings, and tangy slaw.',
      'Comedy': 'Pass the wet wipes! Messy eating makes funny moments even more ridiculously enjoyable.',
      'Horror': 'Nothing distracts from monsters lurking in the dark quite like hot honey habanero wings setting your mouth ablaze.',
      'Thriller': 'Chewing on savory slow-smoked brisket points keeps your jaws busy during the edge-of-your-seat scenes.'
    },
    defaultTieIn: 'Slow-smoked over hickory and oak, glazed in sweet tangy sauce, with pickled jalapeños and buttery cornbread.',
    curatedOrder: [
      {
        name: 'Smoked Prime Brisket & Pulled Pork Combo',
        description: '14-hour hickory smoked brisket slices with crispy bark, slow-pulled pork shoulder, house pickles, and Texas toast.',
        tag: 'Pitmaster Choice'
      },
      {
        name: 'Hot Honey Lemon Pepper Jumbo Wings (8 pcs)',
        description: 'Crisp double-fried wings tossed in a sweet-heat hot honey glaze and freshly cracked lemon pepper.',
        tag: 'Finger Lickin'
      },
      {
        name: 'Cast Iron Honey Butter Cornbread',
        description: 'Sweet skillet cornbread served warm with whipped honey cinnamon butter.',
        tag: 'Southern Classic'
      }
    ],
    drinkPairing: 'Southern Sweet Tea with Lemon or Crisp Craft IPA',
    recipe: {
      dishName: 'Crispy Hot Honey Glazed Jumbo Wings & Skillet Cornbread',
      prepTime: '15 mins',
      cookTime: '25 mins',
      totalTime: '40 mins',
      difficulty: 'Easy',
      servings: '3-4 movie fans',
      calories: '690 kcal/serving',
      description: 'Extra-crunchy jumbo chicken wings tossed in a warm honey-chili glaze with freshly cracked coarse pepper and cool ranch dip.',
      equipment: ['Air Fryer or Baking Sheet with Wire Rack', 'Tossing Bowl', 'Small Saucepan'],
      ingredients: [
        { item: 'Jumbo chicken wings (flats & drumettes)', amount: '2 lbs, patted bone-dry' },
        { item: 'Baking powder (aluminum-free) & cornstarch', amount: '1 tbsp each (for extreme crisp)' },
        { item: 'Smoked paprika, garlic powder, onion powder, salt', amount: '1 tsp each' },
        { item: 'Pure clover honey + cayenne hot sauce', amount: '1/3 cup honey + 3 tbsp hot sauce' },
        { item: 'Butter & apple cider vinegar', amount: '2 tbsp butter + 1 tsp vinegar' },
        { item: 'Freshly cracked black pepper & chives', amount: '1 tbsp coarse pepper' }
      ],
      instructions: [
        { step: 1, instruction: 'Pat chicken wings thoroughly dry with paper towels. Toss with baking powder, cornstarch, salt, garlic powder, and paprika.' },
        { step: 2, instruction: 'Air Fryer: Cook at 380°F (193°C) for 18 minutes, shaking basket halfway. Crank heat to 400°F (204°C) for final 5 minutes for blistered crunch.' },
        { step: 3, instruction: 'Oven alternative: Bake on a wire rack at 425°F (218°C) for 40 minutes until deeply golden.' },
        { step: 4, instruction: 'While wings cook, simmer honey, hot sauce, butter, and apple cider vinegar in a saucepan for 3 minutes until glossy.' },
        { step: 5, instruction: 'Transfer sizzling wings into a large metal bowl, pour warm glaze over them, and toss vigorously until gleaming.' },
        { step: 6, instruction: 'Crown with cracked black pepper and chopped chives. Serve immediately with celery sticks and buttermilk ranch!' }
      ],
      chefTips: 'Tossing raw wings with baking powder changes skin pH, evaporating moisture to create blistered restaurant crunch without deep frying!'
    }
  }
];

export function getThematicTieIn(food: FoodOption, movieGenres: MovieGenre[]): string {
  for (const genre of movieGenres) {
    if (food.thematicTieIns[genre]) {
      return food.thematicTieIns[genre];
    }
  }
  return food.defaultTieIn;
}
