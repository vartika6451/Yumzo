-- ============================================================
-- YUMZO - SUPABASE DATABASE SCHEMA MIGRATION
-- Tables: restaurants, food_items, moods, food_moods, feasts
-- ============================================================

-- Enable pgcrypto for UUID generation if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. RESTAURANTS TABLE
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cuisine TEXT NOT NULL,
    image_url TEXT,
    banner_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.5 CHECK (rating >= 1.0 AND rating <= 5.0),
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. FOOD_ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT,
    category TEXT NOT NULL,
    is_veg BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. MOODS TABLE
CREATE TABLE IF NOT EXISTS public.moods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    emoji TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. FOOD_MOODS JUNCTION TABLE
CREATE TABLE IF NOT EXISTS public.food_moods (
    food_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
    mood_id UUID NOT NULL REFERENCES public.moods(id) ON DELETE CASCADE,
    PRIMARY KEY (food_id, mood_id)
);

-- 5. FEASTS TABLE (Imaginary virtual feast creations)
CREATE TABLE IF NOT EXISTS public.feasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    theme TEXT NOT NULL,
    items JSONB NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_restaurants_slug ON public.restaurants(slug);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON public.restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON public.restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_featured ON public.restaurants(is_featured);

CREATE INDEX IF NOT EXISTS idx_food_items_restaurant ON public.food_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_food_items_category ON public.food_items(category);
CREATE INDEX IF NOT EXISTS idx_food_items_popular ON public.food_items(is_popular);
CREATE INDEX IF NOT EXISTS idx_food_items_available ON public.food_items(is_available);

CREATE INDEX IF NOT EXISTS idx_moods_slug ON public.moods(slug);
CREATE INDEX IF NOT EXISTS idx_food_moods_food ON public.food_moods(food_id);
CREATE INDEX IF NOT EXISTS idx_food_moods_mood ON public.food_moods(mood_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feasts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow public read on restaurants" ON public.restaurants;
DROP POLICY IF EXISTS "Allow public read on food_items" ON public.food_items;
DROP POLICY IF EXISTS "Allow public read on moods" ON public.moods;
DROP POLICY IF EXISTS "Allow public read on food_moods" ON public.food_moods;
DROP POLICY IF EXISTS "Allow public read on feasts" ON public.feasts;
DROP POLICY IF EXISTS "Allow public insert on feasts" ON public.feasts;

-- Restaurants: anyone can read active restaurants
CREATE POLICY "Allow public read on restaurants"
ON public.restaurants FOR SELECT
USING (is_active = true);

-- Food items: anyone can read available items
CREATE POLICY "Allow public read on food_items"
ON public.food_items FOR SELECT
USING (is_available = true);

-- Moods: anyone can read moods
CREATE POLICY "Allow public read on moods"
ON public.moods FOR SELECT
USING (true);

-- Food Moods: anyone can read relations
CREATE POLICY "Allow public read on food_moods"
ON public.food_moods FOR SELECT
USING (true);

-- Feasts: anyone can view created feasts
CREATE POLICY "Allow public read on feasts"
ON public.feasts FOR SELECT
USING (true);

-- Feasts: anyone can save a virtual feast
CREATE POLICY "Allow public insert on feasts"
ON public.feasts FOR INSERT
WITH CHECK (true);
