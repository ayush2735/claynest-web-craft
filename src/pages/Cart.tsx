import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { getProductImage } from '@/lib/productImages';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-8">
            Start browsing our collection to add products to your cart.
          </p>
          <Button asChild size="lg">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-display text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-6 p-6 bg-card rounded-lg shadow-soft"
              >
                <Link
                  to={`/products/${item.product.id}`}
                  className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                >
                  <img
                    src={item.product.image_url || getProductImage(item.product.category)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1">
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-display text-xl font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">
                    ₹{item.product.price.toFixed(2)} per unit
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Min. order: {item.product.min_order_quantity} units
                  </p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            Math.max(item.product.min_order_quantity, item.quantity - 1)
                          )
                        }
                        className="h-8 w-8"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(
                            item.product.id,
                            Math.max(item.product.min_order_quantity, parseInt(e.target.value) || 0)
                          )
                        }
                        className="w-16 h-8 text-center border-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-display text-xl font-bold text-foreground">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card rounded-lg shadow-soft p-6 sticky top-32">
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items ({totalItems})</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-display text-xl font-bold text-foreground">
                    Total
                  </span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90">
                <Link to="/checkout">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure payment processing. Free shipping on orders over ₹10,000.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
