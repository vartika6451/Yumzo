import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  indianItems,
  chineseItems,
  japaneseItems,
  italianItems,
} from '../data/menu';
import restaurantsData from '../data/restaurants';

// Helper to consolidate local items
const getAllLocalItems = () => [
  ...indianItems.map(item => ({ ...item, cuisine: 'Indian', category: 'Main Course' })),
  ...chineseItems.map(item => ({ ...item, cuisine: 'Chinese', category: 'Main Course' })),
  ...japaneseItems.map(item => ({ ...item, cuisine: 'Japanese', category: 'Main Course' })),
  ...italianItems.map(item => ({ ...item, cuisine: 'Italian', category: 'Main Course' })),
];

/**
 * Fetch menu items with optional filters
 * Tries Supabase first if configured; falls back gracefully to local datasets.
 */
export async function getMenuItems({ cuisine = null, query = '', category = null } = {}) {
  if (isSupabaseConfigured()) {
    try {
      let req = supabase.from('menu_items').select('*, restaurants(name, cuisine)');

      if (category) {
        req = req.eq('category', category);
      }
      if (query) {
        req = req.ilike('name', `%${query}%`);
      }

      const { data, error } = await req;

      if (!error && data && data.length > 0) {
        let results = data.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          rating: item.rating || 4.5,
          time: item.prep_time || '20M',
          image: item.image_url || item.image || '/images/pizza.jpg',
          category: item.category || 'Main Course',
          cuisine: item.restaurants?.cuisine || item.cuisine || 'General',
          restaurantName: item.restaurants?.name || 'Yumzo Kitchen',
        }));

        if (cuisine) {
          results = results.filter(
            item => item.cuisine.toLowerCase() === cuisine.toLowerCase()
          );
        }

        if (results.length > 0) {
          return results;
        }
      }
    } catch (err) {
      console.warn('Supabase query failed, falling back to local menu dataset:', err.message);
    }
  }

  // Local fallback
  let items = getAllLocalItems();

  if (cuisine) {
    items = items.filter(
      item => item.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }

  if (query) {
    const q = query.toLowerCase();
    items = items.filter(
      item =>
        item.name.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q)
    );
  }

  return items;
}

/**
 * Fetch restaurants
 */
export async function getRestaurants() {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase.from('restaurants').select('*');
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase restaurants query failed, falling back to local data:', err.message);
    }
  }

  return [
    {
      id: 'res_1',
      name: 'The Indian Spice',
      cuisine: 'Indian',
      address: '123 Curry Lane, Delhi',
      image: '/images/indian.jpeg',
      rating: 4.5,
      deliveryTime: '20-30 min',
    },
    {
      id: 'res_2',
      name: 'Wok This Way',
      cuisine: 'Chinese',
      address: '456 Noodle Blvd, Mumbai',
      image: '/images/chinese.jpeg',
      rating: 4.3,
      deliveryTime: '15-25 min',
    },
    {
      id: 'res_3',
      name: 'Bella Italia',
      cuisine: 'Italian',
      address: '789 Pasta Street, Bangalore',
      image: '/images/italian.png',
      rating: 4.7,
      deliveryTime: '25-40 min',
    },
    ...restaurantsData,
  ];
}

/**
 * Place an order
 */
export async function createOrder(orderPayload) {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.warn('Supabase order creation failed, falling back to API:', err.message);
    }
  }

  // Fallback to internal Next.js API
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload),
  });
  return await res.json();
}
