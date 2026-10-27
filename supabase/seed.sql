-- ============================================================
-- YUMZO - SEED DATA FOR SUPABASE
-- 5 Fictional Restaurants, 5 Moods, 30 Food Items, Food-Mood Links
-- ============================================================

-- 1. INSERT 5 CRAVING MOODS
INSERT INTO public.moods (id, name, slug, emoji) VALUES
('b0000000-0000-0000-0000-000000000001', 'Cheesy', 'cheesy', '🧀'),
('b0000000-0000-0000-0000-000000000002', 'Spicy', 'spicy', '🌶️'),
('b0000000-0000-0000-0000-000000000003', 'Midnight snacks', 'midnight', '🌙'),
('b0000000-0000-0000-0000-000000000004', 'Sweet tooth', 'sweet', '🍰'),
('b0000000-0000-0000-0000-000000000005', 'Surprise me!', 'surprise', '🎲')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  emoji = EXCLUDED.emoji;

-- 2. INSERT 5 FICTIONAL RESTAURANTS
INSERT INTO public.restaurants (id, name, slug, description, cuisine, image_url, banner_url, rating, is_featured, is_active) VALUES
(
  'a0000000-0000-0000-0000-000000000001',
  'Bella Italia Ristorante',
  'bella-italia',
  'Authentic wood-fired Neapolitan pizzas, artisanal handcrafted pasta, and velvety desserts straight from Rome.',
  'Italian',
  '/images/italian.png',
  '/images/hero_feast_spread.jpg',
  4.9,
  true,
  true
),
(
  'a0000000-0000-0000-0000-000000000002',
  'The Royal Maharani',
  'royal-maharani',
  'Regal Mughlai delicacies, fragrant handi biryanis, and rich buttery curries cooked in traditional clay tandoors.',
  'Indian',
  '/images/indian.jpeg',
  '/images/feast_table_flatlay.jpg',
  4.8,
  true,
  true
),
(
  'a0000000-0000-0000-0000-000000000003',
  'Dragon Wok House',
  'dragon-wok',
  'Sizzling wok-tossed street noodles, spicy Sichuan bowls, and delicate handmade steamed dim sums.',
  'Chinese',
  '/images/chinese.jpeg',
  '/images/hero_feast_spread.jpg',
  4.7,
  true,
  true
),
(
  'a0000000-0000-0000-0000-000000000004',
  'Tokyo Ramen & Sushi Bar',
  'tokyo-ramen-sushi',
  'Rich slow-simmered broth ramen, fresh nigiri & maki rolls, and crispy golden tempura crafted with master precision.',
  'Japanese',
  '/images/japanese.jpg',
  '/images/movie_snacks_combo.jpg',
  4.9,
  true,
  true
),
(
  'a0000000-0000-0000-0000-000000000005',
  'Cravers Bistro & Diner',
  'cravers-diner',
  'Gourmet double smash burgers, loaded melted cheese platters, and midnight comfort combos built for dreamers.',
  'Continental',
  '/images/download.png',
  '/images/movie_snacks_combo.jpg',
  4.6,
  true,
  true
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  cuisine = EXCLUDED.cuisine,
  image_url = EXCLUDED.image_url,
  banner_url = EXCLUDED.banner_url,
  rating = EXCLUDED.rating,
  is_featured = EXCLUDED.is_featured,
  is_active = EXCLUDED.is_active;

-- 3. INSERT 30 FOOD ITEMS (6 per restaurant)
INSERT INTO public.food_items (id, restaurant_id, name, description, price, image_url, category, is_veg, is_popular, is_available) VALUES
-- Restaurant 1: Bella Italia Ristorante
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Loaded Cheese Pizza', 'Classic delight with double mozzarella, black olives, bell peppers, and San Marzano tomato sauce.', 299.00, '/images/pizza.jpg', 'Pizzas', true, true, true),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'Creamy Truffle Pasta', 'Penne pasta tossed in a luxurious parmesan cream sauce infused with black truffle essence.', 280.00, '/images/pasta.jpg', 'Mains', true, true, true),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'Classic Baked Lasagna', 'Layers of tender pasta sheets, rich tomato marinara, and gooey melted fontina & mozzarella.', 320.00, '/images/lasagna.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'Cheesy Garlic Bread', 'Toasted sourdough baguette infused with roasted garlic butter and golden pull cheese.', 140.00, '/images/garlicbread.jpg', 'Starters', true, false, true),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'Rosemary Focaccia', 'Herb-infused Italian flatbread drizzled with extra virgin olive oil and sea salt flakes.', 120.00, '/images/focaccia.jpg', 'Starters', true, false, true),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'Classic Venetian Tiramisu', 'Espresso-soaked ladyfingers layered with fluffy mascarpone cream and Belgian cocoa powder.', 220.00, '/images/tiramisu.jpg', 'Desserts', true, true, true),

