import { FoodOption, MovieGenre } from '../types';

export const MOCK_FOODS: FoodOption[] = [
  {
    id: 'food-italian',
    genre: 'Italian',
    vibeTitle: 'The Sunday Sauce & Brick-Oven Feast',
    emoji: '🍕',
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
    drinkPairing: 'San Pellegrino Blood Orange or a Bold Chianti'
  },
  {
    id: 'food-mexican',
    genre: 'Mexican',
    vibeTitle: 'Street Tacos & Loaded Queso Extravaganza',
    emoji: '🌮',
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
    drinkPairing: 'Ice-Cold Mexican Jarritos Lime or Topo Chico with Lime'
  },
  {
    id: 'food-burgers',
    genre: 'Burgers & Fries',
    vibeTitle: 'Smashburgers & Crispy Tallow Fries',
    emoji: '🍔',
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
    drinkPairing: 'Classic Cherry Cola or Handcrafted Craft Root Beer'
  },
  {
    id: 'food-sushi',
    genre: 'Sushi',
    vibeTitle: 'Tokyo Midnight Rolls & Crispy Rice',
    emoji: '🍣',
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
    drinkPairing: 'Sparkling Yuzu Soda or Iced Genmaicha Green Tea'
  },
  {
    id: 'food-thai',
    genre: 'Thai',
    vibeTitle: 'Fiery Drunken Noodles & Crispy Spring Rolls',
    emoji: '🍜',
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
    drinkPairing: 'Sweet Cream Thai Iced Tea or Lychee Sparkler'
  },
  {
    id: 'food-comfort-junk',
    genre: 'Comfort Junk Food',
    vibeTitle: 'Loaded Mac & Cheese, Mozz Sticks & Cookie Skillet',
    emoji: '🧀',
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
    drinkPairing: 'Frothy Milkshake or Ice Cold Dr Pepper'
  },
  {
    id: 'food-indian',
    genre: 'Indian',
    vibeTitle: 'Butter Chicken & Garlic Naan Feast',
    emoji: '🍛',
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
    drinkPairing: 'Chilled Mango Lassi with crushed cardamom'
  },
  {
    id: 'food-bbq',
    genre: 'BBQ & Wings',
    vibeTitle: 'Smoked Brisket & Crispy Double-Dipped Wings',
    emoji: '🍗',
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
    drinkPairing: 'Southern Sweet Tea with Lemon or Crisp Craft IPA'
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
