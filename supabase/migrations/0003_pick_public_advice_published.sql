-- Public selection requires approved status and a non-null published_at.
-- Signature, return columns, randomness, and exclusion are unchanged.
CREATE OR REPLACE FUNCTION public.pick_public_advice(
  p_age integer,
  p_exclude uuid[] DEFAULT ARRAY[]::uuid[]
)
RETURNS TABLE (id uuid, body text)
LANGUAGE sql
VOLATILE
AS $$
SELECT a.id, a.body
FROM public.advice AS a
WHERE a.status = 'approved'
  AND a.published_at IS NOT NULL
  AND a.minimum_age <= p_age
  AND a.maximum_age >= p_age
  AND NOT (a.id = ANY (COALESCE(p_exclude, ARRAY[]::uuid[])))
ORDER BY random()
LIMIT 1;
$$;
COMMENT ON FUNCTION public.pick_public_advice(integer, uuid[]) IS
  'Server-side uniform random choice among approved, published, in-range items, excluding optional ids. No weighting.';
