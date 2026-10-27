import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
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
