CREATE TABLE IF NOT EXISTS upload_file (
    id          BIGSERIAL       PRIMARY KEY,
    url         VARCHAR(1024)   NOT NULL,
    uploaded_at TIMESTAMP       NOT NULL,
    shop_id     BIGINT          REFERENCES shop(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_image (
    id          BIGSERIAL       PRIMARY KEY,
    image_url   VARCHAR(1024)   NOT NULL,
    uploaded_at TIMESTAMP       NOT NULL,
    shop_id     BIGINT          NOT NULL REFERENCES shop(id) ON DELETE CASCADE
);