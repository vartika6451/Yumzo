import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
<<<<<<< HEAD
import fs from 'fs';
import path from 'path';

// Load .env
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: Supabase credentials not found in .env');
  console.log('\nPlease make sure your .env file contains:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-service-key\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  console.log('\x1b[36m%s\x1b[0m', '🌱 Starting Yumzo Supabase Seed...');

  // 1. Moods
  const moods = [
    { id: 'b0000000-0000-0000-0000-000000000001', name: 'Cheesy', slug: 'cheesy', emoji: '🧀' },
    { id: 'b0000000-0000-0000-0000-000000000002', name: 'Spicy', slug: 'spicy', emoji: '🌶️' },
    { id: 'b0000000-0000-0000-0000-000000000003', name: 'Midnight snacks', slug: 'midnight', emoji: '🌙' },
    { id: 'b0000000-0000-0000-0000-000000000004', name: 'Sweet tooth', slug: 'sweet', emoji: '🍰' },
    { id: 'b0000000-0000-0000-0000-000000000005', name: 'Surprise me!', slug: 'surprise', emoji: '🎲' }
  ];

  console.log('Inserting 5 Craving Moods...');
  const { error: moodErr } = await supabase.from('moods').upsert(moods, { onConflict: 'id' });
  if (moodErr) console.warn('Mood insert note:', moodErr.message);

  // 2. Restaurants
  const restaurants = [
    {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Bella Italia Ristorante',
      slug: 'bella-italia',
      description: 'Authentic wood-fired Neapolitan pizzas, artisanal handcrafted pasta, and velvety desserts straight from Rome.',
      cuisine: 'Italian',
      image_url: '/images/italian.png',
      banner_url: '/images/hero_feast_spread.jpg',
      rating: 4.9,
      is_featured: true,
      is_active: true
    },
    {
      id: 'a0000000-0000-0000-0000-000000000002',
      name: 'The Royal Maharani',
      slug: 'royal-maharani',
      description: 'Regal Mughlai delicacies, fragrant handi biryanis, and rich buttery curries cooked in traditional clay tandoors.',
      cuisine: 'Indian',
      image_url: '/images/indian.jpeg',
      banner_url: '/images/feast_table_flatlay.jpg',
      rating: 4.8,
      is_featured: true,
      is_active: true
    },
    {
      id: 'a0000000-0000-0000-0000-000000000003',
      name: 'Dragon Wok House',
      slug: 'dragon-wok',
      description: 'Sizzling wok-tossed street noodles, spicy Sichuan bowls, and delicate handmade steamed dim sums.',
      cuisine: 'Chinese',
      image_url: '/images/chinese.jpeg',
      banner_url: '/images/hero_feast_spread.jpg',
      rating: 4.7,
      is_featured: true,
      is_active: true
    },
    {
      id: 'a0000000-0000-0000-0000-000000000004',
      name: 'Tokyo Ramen & Sushi Bar',
      slug: 'tokyo-ramen-sushi',
      description: 'Rich slow-simmered broth ramen, fresh nigiri & maki rolls, and crispy golden tempura crafted with master precision.',
      cuisine: 'Japanese',
      image_url: '/images/japanese.jpg',
      banner_url: '/images/movie_snacks_combo.jpg',
      rating: 4.9,
      is_featured: true,
      is_active: true
    },
    {
      id: 'a0000000-0000-0000-0000-000000000005',
      name: 'Cravers Bistro & Diner',
      slug: 'cravers-diner',
      description: 'Gourmet double smash burgers, loaded melted cheese platters, and midnight comfort combos built for dreamers.',
      cuisine: 'Continental',
      image_url: '/images/download.png',
      banner_url: '/images/movie_snacks_combo.jpg',
      rating: 4.6,
      is_featured: true,
      is_active: true
    }
  ];

  console.log('Inserting 5 Fictional Restaurants...');
  const { error: resErr } = await supabase.from('restaurants').upsert(restaurants, { onConflict: 'id' });
  if (resErr) console.warn('Restaurant insert note:', resErr.message);

  // 3. Food items
  const foodItems = [
    // Bella Italia
    { id: 'c0000000-0000-0000-0000-000000000001', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Loaded Cheese Pizza', description: 'Classic delight with double mozzarella, black olives, bell peppers, and San Marzano tomato sauce.', price: 299, image_url: '/images/pizza.jpg', category: 'Pizzas', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000002', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Creamy Truffle Pasta', description: 'Penne pasta tossed in a luxurious parmesan cream sauce infused with black truffle essence.', price: 280, image_url: '/images/pasta.jpg', category: 'Mains', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000003', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Classic Baked Lasagna', description: 'Layers of tender pasta sheets, rich tomato marinara, and gooey melted fontina & mozzarella.', price: 320, image_url: '/images/lasagna.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000004', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Cheesy Garlic Bread', description: 'Toasted sourdough baguette infused with roasted garlic butter and golden pull cheese.', price: 140, image_url: '/images/garlicbread.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000005', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Rosemary Focaccia', description: 'Herb-infused Italian flatbread drizzled with extra virgin olive oil and sea salt flakes.', price: 120, image_url: '/images/focaccia.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000006', restaurant_id: 'a0000000-0000-0000-0000-000000000001', name: 'Classic Venetian Tiramisu', description: 'Espresso-soaked ladyfingers layered with fluffy mascarpone cream and Belgian cocoa powder.', price: 220, image_url: '/images/tiramisu.jpg', category: 'Desserts', is_veg: true, is_popular: true, is_available: true },

    // The Royal Maharani
    { id: 'c0000000-0000-0000-0000-000000000007', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Chicken Biryani', description: 'Fragrant long-grain basmati rice, tender chicken marinated in saffron, caramelized onions, and royal spices.', price: 349, image_url: '/images/jeerarice.jpg', category: 'Mains', is_veg: false, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000008', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Dal Makhani', description: 'Whole black lentils slow-cooked overnight over tandoor charcoal with white butter and fresh cream.', price: 240, image_url: '/images/dalmakhani.jpg', category: 'Mains', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000009', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Amritsari Chole Bhature', description: 'Spiced tangy chickpea curry served with golden, fluffy deep-fried artisanal bhature.', price: 180, image_url: '/images/bhature.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000010', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Punjabi Samosa (2 Pcs)', description: 'Flaky golden pastry cones stuffed with seasoned potatoes, green peas, and fragrant cumin.', price: 80, image_url: '/images/samosa.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000011', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Crispy Masala Dosa', description: 'Golden fermented rice crepe filled with spiced potato masala, served with coconut chutney.', price: 160, image_url: '/images/dosa.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000012', restaurant_id: 'a0000000-0000-0000-0000-000000000002', name: 'Royal Mango Lassi', description: 'Velvety smooth yogurt shake blended with sweet Alphonso mango pulp and saffron strands.', price: 110, image_url: '/images/mangolassi.jpg', category: 'Beverages', is_veg: true, is_popular: true, is_available: true },

    // Dragon Wok House
    { id: 'c0000000-0000-0000-0000-000000000013', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Kung Pao Bowl', description: 'Stir-fried crunchy vegetables, roasted peanuts, and spicy dried chilies in tangy Sichuan sauce.', price: 260, image_url: '/images/kungpao.jpg', category: 'Mains', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000014', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Hakka Veg Noodles', description: 'Smoky wok-tossed ribbon noodles with julienned cabbage, bell peppers, carrots, and spring onions.', price: 190, image_url: '/images/noodles.jpg', category: 'Mains', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000015', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Schezwan Fried Rice', description: 'Aromatic jasmine rice tossed in fiery home-made Schezwan paste and tender vegetables.', price: 210, image_url: '/images/friedrice.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000016', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Veg Manchurian Gravy', description: 'Crisp vegetable dumplings simmered in a savory garlic, ginger, and dark soy broth.', price: 220, image_url: '/images/manchurian.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000017', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Steamed Dim Sum Platter', description: 'Translucent steamed crystal dumplings stuffed with water chestnuts and aromatic greens.', price: 180, image_url: '/images/dimsum.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000018', restaurant_id: 'a0000000-0000-0000-0000-000000000003', name: 'Hot & Sour Soup', description: 'Traditional spicy and tangy broth loaded with wood-ear mushrooms, bamboo shoots, and tofu.', price: 140, image_url: '/images/hotsour.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },

    // Tokyo Ramen & Sushi Bar
    { id: 'c0000000-0000-0000-0000-000000000019', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Spicy Ramen Bowl', description: 'A warm, spicy hug in a bowl with rich miso broth, springy ramen, soft boiled egg, and nori.', price: 279, image_url: '/images/ramen.jpg', category: 'Mains', is_veg: false, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000020', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Classic Sushi Roll', description: 'Vinegared sushi rice rolled with crisp cucumber, avocado, nori, and pickled ginger.', price: 290, image_url: '/images/sushi.jpg', category: 'Starters', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000021', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Golden Tempura Platter', description: 'Crispy light batter-fried seasonal vegetables and prawns served with tentsuyu dipping sauce.', price: 250, image_url: '/images/tempura.jpg', category: 'Starters', is_veg: false, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000022', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Chicken Teriyaki Bowl', description: 'Glazed pan-seared chicken thighs in sweet mirin teriyaki reduction served over steamed rice.', price: 280, image_url: '/images/teriyaki.jpg', category: 'Mains', is_veg: false, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000023', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Savory Takoyaki Balls', description: 'Japanese street octopus & batter dumplings topped with bonito flakes, kewpie, and sweet sauce.', price: 190, image_url: '/images/takoyaki.jpg', category: 'Starters', is_veg: false, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000024', restaurant_id: 'a0000000-0000-0000-0000-000000000004', name: 'Ceremonial Matcha Iced Tea', description: 'Premium Kyoto green tea whisked smooth and poured over ice with a hint of organic honey.', price: 150, image_url: '/images/matcha.jpg', category: 'Beverages', is_veg: true, is_popular: true, is_available: true },

    // Cravers Bistro & Diner
    { id: 'c0000000-0000-0000-0000-000000000025', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Chocolate Truffle Cake', description: 'Rich, creamy and totally irresistible Belgian dark chocolate truffle slice.', price: 249, image_url: '/images/tiramisu.jpg', category: 'Desserts', is_veg: true, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000026', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Double Smash Cheese Burger', description: 'Two crispy-edged seared patties with American cheddar, tangy secret sauce, and brioche bun.', price: 210, image_url: '/images/burger.png', category: 'Mains', is_veg: false, is_popular: true, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000027', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Crispy Spiced Tikki Burger', description: 'Crunchy spiced potato patty topped with shredded lettuce, tomatoes, and spicy herb mayo.', price: 130, image_url: '/images/tikki.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000028', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Parmesan Mushroom Risotto', description: 'Slow-stirred Arborio rice with wild forest mushrooms, thyme, white wine, and aged parmesan.', price: 310, image_url: '/images/risotto.jpg', category: 'Mains', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000029', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Crispy Golden Spring Rolls', description: 'Delicate deep-fried wrapper rolls packed with glass noodles and crunchy Asian slaw.', price: 140, image_url: '/images/springrolls.jpg', category: 'Starters', is_veg: true, is_popular: false, is_available: true },
    { id: 'c0000000-0000-0000-0000-000000000030', restaurant_id: 'a0000000-0000-0000-0000-000000000005', name: 'Chilled Sparkling Cola Fizz', description: 'Classic ice-cold refreshing cola served with lemon wedge and mint sprig.', price: 70, image_url: '/images/drink.png', category: 'Beverages', is_veg: true, is_popular: false, is_available: true }
  ];

  console.log('Inserting 30 Food Items...');
  const { error: foodErr } = await supabase.from('food_items').upsert(foodItems, { onConflict: 'id' });
  if (foodErr) console.warn('Food items insert note:', foodErr.message);

  // 4. Food Moods links
  const foodMoods = [
    { food_id: 'c0000000-0000-0000-0000-000000000001', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000001', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000001', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000002', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000003', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000003', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000004', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000004', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000006', mood_id: 'b0000000-0000-0000-0000-000000000004' },
    { food_id: 'c0000000-0000-0000-0000-000000000006', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000007', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000007', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000007', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000009', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000010', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000010', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000012', mood_id: 'b0000000-0000-0000-0000-000000000004' },
    { food_id: 'c0000000-0000-0000-0000-000000000013', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000014', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000014', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000015', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000019', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000019', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000019', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000020', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000024', mood_id: 'b0000000-0000-0000-0000-000000000004' },
    { food_id: 'c0000000-0000-0000-0000-000000000025', mood_id: 'b0000000-0000-0000-0000-000000000004' },
    { food_id: 'c0000000-0000-0000-0000-000000000025', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000025', mood_id: 'b0000000-0000-0000-0000-000000000005' },
    { food_id: 'c0000000-0000-0000-0000-000000000026', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000026', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000027', mood_id: 'b0000000-0000-0000-0000-000000000002' },
    { food_id: 'c0000000-0000-0000-0000-000000000027', mood_id: 'b0000000-0000-0000-0000-000000000003' },
    { food_id: 'c0000000-0000-0000-0000-000000000028', mood_id: 'b0000000-0000-0000-0000-000000000001' },
    { food_id: 'c0000000-0000-0000-0000-000000000029', mood_id: 'b0000000-0000-0000-0000-000000000003' }
  ];

  console.log('Inserting Food-Mood junction links...');
  const { error: fmErr } = await supabase.from('food_moods').upsert(foodMoods, { onConflict: 'food_id,mood_id' });
  if (fmErr) console.warn('Food-moods link note:', fmErr.message);

  console.log('\x1b[32m%s\x1b[0m', '✅ Yumzo Supabase database successfully seeded!');
}

runSeed().catch((err) => {
  console.error('\x1b[31m%s\x1b[0m', '❌ Seed error:', err);
  process.exit(1);
});
=======
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env or .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-url')) {
  console.error('\n❌ Supabase is not configured yet!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and your API key in .env or .env.local first.\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DELHI_NCR_RESTAURANTS = [
  {
    name: 'The Indian Spice',
    cuisine: 'Indian',
    address: 'Block M, Connaught Place, New Delhi',
    city: 'New Delhi',
    rating: 4.8,
    delivery_time: '25-35 min',
    image: '/images/indian.jpeg',
    menu: [
      { name: 'Dal Makhani', price: 750, category: 'Main Course', image: '/images/dalmakhani.jpg', description: 'Slow cooked black lentils with cream and butter' },
      { name: 'Chole Bhature', price: 900, category: 'Main Course', image: '/images/bhature.jpg', description: 'Fluffy golden bhaturas served with spicy Amritsari chole' },
      { name: 'Jeera Rice', price: 850, category: 'Main Course', image: '/images/jeerarice.jpg', description: 'Aromatic basmati rice tempered with roasted cumin seeds' },
      { name: 'Samosa', price: 900, category: 'Starter', image: '/images/samosa.jpg', description: 'Crispy pastry filled with spiced potatoes and peas' },
      { name: 'Masala Dosa', price: 900, category: 'Main Course', image: '/images/dosa.jpg', description: 'Crispy fermented crepe stuffed with savory mashed potatoes' },
      { name: 'Idli Sambar', price: 900, category: 'Main Course', image: '/images/idli.jpg', description: 'Steamed rice cakes served with flavorful lentil sambar' },
      { name: 'Mango Lassi', price: 900, category: 'Beverage', image: '/images/mangolassi.jpg', description: 'Creamy yogurt shake blended with Alphonso mangoes' },
      { name: 'Aloo Tikki', price: 900, category: 'Starter', image: '/images/tikki.jpg', description: 'Crispy potato croquette served with tangy tamarind chutney' },
    ],
  },
  {
    name: 'Wok This Way',
    cuisine: 'Chinese',
    address: 'DLF Cyber Hub, Sector 24, Gurugram',
    city: 'Gurugram',
    rating: 4.6,
    delivery_time: '20-30 min',
    image: '/images/chinese.jpeg',
    menu: [
      { name: 'Hakka Noodles', price: 850, category: 'Main Course', image: '/images/noodles.jpg', description: 'Wok-tossed thin noodles with crunchy seasonal vegetables' },
      { name: 'Spring Rolls', price: 750, category: 'Starter', image: '/images/springrolls.jpg', description: 'Golden fried rolls packed with julienned vegetables' },
      { name: 'Manchurian', price: 900, category: 'Main Course', image: '/images/manchurian.jpg', description: 'Vegetable dumplings glazed in sweet and spicy dark sauce' },
      { name: 'Fried Rice', price: 800, category: 'Main Course', image: '/images/friedrice.jpg', description: 'Fluffy wok-tossed jasmine rice with garlic and scallions' },
      { name: 'Kung Pao Chicken', price: 1100, category: 'Main Course', image: '/images/kungpao.jpg', description: 'Spicy diced chicken stir-fried with peanuts and dried chilies' },
      { name: 'Sweet & Sour Pork', price: 950, category: 'Main Course', image: '/images/sweetandsour.jpg', description: 'Crispy morsels tossed with pineapple in tangy glaze' },
      { name: 'Dim Sum', price: 1000, category: 'Starter', image: '/images/dimsum.jpg', description: 'Steamed translucent dumplings served with fiery chili oil' },
      { name: 'Hot & Sour Soup', price: 600, category: 'Soup', image: '/images/hotsour.jpg', description: 'Classic spicy and tangy broth with mushrooms and tofu' },
    ],
  },
  {
    name: 'Tokyo Dreams',
    cuisine: 'Japanese',
    address: 'Worldmark 2, Aerocity, New Delhi',
    city: 'New Delhi',
    rating: 4.9,
    delivery_time: '30-40 min',
    image: '/images/japanese.jpg',
    menu: [
      { name: 'Sushi', price: 1200, category: 'Main Course', image: '/images/sushi.jpg', description: 'Artisan nigiri and maki rolls with fresh wasabi' },
      { name: 'Ramen', price: 1000, category: 'Main Course', image: '/images/ramen.jpg', description: 'Rich pork and miso broth with handmade noodles and ramen egg' },
      { name: 'Tempura', price: 950, category: 'Starter', image: '/images/tempura.jpg', description: 'Light and airy battered prawns and crisp lotus root' },
      { name: 'Udon Noodles', price: 900, category: 'Main Course', image: '/images/udon.jpg', description: 'Thick wheat flour noodles simmered in dashi broth' },
      { name: 'Takoyaki', price: 850, category: 'Starter', image: '/images/takoyaki.jpg', description: 'Crisp octopus batter balls topped with bonito flakes' },
      { name: 'Miso Soup', price: 600, category: 'Soup', image: '/images/misosoup.jpg', description: 'Traditional fermented soybean paste soup with wakame' },
      { name: 'Teriyaki Chicken', price: 1100, category: 'Main Course', image: '/images/teriyaki.jpg', description: 'Glazed chicken breast with house sweet teriyaki sauce' },
      { name: 'Matcha Ice Cream', price: 700, category: 'Dessert', image: '/images/matcha.jpg', description: 'Premium ceremonial grade green tea churned ice cream' },
    ],
  },
  {
    name: 'Bella Trattoria',
    cuisine: 'Italian',
    address: 'Middle Lane, Khan Market, New Delhi',
    city: 'New Delhi',
    rating: 4.7,
    delivery_time: '25-35 min',
    image: '/images/italian.png',
    menu: [
      { name: 'Margherita Pizza', price: 1100, category: 'Pizza', image: '/images/pizza.jpg', description: 'San Marzano tomatoes, fresh mozzarella, and sweet basil' },
      { name: 'Pasta Alfredo', price: 1050, category: 'Pasta', image: '/images/pasta.jpg', description: 'Fettuccine swirled in rich Parmesan garlic cream' },
      { name: 'Lasagna', price: 1150, category: 'Pasta', image: '/images/lasagna.jpg', description: 'Layered sheet pasta with hearty ragu and bechamel' },
      { name: 'Bruschetta', price: 750, category: 'Starter', image: '/images/bruschetta.jpg', description: 'Toasted sourdough with marinated heirloom tomatoes' },
      { name: 'Risotto', price: 1000, category: 'Main Course', image: '/images/risotto.jpg', description: 'Arborio rice slowly cooked with wild forest mushrooms' },
      { name: 'Garlic Bread', price: 600, category: 'Starter', image: '/images/garlicbread.jpg', description: 'Crusty loaf slathered in roasted garlic herb butter' },
      { name: 'Tiramisu', price: 850, category: 'Dessert', image: '/images/tiramisu.jpg', description: 'Espresso-soaked ladyfingers with mascarpone zabaglione' },
      { name: 'Focaccia', price: 700, category: 'Starter', image: '/images/focaccia.jpg', description: 'Fluffy rosemary and sea salt olive oil bread' },
    ],
  },
];

async function seed() {
  console.log('🚀 Starting Yumzo Supabase Seeding (Delhi NCR Fictional Restaurants)...');

  try {
    for (const resData of DELHI_NCR_RESTAURANTS) {
      const { menu, ...restaurantPayload } = resData;

      // Check if restaurant already exists
      const { data: existing } = await supabase
        .from('restaurants')
        .select('id')
        .eq('name', restaurantPayload.name)
        .maybeSingle();

      let restaurantId = existing?.id;

      if (!restaurantId) {
        const { data: inserted, error: insertErr } = await supabase
          .from('restaurants')
          .insert(restaurantPayload)
          .select('id')
          .single();

        if (insertErr) {
          console.error(`Failed to insert restaurant ${restaurantPayload.name}:`, insertErr.message);
          continue;
        }
        restaurantId = inserted.id;
        console.log(`✅ Created restaurant: ${restaurantPayload.name} (${restaurantId})`);
      } else {
        console.log(`ℹ️ Restaurant exists: ${restaurantPayload.name} (${restaurantId})`);
      }

      // Insert menu items
      for (const item of menu) {
        const { data: existingItem } = await supabase
          .from('menu_items')
          .select('id')
          .eq('restaurant_id', restaurantId)
          .eq('name', item.name)
          .maybeSingle();

        if (!existingItem) {
          const { error: itemErr } = await supabase.from('menu_items').insert({
            restaurant_id: restaurantId,
            name: item.name,
            price: item.price,
            category: item.category,
            image: item.image,
            description: item.description,
          });

          if (itemErr) {
            console.error(`  ⚠️ Failed to insert menu item ${item.name}:`, itemErr.message);
          } else {
            console.log(`  ➕ Added menu item: ${item.name} (₹${item.price})`);
          }
        }
      }
    }

    console.log('\n🎉 Supabase seeding completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('Fatal seed error:', error);
    process.exit(1);
  }
}

seed();
>>>>>>> 025473e (backend updated)
