import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === '23505') {
        toast.info('You are already subscribed!');
      } else {
        toast.error('Something went wrong. Please try again.');
      }
      return;
    }
    setSubscribed(true);
    toast.success('Successfully subscribed!');
  };

  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto text-center"
        >
          <h3 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Stay Updated
          </h3>
          <p className="text-muted-foreground mb-6">
            Get notified about new collections, exclusive offers, and bulk order deals.
          </p>
          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-accent">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Thank you for subscribing!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1"
              />
              <Button type="submit" disabled={loading} className="px-6">
                <Send className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
