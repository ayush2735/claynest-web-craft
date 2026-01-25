-- Fix orders table RLS - restrict to customer's own orders by email
DROP POLICY IF EXISTS "Orders viewable by customer email" ON public.orders;
CREATE POLICY "Orders viewable by customer email" 
ON public.orders 
FOR SELECT 
USING (customer_email = coalesce(auth.jwt() ->> 'email', ''));

-- Fix order_items table RLS - restrict to items belonging to customer's orders
DROP POLICY IF EXISTS "Order items are viewable" ON public.order_items;
CREATE POLICY "Order items viewable by order owner" 
ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND orders.customer_email = coalesce(auth.jwt() ->> 'email', '')
  )
);