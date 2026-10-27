-- ==============================================================================
-- 🍔 YUMZO FOOD DELIVERY PLATFORM: DATABASE SCHEMA MIGRATION
-- Migration: 20261027000000_create_yumzo_schema.sql
-- Compatible with PostgreSQL 15+ and Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. USER PROFILES TABLE (Linked with Supabase auth.users)
-- ==============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text not null check (role in ('customer', 'admin', 'restaurant_owner', 'delivery_driver')) default 'customer',
  default_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Index for role-based querying
create index if not exists idx_profiles_role on public.profiles(role);

-- ==============================================================================
-- 3. RESTAURANTS TABLE
-- ==============================================================================
create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null,
  cuisine text not null,
  address text not null,
  city text not null default 'Delhi NCR',
  rating numeric(2, 1) default 4.5 check (rating >= 0 and rating <= 5),
  delivery_time text default '20-30 min',
  image text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_restaurants_cuisine on public.restaurants(cuisine);
create index if not exists idx_restaurants_city on public.restaurants(city);

-- ==============================================================================
-- 4. MENU ITEMS TABLE
-- ==============================================================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category text not null default 'Main Course',
  image text,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_menu_items_restaurant on public.menu_items(restaurant_id);
create index if not exists idx_menu_items_category on public.menu_items(category);

-- ==============================================================================
-- 5. ORDERS TABLE
-- ==============================================================================
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  restaurant_id uuid references public.restaurants(id) on delete set null,
  driver_id uuid references auth.users(id) on delete set null,
  status text not null check (
    status in ('Placed', 'Accepted', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered', 'Cancelled')
  ) default 'Placed',
  total_price numeric(10, 2) not null check (total_price >= 0),
  delivery_address text not null,
  payment_status text not null check (payment_status in ('Pending', 'Paid', 'Failed')) default 'Pending',
  stripe_session_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_restaurant on public.orders(restaurant_id);
create index if not exists idx_orders_driver on public.orders(driver_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created on public.orders(created_at desc);

-- ==============================================================================
-- 6. ORDER ITEMS TABLE (Stores fixed unit prices at time of ordering)
-- ==============================================================================
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id uuid references public.menu_items(id) on delete set null,
  item_name text not null,
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order on public.order_items(order_id);

-- ==============================================================================
-- 7. OPTIONAL CARTS & CART ITEMS (For persistent multi-device carts)
-- ==============================================================================
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  quantity integer not null check (quantity > 0) default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(cart_id, menu_item_id)
);

-- ==============================================================================
-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- ==============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if already exists and recreate
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ==============================================================================
-- 9. ENABLE SUPABASE REALTIME FOR ORDERS
-- ==============================================================================
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and tablename = 'orders'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end;
$$;

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;
alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile or public profile info"
  on public.profiles for select
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- RESTAURANTS POLICIES (Public read, owner/admin manage)
create policy "Anyone can browse active restaurants"
  on public.restaurants for select
  using (is_active = true or auth.uid() = owner_id);

create policy "Restaurant owners can update their restaurants"
  on public.restaurants for update
  using (auth.uid() = owner_id);

-- MENU ITEMS POLICIES (Public read)
create policy "Anyone can view available menu items"
  on public.menu_items for select
  using (is_available = true);

-- ORDERS POLICIES
-- Customers see their own orders; drivers see available ('Ready') or their assigned orders;
-- Restaurant owners can see orders for their restaurants; Anon allowed in demo mode.
create policy "Users can view relevant orders"
  on public.orders for select
  using (
    auth.uid() = user_id
    or auth.uid() = driver_id
    or (status = 'Ready')
    or exists (
      select 1 from public.restaurants r
      where r.id = orders.restaurant_id and r.owner_id = auth.uid()
    )
    or auth.uid() is null -- Allow demo mode reads
  );

create policy "Authenticated users and guests can create orders"
  on public.orders for insert
  with check (true);

create policy "Authorized parties can update order status"
  on public.orders for update
  using (
    auth.uid() = user_id
    or auth.uid() = driver_id
    or exists (
      select 1 from public.restaurants r
      where r.id = orders.restaurant_id and r.owner_id = auth.uid()
    )
    or auth.uid() is null -- Allow demo status advancement in simulation
  );

-- ORDER ITEMS POLICIES
create policy "Anyone who can see the order can see order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
    )
  );

create policy "Users can insert order items"
  on public.order_items for insert
  with check (true);

-- CARTS POLICIES
create policy "Users manage their own carts"
  on public.carts for all
  using (auth.uid() = user_id);

create policy "Users manage their own cart items"
  on public.cart_items for all
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id and c.user_id = auth.uid()
    )
  );
