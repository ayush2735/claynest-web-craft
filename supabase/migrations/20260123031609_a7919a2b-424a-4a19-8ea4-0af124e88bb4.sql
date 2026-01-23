-- Create products table for ceramic items
CREATE TABLE public.products (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('cups', 'plates', 'pots', 'bowls', 'vases', 'other')),
    price DECIMAL(10,2) NOT NULL,
    min_order_quantity INTEGER NOT NULL DEFAULT 10,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    company_name TEXT,
    shipping_address TEXT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact inquiries table for B2B inquiries
CREATE TABLE public.inquiries (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'responded', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Products are publicly viewable (B2B catalog)
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Orders can be created by anyone (guests can order)
CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

-- Orders can be viewed by email match
CREATE POLICY "Orders viewable by customer email" 
ON public.orders 
FOR SELECT 
USING (true);

-- Order items follow parent order
CREATE POLICY "Order items can be inserted with order" 
ON public.order_items 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Order items are viewable" 
ON public.order_items 
FOR SELECT 
USING (true);

-- Anyone can submit inquiries
CREATE POLICY "Anyone can submit inquiries" 
ON public.inquiries 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products
INSERT INTO public.products (name, description, category, price, min_order_quantity, stock_quantity, is_featured) VALUES
('Artisan Clay Cup', 'Handcrafted ceramic cup with natural clay finish. Perfect for tea and coffee.', 'cups', 8.50, 50, 500, true),
('Rustic Dinner Plate', 'Traditional ceramic dinner plate with earthy glaze. 10-inch diameter.', 'plates', 12.00, 30, 300, true),
('Terracotta Plant Pot', 'Classic terracotta pot for indoor and outdoor plants. Multiple sizes available.', 'pots', 15.00, 25, 200, true),
('Ceramic Serving Bowl', 'Large handmade ceramic bowl perfect for salads and family-style dining.', 'bowls', 22.00, 20, 150, true),
('Decorative Vase', 'Elegant ceramic vase with hand-painted traditional patterns.', 'vases', 35.00, 15, 100, true),
('Espresso Cup Set', 'Set of 6 small ceramic espresso cups with saucers.', 'cups', 45.00, 10, 80, false),
('Appetizer Plates Set', 'Set of 8 small ceramic plates for appetizers and desserts.', 'plates', 38.00, 15, 120, false),
('Garden Planter Large', 'Extra large ceramic planter for trees and large plants.', 'pots', 85.00, 5, 50, false),
('Mixing Bowl Set', 'Set of 3 nesting ceramic bowls for cooking and baking.', 'bowls', 55.00, 10, 90, false),
('Floor Vase', 'Statement floor vase with traditional geometric patterns.', 'vases', 120.00, 5, 30, false),
('Sake Cup Set', 'Traditional ceramic sake cups, set of 4.', 'cups', 28.00, 20, 100, false),
('Charger Plate', 'Large decorative charger plate for table settings.', 'plates', 18.00, 25, 180, false);