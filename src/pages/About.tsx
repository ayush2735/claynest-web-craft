import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Leaf, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-ceramics.jpg';

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="About Cermiconest"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <span className="text-primary font-medium tracking-wider uppercase text-sm">
              Our Story
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-cream mt-2 mb-6">
              Crafting Excellence in Clay
            </h1>
            <p className="text-cream/80 text-lg">
               Cermiconest is a premium B2B ceramics supplier dedicated to providing 
               handcrafted, high-quality ceramic products to businesses across India.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                At Cermiconest, we believe that every dining experience deserves exceptional 
                tableware. We partner with skilled artisans to bring you ceramics that 
                combine traditional craftsmanship with contemporary design. Our goal is 
                to help restaurants, hotels, cafes, and retailers create memorable 
                experiences for their customers through beautiful, durable ceramics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Quality First
              </h3>
              <p className="text-muted-foreground text-sm">
                Every piece is inspected to meet our high standards of craftsmanship and durability.
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Artisan Partnership
              </h3>
              <p className="text-muted-foreground text-sm">
                We work directly with skilled craftspeople, supporting traditional pottery communities.
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Sustainability
              </h3>
              <p className="text-muted-foreground text-sm">
                Natural materials and eco-conscious practices guide our production process.
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-lg shadow-soft">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Customer Focus
              </h3>
              <p className="text-muted-foreground text-sm">
                Your success is our priority. We provide dedicated support for every order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Partner with Us?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Whether you're looking for bulk tableware for your restaurant or unique 
            ceramics for your retail store, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/products">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
