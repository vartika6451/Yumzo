/**
 * Yumzo Supabase Database Type Definitions
 */

export interface Restaurant {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  cuisine: string;
  image_url: string | null;
  banner_url: string | null;
  rating: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface FoodItem {
  id: string; // UUID
  restaurant_id: string; // UUID FK
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  is_veg: boolean;
  is_popular: boolean;
  is_available: boolean;
  created_at?: string;
  // Joined fields
  restaurants?: {
    name: string;
    slug: string;
    cuisine: string;
  };
  moods?: Mood[];
}

export interface Mood {
  id: string; // UUID
  name: string;
  slug: string;
  emoji: string;
  created_at?: string;
}

export interface FoodMood {
  food_id: string; // UUID FK
  mood_id: string; // UUID FK
}

export interface Feast {
  id: string; // UUID
  title: string;
  theme: string;
  items: CartItem[];
  total_price: number;
  created_at?: string;
}

export interface CartItem {
  id: string; // Supabase UUID
  name: string;
  price: number;
  image: string;
  quantity: number;
  restaurant_id?: string;
  restaurant_name?: string;
  category?: string;
  is_available?: boolean;
}
