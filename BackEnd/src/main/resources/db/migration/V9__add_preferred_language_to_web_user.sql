ALTER TABLE web_user
    ADD COLUMN IF NOT EXISTS preferred_language VARCHAR(10);
