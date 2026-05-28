UPDATE web_user
SET email = username || '@promorural.local'
WHERE email IS NULL OR btrim(email) = '';

ALTER TABLE web_user
    ALTER COLUMN email TYPE VARCHAR(100),
    ALTER COLUMN email SET NOT NULL;

ALTER TABLE web_user
    ADD CONSTRAINT web_user_email_key UNIQUE (email);

ALTER TABLE shop
    ALTER COLUMN phone_number TYPE VARCHAR(20);
