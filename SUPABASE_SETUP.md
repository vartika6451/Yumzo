# 🥟 Yumzo - Supabase Integration & Setup Guide

This guide explains step-by-step how to connect Yumzo to Supabase and seed fictional restaurants, craving moods, and food items.

---

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Choose a name (e.g., `Yumzo`) and a database password.
4. Select your preferred region and click **"Create new project"**.

---

## 2. Obtain API Credentials

1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy the following:
   - **Project URL** (e.g., `https://xyzproject.supabase.co`)
   - **anon / public key** (e.g., `eyJhbGciOi...`)
   - *(Optional for terminal seeding)* **service_role key** (keep secret!)

3. In your local project root, open (or create) `.env`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

---

## 3. Run the Database Schema Migration

1. In your Supabase Dashboard, open the **SQL Editor** from the left navigation.
2. Click **"New query"**.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) in this repository and copy all its contents.
4. Paste the SQL query into the Supabase SQL Editor and click **"Run"**.

This creates the following tables with primary UUIDs, constraints, and Row Level Security (RLS):
- `restaurants`: Stores kitchen details, ratings, cuisine, and banner images.
- `food_items`: Stores dishes with foreign key to `restaurants.id`, price, category, veg/non-veg status, and availability.
- `moods`: Stores 5 craving moods (Cheesy 🧀, Spicy 🌶️, Midnight snacks 🌙, Sweet tooth 🍰, Surprise me! 🎲).
- `food_moods`: Junction table connecting food items to multiple moods.
- `feasts`: Stores virtual feast creations with items JSONB and total imaginary worth.

---

## 4. Import the Seed Data

You have two convenient options to populate the database with 5 restaurants, 30 dishes, and 5 craving moods:

### Option A: Using Supabase SQL Editor (Recommended)
1. In the Supabase **SQL Editor**, click **"New query"**.
2. Open [`supabase/seed.sql`](./supabase/seed.sql) in this repository.
3. Copy all contents and paste into the editor.
4. Click **"Run"**.

### Option B: Using the Automated Terminal Command
1. Ensure your `.env` has `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
2. In your terminal, run:
   ```bash
   npm run seed:supabase
   ```

---

## 5. Storage / Media Configuration

- All 30 food items in the seed data use high-resolution local paths (`/images/pizza.jpg`, `/images/ramen.jpg`, `/images/biryani.jpg`, etc.) located in `public/images/`.
- If you wish to host your images on Supabase Storage:
  1. Go to **Storage** in the Supabase Dashboard.
  2. Create a public bucket named `food-images`.
  3. Upload your dish photos.
  4. Update `image_url` in the `food_items` table with the Supabase public URL (`https://<project>.supabase.co/storage/v1/object/public/food-images/<filename>`).

---

## 6. End-to-End Verification Flow

1. **Explore Homepage (`/home`)**:
   - Featured Kitchens will dynamically display active restaurants from Supabase.
   - Featured dishes will load dynamically with category pills and price tags in `₹ (imaginary)`.
   - Selecting a mood card (e.g. 🧀 Cheesy or 🌶️ Spicy) filters dishes using the `food_moods` junction table.
   - Searching filters by dish name, description, cuisine, or restaurant name.

2. **Dynamic Restaurant Pages (`/restaurants/[slug]`)**:
   - Click "Explore Menu" on any restaurant card (e.g., `/restaurants/bella-italia`).
   - The page dynamically fetches the restaurant info and its specific dishes using `restaurant_id`.
   - Category filter pills update dishes for that restaurant.
   - Invalid slugs automatically display a friendly 404 page.

3. **Cart & Imaginary Checkout (`/checkout`)**:
   - Click "+ Add to feast" on any available dish.
   - Unavailable dishes (`is_available = false`) are marked "Unavailable" and cannot be added.
   - Open the feast tray drawer to review imaginary totals.
   - Click "Proceed to Virtual Feast" to open `/checkout`.
   - Select a feast theme (e.g., *Midnight Munchies* 🌙, *Cozy Movie Night* 🎬) and title.
   - Click "Serve My Virtual Feast (Complete)" to validate catalog and generate the Feast Canvas.
   - Click **"Download Feast Image (.png)"** to save your banquet certificate!
