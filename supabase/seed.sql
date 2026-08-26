-- Development-only fixture. Do not treat this as the founder library.
-- Pending community rows must never be selected.
INSERT INTO public.advice (body, minimum_age, maximum_age, source_type, status, published_at)
VALUES
(
  'If you can, keep one evening a week with nothing scheduled. Exhaustion often looks like a personality.',
  18,
  40,
  'editorial',
  'approved',
  now()
),
(
  'You do not have to have a five-year plan. You can have a next sensible step.',
  16,
  30,
  'editorial',
  'approved',
  now()
),
(
  'This pending community sentence must never appear in the public pool.',
  10,
  100,
  'community',
  'pending',
  NULL
);
