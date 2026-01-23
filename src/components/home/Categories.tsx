import { Link } from 'react-router-dom';
import productCup from '@/assets/product-cup.jpg';
import productPlate from '@/assets/product-plate.jpg';
import productPot from '@/assets/product-pot.jpg';
import productBowl from '@/assets/product-bowl.jpg';
import productVase from '@/assets/product-vase.jpg';

const categories = [
  { name: 'Cups', slug: 'cups', image: productCup },
  { name: 'Plates', slug: 'plates', image: productPlate },
  { name: 'Pots', slug: 'pots', image: productPot },
  { name: 'Bowls', slug: 'bowls', image: productBowl },
  { name: 'Vases', slug: 'vases', image: productVase },
];

const Categories = () => {
  return (
    <section className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-medium tracking-wider uppercase text-sm">
            Categories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-2">
            Shop by Category
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.slug}`}
              className="group relative aspect-square rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
            >
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-xl font-semibold text-cream text-center">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
