-- Create 'auth' schema and move password_reset_token table into it
CREATE SCHEMA IF NOT EXISTS auth;

-- Create the table in the new schema if it does not exist
CREATE TABLE IF NOT EXISTS auth.password_reset_token (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Copy data from public.password_reset_token if it exists, then drop the old table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'password_reset_token'
  ) THEN
    INSERT INTO auth.password_reset_token (id, user_id, token_hash, expires_at, used_at, created_at)
    SELECT id, user_id, token_hash, expires_at, used_at, created_at FROM public.password_reset_token;

    DROP TABLE public.password_reset_token;
  END IF;
END$$;

-- Ensure index on token_hash for fast lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_password_reset_token_token_hash
  ON auth.password_reset_token (token_hash);
