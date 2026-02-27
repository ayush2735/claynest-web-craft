import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-charcoal text-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-display text-3xl font-bold text-cream mb-4">
              Cermico<span className="text-primary">nest</span>
            </h3>
            <p className="text-secondary/70 max-w-md mb-6">
              Premium handcrafted ceramics for businesses. We specialize in bulk orders 
              of artisan-quality cups, plates, pots, and decorative pieces.
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
              <li>
                <Link to="/products" className="text-secondary/70 hover:text-cream transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=cups" className="text-secondary/70 hover:text-cream transition-colors">
                  Cups
                </Link>
              </li>
              <li>
                <Link to="/products?category=plates" className="text-secondary/70 hover:text-cream transition-colors">
                  Plates
                </Link>
              </li>
              <li>
                <Link to="/products?category=pots" className="text-secondary/70 hover:text-cream transition-colors">
                  Pots
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-xl font-semibold text-cream mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-secondary/70 hover:text-cream transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-secondary/70 hover:text-cream transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-secondary/70 hover:text-cream transition-colors">
                  View Cart
                </Link>
              </li>
            </ul>
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
