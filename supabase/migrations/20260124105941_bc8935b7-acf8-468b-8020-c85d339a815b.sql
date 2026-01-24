-- Create profiles table for B2B customer data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT,
  contact_person TEXT,
  phone TEXT,
  shipping_address TEXT,
  billing_address TEXT,
  gst_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can create own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update product prices to realistic B2B wholesale rates (in INR)
UPDATE public.products SET price = 85 WHERE name = 'Artisan Ceramic Cup';
UPDATE public.products SET price = 120 WHERE name = 'Classic White Cup';
UPDATE public.products SET price = 95 WHERE name = 'Rustic Brown Cup';
UPDATE public.products SET price = 180 WHERE name = 'Dinner Plate Set';
UPDATE public.products SET price = 220 WHERE name = 'Decorative Plate';
UPDATE public.products SET price = 145 WHERE name = 'Serving Plate';
UPDATE public.products SET price = 350 WHERE name = 'Terracotta Pot';
UPDATE public.products SET price = 280 WHERE name = 'Glazed Ceramic Pot';
UPDATE public.products SET price = 420 WHERE name = 'Large Garden Pot';
UPDATE public.products SET price = 165 WHERE name = 'Mixing Bowl Set';
UPDATE public.products SET price = 195 WHERE name = 'Decorative Vase';
UPDATE public.products SET price = 240 WHERE name = 'Tall Flower Vase';

-- Add more products to expand catalog
INSERT INTO public.products (name, description, category, price, min_order_quantity, stock_quantity, is_featured, image_url) VALUES
-- More Cups
('Espresso Cup Set', 'Small 60ml espresso cups with saucers, perfect for cafes and restaurants', 'cups', 75, 50, 2000, false, null),
('Tea Cup Traditional', 'Traditional Indian chai cups with gold rim detailing', 'cups', 55, 100, 3000, false, null),
('Cappuccino Cup', 'Wide-mouth cappuccino cups, ideal for latte art', 'cups', 110, 30, 1500, true, null),
('Ceramic Mug Large', '350ml large ceramic mugs with comfortable handle', 'cups', 135, 25, 1200, false, null),

-- More Plates
('Side Plate Small', '6-inch side plates for appetizers and desserts', 'plates', 95, 50, 2500, false, null),
('Charger Plate Gold', 'Large 12-inch charger plates with gold accent', 'plates', 380, 20, 600, true, null),
('Soup Plate Deep', 'Deep soup plates with wide rim for elegant presentation', 'plates', 165, 40, 1800, false, null),
('Oval Serving Platter', 'Large oval platters for family-style dining', 'plates', 450, 15, 400, false, null),

-- More Pots
('Mini Succulent Pot', 'Small 3-inch pots perfect for succulents', 'pots', 45, 100, 5000, false, null),
('Medium Planter', 'Versatile 6-inch planters with drainage holes', 'pots', 180, 30, 1200, false, null),
('Hanging Pot Set', 'Set of hanging planters with macrame rope', 'pots', 320, 20, 500, true, null),
('Bonsai Pot Premium', 'Traditional bonsai pots with Japanese design', 'pots', 550, 10, 200, false, null),

-- More Bowls
('Soup Bowl Classic', 'Classic round soup bowls with handles', 'bowls', 125, 40, 1500, false, null),
('Salad Bowl Large', 'Large salad serving bowls for restaurants', 'bowls', 280, 20, 800, false, null),
('Rice Bowl Set', 'Traditional rice bowls, set of 6 pieces', 'bowls', 210, 30, 1000, true, null),
('Dip Bowl Small', 'Small dip and sauce bowls for condiments', 'bowls', 35, 100, 4000, false, null),

-- More Vases
('Bud Vase Mini', 'Single stem bud vases for table decor', 'vases', 85, 50, 2000, false, null),
('Floor Vase XL', 'Extra large floor vases, 24-inch height', 'vases', 1200, 5, 100, true, null),
('Cylindrical Vase', 'Modern cylindrical vases in matte finish', 'vases', 295, 20, 600, false, null),
('Vintage Style Vase', 'Antique-finish vases with crackle glaze', 'vases', 380, 15, 400, false, null),

-- Other ceramic items
('Candle Holder Set', 'Ceramic candle holders, set of 3 sizes', 'other', 175, 30, 900, false, null),
('Soap Dispenser', 'Bathroom ceramic soap dispensers', 'other', 145, 40, 1200, false, null),
('Coaster Set', 'Round ceramic coasters with cork backing, set of 4', 'other', 120, 50, 1500, true, null),
('Butter Dish', 'Classic butter dishes with lid', 'other', 165, 30, 800, false, null),
('Salt & Pepper Set', 'Matching salt and pepper shakers', 'other', 95, 50, 1400, false, null),
('Oil & Vinegar Set', 'Ceramic oil and vinegar dispensers', 'other', 220, 25, 600, false, null),
('Utensil Holder', 'Kitchen utensil holders with drainage', 'other', 185, 30, 700, false, null),
('Napkin Holder', 'Elegant ceramic napkin holders', 'other', 135, 40, 900, false, null);