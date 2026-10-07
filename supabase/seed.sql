-- ============================================================
-- CarBiz Platform - Seed Data
-- Sample vehicles for development/prototype
-- ============================================================

-- Insert 6 sample vehicles
INSERT INTO public.vehicles (slug, title, make, model, year, price, mileage, fuel_type, transmission, body_type, condition, description, status, featured)
VALUES
  ('toyota-harrier-2020', 'Toyota Harrier 2020', 'Toyota', 'Harrier', 2020, 4500000, 25000, 'Petrol', 'Automatic', 'SUV', 'Used',
   'Well maintained Toyota Harrier with full service history. Accident free, one owner, keyless entry, reverse camera, leather seats.',
   'available', TRUE),
  ('honda-crv-2021', 'Honda CR-V 2021', 'Honda', 'CR-V', 2021, 3800000, 18000, 'Petrol', 'CVT', 'SUV', 'Used',
   'Excellent condition Honda CR-V, one owner, full service history, sunroof, alloy rims, reverse camera.',
   'available', TRUE),
  ('mazda-cx5-2022', 'Mazda CX-5 2022', 'Mazda', 'CX-5', 2022, 4200000, 12000, 'Petrol', 'Automatic', 'SUV', 'Used',
   'Like new Mazda CX-5. Low mileage, leather interior, BOSE sound system, adaptive cruise control.',
   'available', TRUE),
  ('nissan-navara-2023', 'Nissan Navara 2023', 'Nissan', 'Navara', 2023, 5200000, 5000, 'Diesel', 'Automatic', 'Truck', 'New',
   'Brand new Nissan Navara double cab. 4WD, leather seats, tow bar, ready for any terrain.',
   'available', FALSE),
  ('subaru-outback-2021', 'Subaru Outback 2021', 'Subaru', 'Outback', 2021, 3600000, 32000, 'Petrol', 'CVT', 'SUV', 'Used',
   'Reliable Subaru Outback AWD. Perfect family car with excellent safety features and spacious interior.',
   'available', FALSE),
  ('mercedes-c200-2022', 'Mercedes-Benz C200 2022', 'Mercedes-Benz', 'C200', 2022, 7500000, 8000, 'Petrol', 'Automatic', 'Luxury', 'Used',
   'Luxury Mercedes C200 AMG line. Panoramic roof, ambient lighting, premium sound, sports package.',
   'available', TRUE);

-- Insert vehicle images (3 per vehicle, using picsum for now)
INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, display_order)
SELECT id, 'https://picsum.photos/seed/' || slug || '/800/600', TRUE, 0 FROM public.vehicles;

INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, display_order)
SELECT id, 'https://picsum.photos/seed/' || slug || '-2/800/600', FALSE, 1 FROM public.vehicles;

INSERT INTO public.vehicle_images (vehicle_id, url, is_primary, display_order)
SELECT id, 'https://picsum.photos/seed/' || slug || '-3/800/600', FALSE, 2 FROM public.vehicles;