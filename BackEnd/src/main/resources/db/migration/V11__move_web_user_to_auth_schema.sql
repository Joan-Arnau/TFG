-- Move web_user table to auth schema
ALTER TABLE IF EXISTS public.web_user SET SCHEMA auth;
