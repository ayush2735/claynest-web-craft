import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

export const useReviews = (productId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Review[];
    },
    enabled: !!productId,
  });

  const addReview = useMutation({
    mutationFn: async ({ rating, comment, reviewerName }: { rating: number; comment: string; reviewerName: string }) => {
      if (!user) throw new Error('Login required');
      const { error } = await supabase.from('reviews').insert({
        product_id: productId,
        user_id: user.id,
        reviewer_name: reviewerName,
        rating,
        comment,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      toast.success('Review submitted!');
    },
    onError: (error: Error) => {
      if (error.message === 'Login required') {
        toast.error('Please login to submit a review');
      } else {
        toast.error('Failed to submit review');
      }
    },
  });

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return { reviews, isLoading, addReview, averageRating };
};
