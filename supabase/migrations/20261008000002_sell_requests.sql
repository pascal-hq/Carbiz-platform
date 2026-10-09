-- ============================================================
-- SELL CAR REQUESTS: photo storage + approval workflow
-- ============================================================

-- 1. Photos table (one-to-many with inquiries)
CREATE TABLE public.inquiry_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inquiry_id UUID NOT NULL REFERENCES public.inquiries(id) ON DELETE CASCADE,
  path TEXT NOT NULL,          -- storage path in the bucket
  filename TEXT NOT NULL,      -- original filename
  size_bytes INTEGER,
  mime_type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_inquiry_photos_inquiry ON public.inquiry_photos(inquiry_id);

-- 2. Approval tracking columns on inquiries
ALTER TABLE public.inquiries
  ADD COLUMN approved_at TIMESTAMPTZ,
  ADD COLUMN approved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN rejection_reason TEXT,
  ADD COLUMN vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;

-- 3. RLS on inquiry_photos
ALTER TABLE public.inquiry_photos ENABLE ROW LEVEL SECURITY;

-- Public (anonymous sellers) can insert photo rows — they're attached to an inquiry
-- they just created. Actual file uploads happen via server action with service role.
CREATE POLICY "inquiry_photos_public_insert" ON public.inquiry_photos
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins can read/delete
CREATE POLICY "inquiry_photos_admin_read" ON public.inquiry_photos
  FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "inquiry_photos_admin_delete" ON public.inquiry_photos
  FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. Grants
GRANT INSERT ON public.inquiry_photos TO anon, authenticated;
GRANT SELECT, DELETE ON public.inquiry_photos TO authenticated;