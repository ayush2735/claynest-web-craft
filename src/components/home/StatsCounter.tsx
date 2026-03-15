import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Package, Truck } from 'lucide-react';

const stats = [
  { icon: Award, label: 'Years Experience', end: 12, suffix: '+' },
  { icon: Users, label: 'Happy Clients', end: 850, suffix: '+' },
  { icon: Package, label: 'Products Crafted', end: 15000, suffix: '+' },
  { icon: Truck, label: 'Orders Delivered', end: 5200, suffix: '+' },
];

const useCountUp = (end: number, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
};

const StatItem = ({ icon: Icon, label, end, suffix, inView }: { icon: any; label: string; end: number; suffix: string; inView: boolean }) => {
  const count = useCountUp(end, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      <p className="font-display text-4xl md:text-5xl font-bold text-foreground">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-muted-foreground mt-2 font-medium">{label}</p>
    </motion.div>
  );
};

const StatsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <StatItem key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
