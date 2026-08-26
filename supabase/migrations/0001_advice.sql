-- Phase 3E-1: public advice catalogue (one table, age ranges, not 91 catalogues).
-- I7 technical choice: moderation status is the single source of truth.
--   Eligible for public selection: status = 'approved' only.
--   pending, rejected, and flagged are never selected.
--   U6 (when an item becomes flagged) remains unresolved.
-- I6: body length cap is an engineering backstop until U2 is locked.
CREATE TYPE public.advice_source AS ENUM ('editorial', 'community');
CREATE TYPE public.advice_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TABLE public.advice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL,
  minimum_age integer NOT NULL,
  maximum_age integer NOT NULL,
  source_type public.advice_source NOT NULL DEFAULT 'community',
  status public.advice_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  reviewed_at timestamptz,
  internal_note text,
  CONSTRAINT advice_body_not_blank CHECK (char_length(btrim(body)) > 0),
  CONSTRAINT advice_body_max_chars CHECK (char_length(body) <= 4000),
  CONSTRAINT advice_minimum_age_range CHECK (minimum_age >= 10 AND minimum_age <= 100),
  CONSTRAINT advice_maximum_age_range CHECK (maximum_age >= 10 AND maximum_age <= 100),
  CONSTRAINT advice_age_order CHECK (minimum_age <= maximum_age)
);
CREATE INDEX advice_public_pool_idx
  ON public.advice (status, minimum_age, maximum_age)
  WHERE status = 'approved';
CREATE OR REPLACE FUNCTION public.set_advice_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER advice_set_updated_at
BEFORE UPDATE ON public.advice
FOR EACH ROW
EXECUTE FUNCTION public.set_advice_updated_at();
-- Uniform random pick among eligible rows. Seen-id exclusion is an argument (U7 storage later).
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
  AND a.minimum_age <= p_age
  AND a.maximum_age >= p_age
  AND NOT (a.id = ANY (COALESCE(p_exclude, ARRAY[]::uuid[])))
ORDER BY random()
LIMIT 1;
$$;
ALTER TABLE public.advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advice FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.advice FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.pick_public_advice(integer, uuid[]) FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.advice TO service_role;
GRANT EXECUTE ON FUNCTION public.pick_public_advice(integer, uuid[]) TO service_role;
COMMENT ON TABLE public.advice IS
  'Life-advice items. Community rows start pending. Public selection uses approved rows only, via the server.';
COMMENT ON FUNCTION public.pick_public_advice(integer, uuid[]) IS
  'Server-side uniform random choice among approved in-range items, excluding optional ids. No weighting.';
