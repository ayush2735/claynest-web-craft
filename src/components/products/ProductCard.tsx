import { Link } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { getProductImage } from '@/lib/productImages';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, product.min_order_quantity);
    toast.success(`Added ${product.min_order_quantity} ${product.name} to cart`);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url || getProductImage(product.category)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <span className="text-xs font-medium text-primary uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="font-display text-xl font-semibold mt-1 text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-display font-bold text-foreground">
              ₹{product.price.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground block">
              Min. order: {product.min_order_quantity} units
            </span>
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className="bg-primary hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
