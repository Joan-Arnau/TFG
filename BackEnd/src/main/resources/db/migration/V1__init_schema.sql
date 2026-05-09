CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. White Label Configuration
CREATE TABLE municipality_config (
    id BIGSERIAL PRIMARY KEY,
    default_language VARCHAR(10) NOT NULL,
    supported_languages JSONB NOT NULL,
    branding JSONB NOT NULL,
    location geometry(Point, 4326)
);

-- 2. Management Panel Users
CREATE TABLE web_user (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. Categories (i18n)
CREATE TABLE category (
    id BIGSERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    type VARCHAR(30) NOT NULL
);

-- 4. Shops
CREATE TABLE shop (
    id BIGSERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    address VARCHAR(255),
    phone_number VARCHAR(30),
    header_image_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    category_id BIGINT REFERENCES category(id),
    owner_user_id BIGINT UNIQUE REFERENCES web_user(id),
    location geometry(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 5. Promotions
CREATE TABLE promotion (
    id BIGSERIAL PRIMARY KEY,
    shop_id BIGINT NOT NULL REFERENCES shop(id) ON DELETE CASCADE,
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    image_url VARCHAR(500),
    starts_at DATE NOT NULL,
    ends_at DATE NOT NULL
);

-- 6. Municipal Announcements
CREATE TABLE announcement (
    id BIGSERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    content JSONB NOT NULL,
    category_id BIGINT REFERENCES category(id),
    is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- 7. Agenda and Events
CREATE TABLE app_event (
    id BIGSERIAL PRIMARY KEY,
    title JSONB NOT NULL,
    description JSONB NOT NULL,
    location_text JSONB,
    category_id BIGINT REFERENCES category(id),
    is_festival BOOLEAN NOT NULL DEFAULT FALSE,
    starts_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ends_at TIMESTAMP WITH TIME ZONE,
    location_geom geometry(Point, 4326)
);

-- 8. Points of Interest (POIs)
CREATE TABLE point_of_interest (
    id BIGSERIAL PRIMARY KEY,
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    image_url VARCHAR(500),
    category_id BIGINT REFERENCES category(id),
    location geometry(Point, 4326) NOT NULL
);

-- 9. Contact Directory
CREATE TABLE contact (
    id BIGSERIAL PRIMARY KEY,
    service_name JSONB NOT NULL,
    phone_number VARCHAR(30) NOT NULL,
    icon_name VARCHAR(50),
    category_id BIGINT REFERENCES category(id)
);
