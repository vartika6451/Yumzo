import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Fetch all active restaurants from Supabase
 * @param {Object} options
 * @returns {Promise<{ data: Array, count: number, isConfigured: boolean, error: any }>}
 */
export async function getRestaurants({ featuredOnly = false, activeOnly = true } = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: [], count: 0, isConfigured: false, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    let query = supabase.from('restaurants').select('*');

    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    query = query.order('rating', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching restaurants from Supabase:', error.message);
      return { data: [], count: 0, isConfigured: true, error: error.message };
    }

    return { data: data || [], count: data?.length || 0, isConfigured: true, error: null };
  } catch (err) {
    console.error('Unexpected error in getRestaurants:', err);
    return { data: [], count: 0, isConfigured: true, error: err.message };
  }
}

/**
 * Fetch a single restaurant by its unique slug
 * @param {string} slug
 * @returns {Promise<{ data: Object|null, isConfigured: boolean, error: any }>}
 */
export async function getRestaurantBySlug(slug) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: null, isConfigured: false, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error fetching restaurant by slug:', error.message);
      return { data: null, isConfigured: true, error: error.message };
    }

    return { data, isConfigured: true, error: null };
  } catch (err) {
    console.error('Unexpected error in getRestaurantBySlug:', err);
    return { data: null, isConfigured: true, error: err.message };
  }
}

/**
 * Fetch all craving moods
 * @returns {Promise<{ data: Array, count: number, isConfigured: boolean, error: any }>}
 */
export async function getMoods() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: [], count: 0, isConfigured: false, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    const { data, error } = await supabase
      .from('moods')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching moods from Supabase:', error.message);
      return { data: [], count: 0, isConfigured: true, error: error.message };
    }

    return { data: data || [], count: data?.length || 0, isConfigured: true, error: null };
  } catch (err) {
    console.error('Unexpected error in getMoods:', err);
    return { data: [], count: 0, isConfigured: true, error: err.message };
  }
}

/**
 * Fetch menu items with dynamic filters: restaurantId, category, cuisine, moodSlug, search query
 * @param {Object} options
 * @returns {Promise<{ data: Array, count: number, isConfigured: boolean, error: any }>}
 */
export async function getMenuItems({
  restaurantId = null,
  category = null,
  cuisine = null,
  moodSlug = null,
  query = '',
  popularOnly = false,
  availableOnly = true
} = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: [], count: 0, isConfigured: false, error: 'SUPABASE_NOT_CONFIGURED' };
  }

  try {
    let req = supabase
      .from('food_items')
      .select(`
        id,
        restaurant_id,
        name,
        description,
        price,
        image_url,
        category,
        is_veg,
        is_popular,
        is_available,
        created_at,
        restaurants (
          id,
          name,
          slug,
          cuisine
        ),
        food_moods (
          moods (
            id,
            name,
            slug,
            emoji
          )
        )
      `);

    if (availableOnly) {
      req = req.eq('is_available', true);
    }

    if (restaurantId) {
      req = req.eq('restaurant_id', restaurantId);
    }

    if (category && category !== 'All') {
      req = req.eq('category', category);
    }

    if (popularOnly) {
      req = req.eq('is_popular', true);
    }

    if (query && query.trim()) {
      const q = query.trim();
      req = req.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
    }

    const { data, error } = await req;

    if (error) {
      console.error('Error fetching food items from Supabase:', error.message);
      return { data: [], count: 0, isConfigured: true, error: error.message };
    }

    if (!data) {
      return { data: [], count: 0, isConfigured: true, error: null };
    }

    // Process and normalize items
    let results = data.map((item) => {
      // Flatten moods array from joined food_moods
      const itemMoods = (item.food_moods || [])
        .map((fm) => fm.moods)
        .filter(Boolean);

      return {
        id: item.id,
        restaurant_id: item.restaurant_id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        image: item.image_url || '/images/pizza.jpg',
        image_url: item.image_url,
        category: item.category,
        is_veg: item.is_veg,
        is_popular: item.is_popular,
        is_available: item.is_available,
        restaurantName: item.restaurants?.name || 'Yumzo Kitchen',
        restaurantSlug: item.restaurants?.slug || '',
        cuisine: item.restaurants?.cuisine || 'General',
        moods: itemMoods
      };
    });

    // Filter by cuisine if specified
    if (cuisine && cuisine !== 'All') {
      results = results.filter((item) =>
        item.cuisine.toLowerCase().includes(cuisine.toLowerCase())
      );
    }

    // Filter by mood if specified
    if (moodSlug && moodSlug !== 'all') {
      results = results.filter((item) =>
        item.moods.some((m) => m.slug.toLowerCase() === moodSlug.toLowerCase())
      );
    }

    return { data: results, count: results.length, isConfigured: true, error: null };
  } catch (err) {
    console.error('Unexpected error in getMenuItems:', err);
    return { data: [], count: 0, isConfigured: true, error: err.message };
  }
}

/**
 * Validate cart items against live Supabase catalog
 * @param {Array<string>} itemIds 
 * @returns {Promise<{ valid: boolean, unavailableItems: Array, updatedItems: Array }>}
 */
export async function validateCartCatalog(itemIds) {
  if (!itemIds || itemIds.length === 0) {
    return { valid: true, unavailableItems: [], updatedItems: [] };
  }

  if (!isSupabaseConfigured() || !supabase) {
    // If Supabase not yet configured, allow simulation
    return { valid: true, unavailableItems: [], updatedItems: [] };
  }

  try {
    const { data, error } = await supabase
      .from('food_items')
      .select('id, name, price, is_available')
      .in('id', itemIds);

    if (error) {
      console.warn('Catalog validation query error, allowing simulated checkout:', error.message);
      return { valid: true, unavailableItems: [], updatedItems: [] };
    }

    const liveMap = new Map((data || []).map((i) => [i.id, i]));
    const unavailableItems = [];

    for (const id of itemIds) {
      const liveItem = liveMap.get(id);
      if (!liveItem || !liveItem.is_available) {
        unavailableItems.push(id);
      }
    }

    return {
      valid: unavailableItems.length === 0,
      unavailableItems,
      updatedItems: data || []
    };
  } catch (err) {
    console.error('Catalog validation error:', err);
    return { valid: true, unavailableItems: [], updatedItems: [] };
  }
}

/**
 * Save a virtual feast
 * @param {Object} feastPayload
 * @returns {Promise<{ data: Object, isSavedInDb: boolean, error: any }>}
 */
export async function saveVirtualFeast({ title, theme, items, totalPrice }) {
  const payload = {
    title: title || 'My Imaginary Feast',
    theme: theme || 'Midnight Munchies',
    items,
    total_price: Number(totalPrice) || 0
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('feasts')
        .insert([payload])
        .select()
        .single();

      if (!error && data) {
        return { data, isSavedInDb: true, error: null };
      }
      console.warn('Feast database insert failed, storing locally:', error?.message);
    } catch (err) {
      console.warn('Supabase feast insert error:', err);
    }
  }

  // Local fallback object
  const localFeast = {
    id: 'feast_' + Math.random().toString(36).substring(2, 9),
    ...payload,
    created_at: new Date().toISOString()
  };

  return { data: localFeast, isSavedInDb: false, error: null };
}
