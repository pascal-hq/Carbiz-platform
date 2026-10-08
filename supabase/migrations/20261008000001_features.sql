-- ============================================================
-- FEATURES SYSTEM
-- ============================================================

-- 1. Master list of features
CREATE TABLE public.features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'comfort_luxury',
    'technology',
    'safety',
    'performance',
    'exterior'
  )),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_features_category ON public.features(category, display_order);

-- 2. Join table: which features a vehicle has
CREATE TABLE public.vehicle_features (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (vehicle_id, feature_id)
);

CREATE INDEX idx_vehicle_features_vehicle ON public.vehicle_features(vehicle_id);
CREATE INDEX idx_vehicle_features_feature ON public.vehicle_features(feature_id) WHERE enabled = TRUE;

-- 3. Free-text extras field on vehicles
ALTER TABLE public.vehicles ADD COLUMN additional_features TEXT;

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_features ENABLE ROW LEVEL SECURITY;

-- Features: public read, admin write
CREATE POLICY "features_public_read" ON public.features
  FOR SELECT TO public USING (TRUE);

CREATE POLICY "features_admin_all" ON public.features
  FOR ALL TO authenticated USING (public.is_admin());

-- Vehicle features: public read, admin write
CREATE POLICY "vehicle_features_public_read" ON public.vehicle_features
  FOR SELECT TO public USING (TRUE);

CREATE POLICY "vehicle_features_admin_all" ON public.vehicle_features
  FOR ALL TO authenticated USING (public.is_admin());

-- ============================================================
-- SEED FEATURES
-- ============================================================

INSERT INTO public.features (key, label, category, display_order) VALUES
  -- Comfort & Luxury (order 1-7)
  ('sunroof', 'Sunroof / Moonroof / Panoramic Roof', 'comfort_luxury', 1),
  ('heated_seats', 'Heated Seats', 'comfort_luxury', 2),
  ('ventilated_seats', 'Ventilated / Cooled Seats', 'comfort_luxury', 3),
  ('leather_seats', 'Leather / Premium Synthetic Seats', 'comfort_luxury', 4),
  ('climate_control_dual', 'Dual / Multi-Zone Climate Control', 'comfort_luxury', 5),
  ('power_seats_memory', 'Power Adjustable Seats with Memory', 'comfort_luxury', 6),
  ('heated_steering', 'Heated Steering Wheel', 'comfort_luxury', 7),

  -- Technology & Infotainment (order 1-8)
  ('apple_carplay_android', 'Apple CarPlay & Android Auto', 'technology', 1),
  ('bluetooth', 'Bluetooth Connectivity', 'technology', 2),
  ('premium_sound', 'Premium Sound System (Bose, Harman Kardon, etc.)', 'technology', 3),
  ('navigation', 'Navigation System / GPS', 'technology', 4),
  ('wireless_charging', 'Wireless Device Charging', 'technology', 5),
  ('heads_up_display', 'Heads-Up Display (HUD)', 'technology', 6),
  ('keyless_entry', 'Keyless Entry / Push-Button Start', 'technology', 7),
  ('remote_start', 'Remote Engine Start', 'technology', 8),

  -- Safety & Driver Assistance (order 1-6)
  ('backup_camera_360', 'Backup Camera / 360-Degree Camera', 'safety', 1),
  ('blind_spot', 'Blind Spot Monitoring', 'safety', 2),
  ('lane_keep_assist', 'Lane Departure Warning / Lane Keep Assist', 'safety', 3),
  ('adaptive_cruise', 'Adaptive Cruise Control', 'safety', 4),
  ('auto_emergency_braking', 'Automatic Emergency Braking', 'safety', 5),
  ('parking_sensors', 'Parking Sensors (Front & Rear)', 'safety', 6),

  -- Performance & Drivetrain (order 1-4)
  ('awd_4wd', 'All-Wheel Drive (AWD) / 4x4 (4WD)', 'performance', 1),
  ('tow_hitch', 'Tow Hitch / Tow Package', 'performance', 2),
  ('drive_mode', 'Drive Mode Selector (Sport, Eco, Snow, etc.)', 'performance', 3),
  ('turbocharged', 'Turbocharged Engine', 'performance', 4),

  -- Exterior & Styling (order 1-4)
  ('alloy_wheels', 'Alloy Wheels', 'exterior', 1),
  ('led_lights', 'LED Headlights & Daytime Running Lights', 'exterior', 2),
  ('power_liftgate', 'Power Liftgate / Trunk', 'exterior', 3),
  ('roof_racks', 'Roof Racks / Side Rails', 'exterior', 4);