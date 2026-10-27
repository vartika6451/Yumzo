import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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
