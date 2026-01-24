-- Enable realtime for presence tracking
-- Create a simple visitor_stats table for tracking
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable RLS
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can view stats
CREATE POLICY "Anyone can view stats"
ON public.visitor_stats FOR SELECT
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_visitor_stats_updated_at
BEFORE UPDATE ON public.visitor_stats
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();