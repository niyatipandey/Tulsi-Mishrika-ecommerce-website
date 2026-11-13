-- ============================================================
-- TULSI MISHRIKA E-COMMERCE - COMPLETE DATABASE SETUP
-- ============================================================
-- Copy this ENTIRE file and run it in Supabase SQL Editor
-- This creates all tables, policies, and seeds initial data
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- CREATE TABLES
-- ============================================================

-- Create profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    name TEXT,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    long_description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    image_url TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create carts table
CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Create cart_items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID REFERENCES carts ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(cart_id, product_id)
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
    status TEXT DEFAULT 'pending',
    payment_status TEXT DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES products ON DELETE CASCADE NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================
-- CREATE INDEXES
-- ============================================================

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- ============================================================
-- CREATE TRIGGERS
-- ============================================================

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- CREATE RLS POLICIES
-- ============================================================

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view active products"
    ON products FOR SELECT
    USING (active = true);

-- RLS Policies for carts
CREATE POLICY "Users can view own cart"
    ON carts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
    ON carts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
    ON carts FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
    ON carts FOR DELETE
    USING (auth.uid() = user_id);

-- RLS Policies for cart_items (access through cart ownership)
CREATE POLICY "Users can manage own cart items"
    ON cart_items FOR ALL
    USING (
        cart_id IN (
            SELECT id FROM carts WHERE user_id = auth.uid()
        )
    );

-- RLS Policies for orders
CREATE POLICY "Users can view own orders"
    ON orders FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items (access through order ownership)
CREATE POLICY "Users can view own order items"
    ON order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM orders WHERE user_id = auth.uid()
        )
    );

-- ============================================================
-- CREATE AUTH TRIGGER
-- ============================================================

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, name)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert products
INSERT INTO products (name, slug, description, long_description, price, stock, active, image_url)
VALUES 
(
    'Kunj Mishri',
    'kunj-mishri',
    'Handcrafted Kunja Mishri, made with the goodness of nature and the blessings of Tulsi.',
    'A rare and traditional form of mishri, crafted in a beautiful cup shape (Kunja), known for its pure taste, natural sweetness and numerous health benefits. Made using traditional methods passed down through generations, each piece is carefully crystallized with Tulsi leaves to enhance its medicinal properties. Perfect for religious offerings, traditional ceremonies, or simply enjoying as a healthy sweetener.

Benefits:
• 100% Natural with no chemical additives
• Enriched with Tulsi (Holy Basil) properties
• Lower glycemic index compared to regular sugar
• Rich in minerals and trace elements
• Aids digestion and soothes throat
• Traditional Ayurvedic sweetener

Each Kunj Mishri piece is handcrafted by skilled artisans using time-honored techniques, ensuring authentic quality and purity.',
    299.00,
    100,
    true,
    '/assets/kunj-mishri.jpg'
),
(
    'Baal Mishri',
    'baal-mishri',
    'Premium Baal Mishri - Pure, natural rock sugar crystals with Tulsi goodness.',
    'Traditional Baal Mishri (rock sugar) is known for its cooling properties and numerous health benefits. Our premium quality Baal Mishri is made with pure sugarcane juice and infused with Tulsi (Holy Basil) essence. Used in Ayurvedic preparations, it helps soothe throat irritation, aids digestion, and provides instant energy. Each crystal is naturally formed without any chemical processing, ensuring you receive the purest form of sweetness that our ancestors enjoyed.

Benefits:
• Cooling properties ideal for summer
• Natural energy booster
• Helps relieve cough and throat irritation
• Aids in digestion and metabolism
• Rich in natural minerals
• No artificial processing or chemicals
• Blessed with Tulsi essence for added health benefits

Our Baal Mishri is sourced from the finest sugarcane and processed using traditional methods to preserve its natural goodness. It is perfect for making traditional drinks, adding to milk, or consuming directly for its health benefits.',
    349.00,
    100,
    true,
    '/assets/baal-mishri.jpg'
);

-- ============================================================
-- SETUP COMPLETE!
-- ============================================================
-- Your database is now ready with:
-- ✅ 6 tables created
-- ✅ Row Level Security enabled
-- ✅ Indexes for performance
-- ✅ 2 products added
--
-- Next: Refresh your app at http://localhost:5173
-- ============================================================
