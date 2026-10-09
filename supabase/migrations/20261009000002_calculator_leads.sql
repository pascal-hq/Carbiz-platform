-- Financing and Insurance calculator leads
-- Stored in `inquiries` table with type 'financing' or 'insurance'.
-- Existing CHECK constraint only allows: general, sell_car, buy_car, loan, hire.
-- Extend the constraint.

ALTER TABLE public.inquiries DROP CONSTRAINT IF EXISTS inquiries_type_check;
ALTER TABLE public.inquiries ADD CONSTRAINT inquiries_type_check
  CHECK (type IN (
    'general', 'sell_car', 'buy_car', 'loan', 'hire',
    'financing', 'insurance'
  ));