import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Phone } from 'lucide-react';
import heroImage from '@/assets/hero-ceramics.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Claynest Ceramics"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <span className="inline-block text-primary font-medium tracking-wider uppercase text-sm mb-4">
            Premium B2B Ceramics Supplier
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-cream leading-tight mb-6">
            Handcrafted
            <br />
            <span className="text-primary">Ceramic</span> Excellence
          </h1>
          <p className="text-cream/80 text-lg md:text-xl mb-8 max-w-lg">
            Discover our artisan collection of cups, plates, pots, and decorative 
            ceramics. Quality craftsmanship for your business, delivered at scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8"
            >
              <Link to="/products">
                Browse Catalog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-cream/30 text-cream hover:bg-cream/10 font-medium px-8"
            >
              <a href="tel:9369635323">
                <Phone className="mr-2 h-5 w-5" />
                Call for Bulk Orders
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default Hero;
