import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.from('newsletter_subscribers').insert({ email });
    setLoading(false);
    if (error) {
      if (error.code === '23505') toast.info('Already subscribed!');
      else toast.error('Something went wrong.');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed!');
  };

  return (
    <footer className="bg-charcoal text-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-display text-3xl font-bold text-cream mb-4">
              Cermico<span className="text-primary">nest</span>
            </h3>
            <p className="text-secondary/70 mb-6">
              Premium handcrafted ceramics for businesses. Artisan-quality cups, plates, pots, and decorative pieces.
            </p>
            <div className="flex flex-col gap-3">
              <a href="tel:9369635323" className="flex items-center gap-2 text-secondary/70 hover:text-cream transition-colors">
                <Phone className="h-4 w-4" />
                <span>9369635323</span>
              </a>
              <a href="mailto:ayushsinghrajput643@gmail.com" className="flex items-center gap-2 text-secondary/70 hover:text-cream transition-colors">
                <Mail className="h-4 w-4" />
                <span>ayushsinghrajput643@gmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-xl font-semibold text-cream mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'All Products', to: '/products' },
                { label: 'Cups', to: '/products?category=cups' },
                { label: 'Plates', to: '/products?category=plates' },
                { label: 'Pots', to: '/products?category=pots' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-secondary/70 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xl font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'View Cart', to: '/cart' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-secondary/70 hover:text-cream transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-display text-xl font-semibold text-cream mb-4">Newsletter</h4>
            <p className="text-secondary/70 mb-4 text-sm">
              Subscribe for new collections & exclusive deals.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-accent">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Subscribed!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="bg-secondary/10 border-secondary/20 text-cream placeholder:text-secondary/40"
                />
                <Button type="submit" size="icon" disabled={loading} className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-secondary/20 mt-12 pt-8 text-center text-secondary/50">
          <p>&copy; {new Date().getFullYear()} Cermiconest. All rights reserved. Premium B2B Ceramics.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
