import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Priya Sharma',
    company: 'The Clay Café, Mumbai',
    text: 'Cermiconest has transformed our restaurant aesthetics. The quality of their ceramic plates and cups is outstanding — our customers always compliment the dinnerware.',
    rating: 5,
  },
  {
    name: 'Rahul Verma',
    company: 'Heritage Hotels Group',
    text: 'We ordered 500+ ceramic pieces for our hotel chain and the consistency in quality was remarkable. Their bulk pricing is unbeatable in the market.',
    rating: 5,
  },
  {
    name: 'Anita Desai',
    company: 'Bloom Interiors, Bangalore',
    text: 'The decorative vases and pots from Cermiconest add a touch of artisan elegance to every project. Fast delivery and excellent customer support.',
    rating: 4,
  },
  {
    name: 'Vikram Singh',
    company: 'Spice Route Restaurants',
    text: 'We switched to Cermiconest for all our tableware needs. The handcrafted bowls and plates are durable, beautiful, and perfectly suited for fine dining.',
    rating: 5,
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
            What Our Clients Say
          </h2>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Quote className="absolute -top-4 -left-4 h-16 w-16 text-primary/10 z-0" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl p-8 md:p-12 shadow-medium text-center relative z-10"
            >
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < testimonials[current].rating ? 'text-primary fill-primary' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="text-foreground/80 text-lg md:text-xl leading-relaxed italic mb-8">
                "{testimonials[current].text}"
              </p>
              <div>
                <p className="font-display text-xl font-bold text-foreground">
                  {testimonials[current].name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {testimonials[current].company}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
