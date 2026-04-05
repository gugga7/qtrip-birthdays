CREATE TABLE IF NOT EXISTS public.ai_schedule_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  model TEXT NOT NULL,
  destination_name TEXT,
  request_origin TEXT,
  activity_count INTEGER NOT NULL DEFAULT 0 CHECK (activity_count >= 0),
  trip_days INTEGER NOT NULL DEFAULT 0 CHECK (trip_days >= 0),
  status TEXT NOT NULL CHECK (
    status IN (
      'success',
      'validation_error',
      'rate_limited',
      'quota_exceeded',
      'provider_error',
      'unauthorized',
      'origin_blocked'
    )
  ),
  response_status INTEGER NOT NULL CHECK (response_status BETWEEN 100 AND 599),
  error_message TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ai_schedule_request_logs_user_requested_at
  ON public.ai_schedule_request_logs (user_id, requested_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_schedule_request_logs_session_requested_at
  ON public.ai_schedule_request_logs (session_id, requested_at DESC);

ALTER TABLE public.ai_schedule_request_logs ENABLE ROW LEVEL SECURITY;
