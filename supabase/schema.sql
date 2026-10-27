-- ====================================================================
-- Yumzo - Supabase Complete Database Schema & Seed Data
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    address TEXT NOT NULL,
    image_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    delivery_time TEXT DEFAULT '20-30 min',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    prep_time TEXT DEFAULT '15M',
    rating NUMERIC(2, 1) DEFAULT 4.5,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'Main Course',
    cuisine TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE SET NULL,
    driver_id UUID,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'Placed' CHECK (status IN ('Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled')),
    delivery_address TEXT NOT NULL,
    payment_status TEXT DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Row Level Security (RLS)
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access to restaurants and menu items
CREATE POLICY "Allow public read access on restaurants" 
ON public.restaurants FOR SELECT USING (true);

CREATE POLICY "Allow public read access on menu_items" 
ON public.menu_items FOR SELECT USING (true);

-- Allow anyone to create and read orders
CREATE POLICY "Allow public insert on orders" 
ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on orders" 
ON public.orders FOR SELECT USING (true);

CREATE POLICY "Allow public update on orders" 
ON public.orders FOR UPDATE USING (true);

-- ====================================================================
-- SEED DATA (All 3 Restaurants & 32 Curated Food Dishes)
-- ====================================================================

DO $$
DECLARE
    res_indian UUID;
    res_chinese UUID;
    res_japanese UUID;
    res_italian UUID;
