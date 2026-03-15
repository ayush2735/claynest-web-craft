import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, ArrowLeft, Package, Truck, Shield, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { getProductImage } from '@/lib/productImages';
import ImageLightbox from '@/components/products/ImageLightbox';
import ReviewSection from '@/components/products/ReviewSection';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id!);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    const orderQty = quantity || product.min_order_quantity;
    if (orderQty < product.min_order_quantity) {
      toast.error(`Minimum order quantity is ${product.min_order_quantity} units`);
      return;
    }
    addToCart(product, orderQty);
    toast.success(`Added ${orderQty} ${product.name} to cart`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button asChild className="mt-4">
            <Link to="/products">Back to Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const inWishlist = isInWishlist(product.id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Link
          to="/products"
          className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image with Lightbox */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ImageLightbox
              src={product.image_url || getProductImage(product.category)}
              alt={product.name}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="inline-block text-primary font-medium tracking-wider uppercase text-sm mb-2">
              {product.category}
            </span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              {product.name}
            </h1>
            <p className="text-muted-foreground text-lg mb-6">
              {product.description}
            </p>

            <div className="border-t border-b border-border py-6 mb-6">
              <div className="flex items-baseline gap-4 mb-4">
                <span className="text-4xl font-display font-bold text-foreground">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-muted-foreground">per unit</span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Minimum order: {product.min_order_quantity} units
                </span>
                <span className="flex items-center gap-2">
                  <span className={product.stock_quantity > 0 ? 'text-accent' : 'text-destructive'}>
                    {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
                  </span>
                </span>
              </div>
            </div>

            {/* Add to Cart & Wishlist */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground">Quantity:</label>
                <Input
                  type="number"
                  min={product.min_order_quantity}
                  value={quantity || ''}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  placeholder={product.min_order_quantity.toString()}
                  className="w-32"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 md:flex-none bg-primary hover:bg-primary/90 font-medium px-12"
                  disabled={product.stock_quantity === 0}
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  onClick={() => toggleWishlist.mutate(product.id)}
                  size="lg"
                  variant="outline"
                  className={inWishlist ? 'text-destructive border-destructive/30' : ''}
                >
                  <Heart className={`h-5 w-5 ${inWishlist ? 'fill-destructive' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Fast Shipping</p>
                    <p className="text-sm text-muted-foreground">Secure delivery across India</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Quality Guaranteed</p>
                    <p className="text-sm text-muted-foreground">Handcrafted excellence</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={product.id} />
      </div>
    </Layout>
  );
};

export default ProductDetail;
