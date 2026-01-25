import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, Mail } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 bg-charcoal">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-cream mb-4">
          Ready to Order?
        </h2>
        <p className="text-sand max-w-2xl mx-auto mb-8 text-lg">
          Contact us for custom orders, bulk pricing, or to discuss your business needs. 
          Our team is ready to help you find the perfect ceramics for your brand.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="bg-terracotta text-cream hover:bg-cream hover:text-terracotta transition-all duration-300 hover:scale-110 hover:shadow-strong font-medium px-8"
          >
            <Link to="/contact">Get a Quote</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-sage text-sage hover:bg-sage hover:text-charcoal transition-all duration-300 hover:scale-110 hover:shadow-strong font-medium px-8"
          >
            <a href="tel:9369635323">
              <Phone className="mr-2 h-5 w-5" />
              Call Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
