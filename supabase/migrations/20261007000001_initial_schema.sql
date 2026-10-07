-- ============================================================
-- CarBiz Platform - Initial Database Schema
-- ============================================================

-- Enable UUID extension


-- ============================================================
-- 1. USERS (extends Supabase auth.users)
-- ============================================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);

-- ============================================================
-- 2. VEHICLES
-- ============================================================
CREATE TABLE public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL CHECK (year >= 1900 AND year <= 2100),
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  mileage INTEGER NOT NULL DEFAULT 0 CHECK (mileage >= 0),
  fuel_type TEXT NOT NULL CHECK (fuel_type IN ('Petrol', 'Diesel', 'Hybrid', 'Electric')),
  transmission TEXT NOT NULL CHECK (transmission IN ('Automatic', 'Manual', 'CVT')),
  body_type TEXT NOT NULL CHECK (body_type IN ('Sedan', 'SUV', 'Hatchback', 'Truck', 'Van', 'Luxury')),
  condition TEXT NOT NULL CHECK (condition IN ('New', 'Used')),
  description TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('draft', 'available', 'sold', 'archived')),
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  views_count INTEGER NOT NULL DEFAULT 0,
  seller_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicles_slug ON public.vehicles(slug);
CREATE INDEX idx_vehicles_status ON public.vehicles(status);
CREATE INDEX idx_vehicles_make ON public.vehicles(make);
CREATE INDEX idx_vehicles_body_type ON public.vehicles(body_type);
CREATE INDEX idx_vehicles_price ON public.vehicles(price);
CREATE INDEX idx_vehicles_featured ON public.vehicles(featured) WHERE featured = TRUE;

-- ============================================================
-- 3. VEHICLE IMAGES
-- ============================================================
CREATE TABLE public.vehicle_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vehicle_images_vehicle ON public.vehicle_images(vehicle_id);
CREATE INDEX idx_vehicle_images_primary ON public.vehicle_images(vehicle_id, is_primary) WHERE is_primary = TRUE;

-- ============================================================
-- 4. LOGBOOK LOANS
-- ============================================================
CREATE TABLE public.logbook_loans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  vehicle_make TEXT NOT NULL,
  vehicle_model TEXT NOT NULL,
  vehicle_year INTEGER NOT NULL CHECK (vehicle_year >= 1900),
  estimated_value NUMERIC(12, 2) NOT NULL CHECK (estimated_value > 0),
  requested_amount NUMERIC(12, 2) NOT NULL CHECK (requested_amount > 0),
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'disbursed')),
  admin_notes TEXT,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_loans_status ON public.logbook_loans(status);
CREATE INDEX idx_loans_created ON public.logbook_loans(created_at DESC);

-- ============================================================
-- 5. HIRE BOOKINGS
-- ============================================================
CREATE TABLE public.hire_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  car_type TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  return_date DATE NOT NULL,
  pickup_location TEXT NOT NULL,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'ongoing', 'completed', 'cancelled')),
  total_cost NUMERIC(12, 2),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT hire_dates_valid CHECK (return_date >= pickup_date)
);

CREATE INDEX idx_bookings_status ON public.hire_bookings(status);
CREATE INDEX idx_bookings_created ON public.hire_bookings(created_at DESC);

-- ============================================================
-- 6. INQUIRIES (Contact form + Sell Car requests)
-- ============================================================
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'sell_car', 'buy_car', 'loan', 'hire')),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiries_status ON public.inquiries(status);
CREATE INDEX idx_inquiries_type ON public.inquiries(type);
CREATE INDEX idx_inquiries_created ON public.inquiries(created_at DESC);

-- ============================================================
-- 7. SETTINGS (admin config)
-- ============================================================
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_vehicles_updated_at BEFORE UPDATE ON public.vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_loans_updated_at BEFORE UPDATE ON public.logbook_loans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.hire_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logbook_loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hire_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- USERS: Users can read their own profile; admins can read all
CREATE POLICY "users_read_own" ON public.users
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- VEHICLES: Public can read available vehicles; admins can do everything
CREATE POLICY "vehicles_public_read" ON public.vehicles
  FOR SELECT USING (status = 'available' OR public.is_admin());

CREATE POLICY "vehicles_admin_all" ON public.vehicles
  FOR ALL USING (public.is_admin());

-- VEHICLE IMAGES: Public can read; admins can do everything
CREATE POLICY "vehicle_images_public_read" ON public.vehicle_images
  FOR SELECT USING (TRUE);

CREATE POLICY "vehicle_images_admin_all" ON public.vehicle_images
  FOR ALL USING (public.is_admin());

-- LOGBOOK LOANS: Anyone can insert; only admins can read/update
CREATE POLICY "loans_public_insert" ON public.logbook_loans
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "loans_admin_read" ON public.logbook_loans
  FOR SELECT USING (public.is_admin());

CREATE POLICY "loans_admin_update" ON public.logbook_loans
  FOR UPDATE USING (public.is_admin());

-- HIRE BOOKINGS: Anyone can insert; only admins can read/update
CREATE POLICY "bookings_public_insert" ON public.hire_bookings
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "bookings_admin_read" ON public.hire_bookings
  FOR SELECT USING (public.is_admin());

CREATE POLICY "bookings_admin_update" ON public.hire_bookings
  FOR UPDATE USING (public.is_admin());

-- INQUIRIES: Anyone can insert; only admins can read/update
CREATE POLICY "inquiries_public_insert" ON public.inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "inquiries_admin_read" ON public.inquiries
  FOR SELECT USING (public.is_admin());

CREATE POLICY "inquiries_admin_update" ON public.inquiries
  FOR UPDATE USING (public.is_admin());

-- SETTINGS: Only admins
CREATE POLICY "settings_admin_all" ON public.settings
  FOR ALL USING (public.is_admin());

-- ============================================================
-- TRIGGER: Auto-create public.users row on new auth signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();