BEGIN
    -- Clear previous seed if re-running
    DELETE FROM public.menu_items;
    DELETE FROM public.restaurants;

    -- Insert Restaurants
    INSERT INTO public.restaurants (name, cuisine, address, image_url, rating, delivery_time)
    VALUES ('The Indian Spice', 'Indian', '123 Curry Lane, Delhi', '/images/indian.jpeg', 4.5, '20-30 min')
    RETURNING id INTO res_indian;

    INSERT INTO public.restaurants (name, cuisine, address, image_url, rating, delivery_time)
    VALUES ('Wok This Way', 'Chinese', '456 Noodle Blvd, Mumbai', '/images/chinese.jpeg', 4.3, '15-25 min')
    RETURNING id INTO res_chinese;

    INSERT INTO public.restaurants (name, cuisine, address, image_url, rating, delivery_time)
    VALUES ('Tokyo Bites', 'Japanese', '505 Sakura Way, Bangalore', '/images/japanese.jpg', 4.8, '18-28 min')
    RETURNING id INTO res_japanese;

    INSERT INTO public.restaurants (name, cuisine, address, image_url, rating, delivery_time)
    VALUES ('Bella Italia', 'Italian', '789 Pasta Street, Bangalore', '/images/italian.png', 4.7, '25-40 min')
    RETURNING id INTO res_italian;

    -- Insert Indian Menu Items
    INSERT INTO public.menu_items (restaurant_id, name, price, rating, prep_time, image_url, cuisine, category) VALUES
    (res_indian, 'Dal Makhani', 750, 4.0, '12M', '/images/dalmakhani.jpg', 'Indian', 'Main Course'),
    (res_indian, 'Chole Bhature', 900, 4.5, '20M', '/images/bhature.jpg', 'Indian', 'Main Course'),
    (res_indian, 'Jeera Rice', 850, 3.7, '13M', '/images/jeerarice.jpg', 'Indian', 'Main Course'),
    (res_indian, 'Samosa', 900, 4.1, '15M', '/images/samosa.jpg', 'Indian', 'Starter'),
    (res_indian, 'Masala Dosa', 900, 4.3, '24M', '/images/dosa.jpg', 'Indian', 'Main Course'),
    (res_indian, 'Idli Sambar', 900, 3.7, '33M', '/images/idli.jpg', 'Indian', 'Main Course'),
    (res_indian, 'Mango Lassi', 900, 4.3, '30M', '/images/mangolassi.jpg', 'Indian', 'Beverage'),
    (res_indian, 'Aloo Tikki', 900, 4.9, '40M', '/images/tikki.jpg', 'Indian', 'Starter');

    -- Insert Chinese Menu Items
    INSERT INTO public.menu_items (restaurant_id, name, price, rating, prep_time, image_url, cuisine, category) VALUES
    (res_chinese, 'Hakka Noodles', 850, 4.5, '15M', '/images/noodles.jpg', 'Chinese', 'Main Course'),
    (res_chinese, 'Spring Rolls', 750, 4.3, '12M', '/images/springrolls.jpg', 'Chinese', 'Starter'),
    (res_chinese, 'Manchurian', 900, 4.4, '18M', '/images/manchurian.jpg', 'Chinese', 'Main Course'),
    (res_chinese, 'Fried Rice', 800, 4.6, '14M', '/images/friedrice.jpg', 'Chinese', 'Main Course'),
    (res_chinese, 'Kung Pao Chicken', 1100, 4.7, '22M', '/images/kungpao.jpg', 'Chinese', 'Main Course'),
    (res_chinese, 'Sweet & Sour Pork', 950, 4.2, '20M', '/images/sweetandsour.jpg', 'Chinese', 'Main Course'),
    (res_chinese, 'Dim Sum', 1000, 4.5, '18M', '/images/dimsum.jpg', 'Chinese', 'Starter'),
    (res_chinese, 'Hot & Sour Soup', 600, 4.3, '10M', '/images/hotsour.jpg', 'Chinese', 'Soup');

    -- Insert Japanese Menu Items
    INSERT INTO public.menu_items (restaurant_id, name, price, rating, prep_time, image_url, cuisine, category) VALUES
    (res_japanese, 'Sushi', 1200, 4.8, '18M', '/images/sushi.jpg', 'Japanese', 'Main Course'),
    (res_japanese, 'Ramen', 1000, 4.5, '22M', '/images/ramen.jpg', 'Japanese', 'Main Course'),
    (res_japanese, 'Tempura', 950, 4.4, '20M', '/images/tempura.jpg', 'Japanese', 'Starter'),
    (res_japanese, 'Udon Noodles', 900, 4.3, '17M', '/images/udon.jpg', 'Japanese', 'Main Course'),
    (res_japanese, 'Takoyaki', 850, 4.2, '15M', '/images/takoyaki.jpg', 'Japanese', 'Starter'),
    (res_japanese, 'Miso Soup', 600, 4.1, '10M', '/images/misosoup.jpg', 'Japanese', 'Soup'),
    (res_japanese, 'Teriyaki Chicken', 1100, 4.6, '25M', '/images/teriyaki.jpg', 'Japanese', 'Main Course'),
    (res_japanese, 'Matcha Ice Cream', 700, 4.7, '8M', '/images/matcha.jpg', 'Japanese', 'Dessert');

    -- Insert Italian Menu Items
    INSERT INTO public.menu_items (restaurant_id, name, price, rating, prep_time, image_url, cuisine, category) VALUES
    (res_italian, 'Margherita Pizza', 1100, 4.7, '20M', '/images/pizza.jpg', 'Italian', 'Pizza'),
    (res_italian, 'Pasta Alfredo', 1050, 4.5, '25M', '/images/pasta.jpg', 'Italian', 'Pasta'),
    (res_italian, 'Lasagna', 1150, 4.6, '30M', '/images/lasagna.jpg', 'Italian', 'Main Course'),
    (res_italian, 'Bruschetta', 750, 4.2, '12M', '/images/bruschetta.jpg', 'Italian', 'Starter'),
    (res_italian, 'Risotto', 1000, 4.4, '28M', '/images/risotto.jpg', 'Italian', 'Main Course'),
    (res_italian, 'Garlic Bread', 600, 4.3, '10M', '/images/garlicbread.jpg', 'Italian', 'Starter'),
    (res_italian, 'Tiramisu', 850, 4.8, '8M', '/images/tiramisu.jpg', 'Italian', 'Dessert'),
    (res_italian, 'Focaccia', 700, 4.1, '15M', '/images/focaccia.jpg', 'Italian', 'Starter');

END $$;
