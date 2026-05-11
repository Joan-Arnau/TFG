-- Product Images (for shop products/promotions)
CREATE TABLE product_image (
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    shop_id BIGINT NOT NULL REFERENCES shop(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);