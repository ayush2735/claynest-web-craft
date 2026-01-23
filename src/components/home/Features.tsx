import { Truck, Shield, Package, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Package,
    title: 'Bulk Orders',
    description: 'Competitive pricing for wholesale and bulk purchases',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Reliable delivery across India with secure packaging',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Each piece handcrafted with premium materials',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: 'Personal account manager for B2B clients',
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
