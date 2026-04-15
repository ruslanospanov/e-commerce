-- ============================================================
--  E-Commerce Database Schema
--  PostgreSQL
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  USERS
-- ============================================================
CREATE TABLE users (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name          VARCHAR(255) NOT NULL,
    phone         VARCHAR(50),
    avatar_url    TEXT,
    role          VARCHAR(20)  NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    email_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    last_login    TIMESTAMPTZ,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role  ON users(role);

-- ============================================================
--  CATEGORIES
-- ============================================================
CREATE TABLE categories (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL UNIQUE,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================================
--  PRODUCTS
-- ============================================================
CREATE TABLE products (
    id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id  UUID           NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name         VARCHAR(255)   NOT NULL,
    slug         VARCHAR(255)   NOT NULL UNIQUE,
    description  TEXT,
    sku          VARCHAR(100)   UNIQUE,
    price        NUMERIC(10,2)  NOT NULL CHECK (price >= 0),
    cost         NUMERIC(10,2)  NOT NULL CHECK (cost >= 0),
    stock        INTEGER        NOT NULL DEFAULT 0 CHECK (stock >= 0),
    rating       FLOAT          NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    review_count INTEGER        NOT NULL DEFAULT 0,
    image_urls   TEXT[]         NOT NULL DEFAULT '{}',
    is_active    BOOLEAN        NOT NULL DEFAULT TRUE,
    is_featured  BOOLEAN        NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug        ON products(slug);
CREATE INDEX idx_products_sku         ON products(sku);
CREATE INDEX idx_products_name        ON products(name);
CREATE INDEX idx_products_is_active   ON products(is_active);

-- ============================================================
--  CARTS
-- ============================================================
CREATE TABLE carts (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity   INTEGER     NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, product_id)
);

CREATE INDEX idx_carts_user_id ON carts(user_id);

-- ============================================================
--  ORDERS
-- ============================================================
CREATE TABLE orders (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID          NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status            VARCHAR(20)   NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending','paid','processing','shipped','delivered','cancelled')),
    total_price       NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    tax_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
    shipping_amount   NUMERIC(10,2) NOT NULL DEFAULT 0,
    discount_amount   NUMERIC(10,2) NOT NULL DEFAULT 0,
    stripe_payment_id VARCHAR(255),
    stripe_charge_id  VARCHAR(255),
    shipping_address  JSONB,
    billing_address   JSONB,
    tracking_number   VARCHAR(100),
    notes             TEXT,
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id    ON orders(user_id);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================
--  ORDER ITEMS
-- ============================================================
CREATE TABLE order_items (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id          UUID          NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id        UUID          NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity          INTEGER       NOT NULL CHECK (quantity >= 1),
    price_at_purchase NUMERIC(10,2) NOT NULL CHECK (price_at_purchase >= 0),
    subtotal          NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
    created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id   ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================
--  REVIEWS
-- ============================================================
CREATE TABLE reviews (
    id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id            UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id               UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    order_id              UUID        REFERENCES orders(id) ON DELETE SET NULL,
    rating                INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title                 VARCHAR(255),
    comment               TEXT,
    is_verified_purchase  BOOLEAN     NOT NULL DEFAULT FALSE,
    helpful_count         INTEGER     NOT NULL DEFAULT 0,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id    ON reviews(user_id);

-- ============================================================
--  TOKEN BLOCKLIST
-- ============================================================
CREATE TABLE token_blocklist (
    token      TEXT         NOT NULL PRIMARY KEY,
    expires_at TIMESTAMPTZ  NOT NULL
);

CREATE INDEX idx_token_blocklist_expires_at ON token_blocklist(expires_at);

-- ============================================================
--  AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['users','categories','products','carts','orders','order_items','reviews']
  LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at
       BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();',
       tbl, tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
--  SEED DATA (optional — remove in production)
-- ============================================================

INSERT INTO categories (name, slug, description) VALUES
  ('Electronics', 'electronics', 'Electronic devices and gadgets'),
  ('Clothing',    'clothing',    'Apparel and accessories'),
  ('Books',       'books',       'Physical and digital books');