-- Restaurant 2: The Royal Maharani
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'Chicken Biryani', 'Fragrant long-grain basmati rice, tender chicken marinated in saffron, caramelized onions, and royal spices.', 349.00, '/images/jeerarice.jpg', 'Mains', false, true, true),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000002', 'Dal Makhani', 'Whole black lentils slow-cooked overnight over tandoor charcoal with white butter and fresh cream.', 240.00, '/images/dalmakhani.jpg', 'Mains', true, true, true),
('c0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000002', 'Amritsari Chole Bhature', 'Spiced tangy chickpea curry served with golden, fluffy deep-fried artisanal bhature.', 180.00, '/images/bhature.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000002', 'Punjabi Samosa (2 Pcs)', 'Flaky golden pastry cones stuffed with seasoned potatoes, green peas, and fragrant cumin.', 80.00, '/images/samosa.jpg', 'Starters', true, false, true),
('c0000000-0000-0000-0000-000000000011', 'a0000000-0000-0000-0000-000000000002', 'Crispy Masala Dosa', 'Golden fermented rice crepe filled with spiced potato masala, served with coconut chutney.', 160.00, '/images/dosa.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000012', 'a0000000-0000-0000-0000-000000000002', 'Royal Mango Lassi', 'Velvety smooth yogurt shake blended with sweet Alphonso mango pulp and saffron strands.', 110.00, '/images/mangolassi.jpg', 'Beverages', true, true, true),

-- Restaurant 3: Dragon Wok House
('c0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000003', 'Kung Pao Bowl', 'Stir-fried crunchy vegetables, roasted peanuts, and spicy dried chilies in tangy Sichuan sauce.', 260.00, '/images/kungpao.jpg', 'Mains', true, true, true),
('c0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000003', 'Hakka Veg Noodles', 'Smoky wok-tossed ribbon noodles with julienned cabbage, bell peppers, carrots, and spring onions.', 190.00, '/images/noodles.jpg', 'Mains', true, true, true),
('c0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000003', 'Schezwan Fried Rice', 'Aromatic jasmine rice tossed in fiery home-made Schezwan paste and tender vegetables.', 210.00, '/images/friedrice.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000016', 'a0000000-0000-0000-0000-000000000003', 'Veg Manchurian Gravy', 'Crisp vegetable dumplings simmered in a savory garlic, ginger, and dark soy broth.', 220.00, '/images/manchurian.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000017', 'a0000000-0000-0000-0000-000000000003', 'Steamed Dim Sum Platter', 'Translucent steamed crystal dumplings stuffed with water chestnuts and aromatic greens.', 180.00, '/images/dimsum.jpg', 'Starters', true, false, true),
('c0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000003', 'Hot & Sour Soup', 'Traditional spicy and tangy broth loaded with wood-ear mushrooms, bamboo shoots, and tofu.', 140.00, '/images/hotsour.jpg', 'Starters', true, false, true),

-- Restaurant 4: Tokyo Ramen & Sushi Bar
('c0000000-0000-0000-0000-000000000019', 'a0000000-0000-0000-0000-000000000004', 'Spicy Ramen Bowl', 'A warm, spicy hug in a bowl with rich miso broth, springy ramen, soft boiled egg, and nori.', 279.00, '/images/ramen.jpg', 'Mains', false, true, true),
('c0000000-0000-0000-0000-000000000020', 'a0000000-0000-0000-0000-000000000004', 'Classic Sushi Roll', 'Vinegared sushi rice rolled with crisp cucumber, avocado, nori, and pickled ginger.', 290.00, '/images/sushi.jpg', 'Starters', true, true, true),
('c0000000-0000-0000-0000-000000000021', 'a0000000-0000-0000-0000-000000000004', 'Golden Tempura Platter', 'Crispy light batter-fried seasonal vegetables and prawns served with tentsuyu dipping sauce.', 250.00, '/images/tempura.jpg', 'Starters', false, false, true),
('c0000000-0000-0000-0000-000000000022', 'a0000000-0000-0000-0000-000000000004', 'Chicken Teriyaki Bowl', 'Glazed pan-seared chicken thighs in sweet mirin teriyaki reduction served over steamed rice.', 280.00, '/images/teriyaki.jpg', 'Mains', false, false, true),
('c0000000-0000-0000-0000-000000000023', 'a0000000-0000-0000-0000-000000000004', 'Savory Takoyaki Balls', 'Japanese street octopus & batter dumplings topped with bonito flakes, kewpie, and sweet sauce.', 190.00, '/images/takoyaki.jpg', 'Starters', false, false, true),
('c0000000-0000-0000-0000-000000000024', 'a0000000-0000-0000-0000-000000000004', 'Ceremonial Matcha Iced Tea', 'Premium Kyoto green tea whisked smooth and poured over ice with a hint of organic honey.', 150.00, '/images/matcha.jpg', 'Beverages', true, true, true),

