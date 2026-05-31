CREATE SCHEMA IF NOT EXISTS auth;

-- Create minimal web_user table in auth schema so FK from password_reset_token can reference it
CREATE TABLE IF NOT EXISTS auth.web_user (
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(100) NOT NULL UNIQUE,
	password VARCHAR(255) NOT NULL,
	role VARCHAR(50),
	enabled BOOLEAN DEFAULT TRUE,
	email VARCHAR(100) NOT NULL UNIQUE,
	preferred_language VARCHAR(10)
);
