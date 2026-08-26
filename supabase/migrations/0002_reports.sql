-- Phase 3G: public reports attach to advice. No reporter identity (U8).
-- Recording a report does not change advice.status (U6 remains unresolved).
CREATE TABLE public.advice_report (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advice_id uuid NOT NULL REFERENCES public.advice (id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  handling_state text NOT NULL DEFAULT 'open',
  CONSTRAINT advice_report_handling_state_check
    CHECK (handling_state IN ('open', 'reviewed', 'dismissed'))
);
CREATE INDEX advice_report_advice_id_idx ON public.advice_report (advice_id);
ALTER TABLE public.advice_report ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advice_report FORCE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.advice_report FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.advice_report TO service_role;
COMMENT ON TABLE public.advice_report IS
  'Anonymous public reports of advice items. No reporter identity. Does not auto-flag or unpublish.';