-- Restaurant 5: Cravers Bistro & Diner
('c0000000-0000-0000-0000-000000000025', 'a0000000-0000-0000-0000-000000000005', 'Chocolate Truffle Cake', 'Rich, creamy and totally irresistible Belgian dark chocolate truffle slice.', 249.00, '/images/tiramisu.jpg', 'Desserts', true, true, true),
('c0000000-0000-0000-0000-000000000026', 'a0000000-0000-0000-0000-000000000005', 'Double Smash Cheese Burger', 'Two crispy-edged seared patties with American cheddar, tangy secret sauce, and brioche bun.', 210.00, '/images/burger.png', 'Mains', false, true, true),
('c0000000-0000-0000-0000-000000000027', 'a0000000-0000-0000-0000-000000000005', 'Crispy Spiced Tikki Burger', 'Crunchy spiced potato patty topped with shredded lettuce, tomatoes, and spicy herb mayo.', 130.00, '/images/tikki.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000028', 'a0000000-0000-0000-0000-000000000005', 'Parmesan Mushroom Risotto', 'Slow-stirred Arborio rice with wild forest mushrooms, thyme, white wine, and aged parmesan.', 310.00, '/images/risotto.jpg', 'Mains', true, false, true),
('c0000000-0000-0000-0000-000000000029', 'a0000000-0000-0000-0000-000000000005', 'Crispy Golden Spring Rolls', 'Delicate deep-fried wrapper rolls packed with glass noodles and crunchy Asian slaw.', 140.00, '/images/springrolls.jpg', 'Starters', true, false, true),
('c0000000-0000-0000-0000-000000000030', 'a0000000-0000-0000-0000-000000000005', 'Chilled Sparkling Cola Fizz', 'Classic ice-cold refreshing cola served with lemon wedge and mint sprig.', 70.00, '/images/drink.png', 'Beverages', true, false, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  image_url = EXCLUDED.image_url,
  category = EXCLUDED.category,
  is_veg = EXCLUDED.is_veg,
  is_popular = EXCLUDED.is_popular,
  is_available = EXCLUDED.is_available;

-- 4. INSERT FOOD_MOODS (Connecting food items to multiple moods)
-- Mood IDs:
-- b0000000-0000-0000-0000-000000000001 = Cheesy 🧀
-- b0000000-0000-0000-0000-000000000002 = Spicy 🌶️
-- b0000000-0000-0000-0000-000000000003 = Midnight snacks 🌙
-- b0000000-0000-0000-0000-000000000004 = Sweet tooth 🍰
-- b0000000-0000-0000-0000-000000000005 = Surprise me! 🎲

INSERT INTO public.food_moods (food_id, mood_id) VALUES
-- Loaded Cheese Pizza: Cheesy, Midnight, Surprise
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005'),

-- Creamy Truffle Pasta: Cheesy
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001'),

-- Classic Baked Lasagna: Cheesy, Midnight
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003'),

-- Cheesy Garlic Bread: Cheesy, Midnight
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000003'),

-- Venetian Tiramisu: Sweet tooth, Midnight
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000004'),
('c0000000-0000-0000-0000-000000000006', 'b0000000-0000-0000-0000-000000000003'),

-- Chicken Biryani: Spicy, Midnight, Surprise
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000007', 'b0000000-0000-0000-0000-000000000005'),

-- Chole Bhature: Spicy
('c0000000-0000-0000-0000-000000000009', 'b0000000-0000-0000-0000-000000000002'),

-- Punjabi Samosa: Spicy, Midnight
('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000010', 'b0000000-0000-0000-0000-000000000003'),

-- Royal Mango Lassi: Sweet tooth
('c0000000-0000-0000-0000-000000000012', 'b0000000-0000-0000-0000-000000000004'),

-- Kung Pao Bowl: Spicy
('c0000000-0000-0000-0000-000000000013', 'b0000000-0000-0000-0000-000000000002'),

-- Hakka Veg Noodles: Midnight, Surprise
('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000014', 'b0000000-0000-0000-0000-000000000005'),

-- Schezwan Fried Rice: Spicy
('c0000000-0000-0000-0000-000000000015', 'b0000000-0000-0000-0000-000000000002'),

-- Spicy Ramen Bowl: Spicy, Midnight, Surprise
('c0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000019', 'b0000000-0000-0000-0000-000000000005'),

-- Classic Sushi Roll: Surprise
('c0000000-0000-0000-0000-000000000020', 'b0000000-0000-0000-0000-000000000005'),

-- Ceremonial Matcha: Sweet tooth
('c0000000-0000-0000-0000-000000000024', 'b0000000-0000-0000-0000-000000000004'),

-- Chocolate Truffle Cake: Sweet tooth, Midnight, Surprise
('c0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000004'),
('c0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000003'),
('c0000000-0000-0000-0000-000000000025', 'b0000000-0000-0000-0000-000000000005'),

-- Double Smash Cheese Burger: Cheesy, Midnight
('c0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000001'),
('c0000000-0000-0000-0000-000000000026', 'b0000000-0000-0000-0000-000000000003'),

-- Spiced Tikki Burger: Spicy, Midnight
('c0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000002'),
('c0000000-0000-0000-0000-000000000027', 'b0000000-0000-0000-0000-000000000003'),

-- Parmesan Mushroom Risotto: Cheesy
('c0000000-0000-0000-0000-000000000028', 'b0000000-0000-0000-0000-000000000001'),

-- Spring Rolls: Midnight
('c0000000-0000-0000-0000-000000000029', 'b0000000-0000-0000-0000-000000000003')
ON CONFLICT (food_id, mood_id) DO NOTHING;
