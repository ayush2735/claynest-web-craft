import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Package, Truck, CheckCircle2, Clock, Loader2, MapPin, User, Mail, Phone, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  products: { name: string; image_url: string | null; category: string } | null;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company_name: string | null;
  shipping_address: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'processing', label: 'Processing', icon: Package },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const getStatusIndex = (status: string) => {
  if (status === 'cancelled') return -1;
  const idx = statusSteps.findIndex(s => s.key === status);
  return idx >= 0 ? idx : 0;
};

const paymentMethodLabel = (method: string) => {
  switch (method) {
    case 'upi': return 'UPI Payment';
    case 'bank_transfer': return 'Bank Transfer';
    case 'cod': return 'Cash on Delivery';
    default: return method;
  }
};

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orderId.trim();
    if (!trimmed) {
      toast.error('Please enter an Order ID');
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);
    setOrderItems([]);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', trimmed)
        .maybeSingle();

      if (orderError) throw orderError;

      if (!orderData) {
        toast.error('Order not found. Please check the Order ID.');
        setLoading(false);
        return;
      }

      setOrder(orderData as Order);

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('id, quantity, unit_price, total_price, products(name, image_url, category)')
        .eq('order_id', trimmed);

      if (itemsError) throw itemsError;
      setOrderItems((items as unknown as OrderItem[]) || []);
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? getStatusIndex(order.status) : 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2 text-center">
            Track Your Order
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Enter your Order ID to check the current status of your order
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-12">
            <div className="flex-1">
              <Label htmlFor="orderId" className="sr-only">Order ID</Label>
              <Input
                id="orderId"
                placeholder="Paste your Order ID here..."
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="h-12 text-base"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="h-12">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Search className="h-5 w-5 mr-2" /> Track</>}
            </Button>
          </form>
        </motion.div>

        <AnimatePresence mode="wait">
          {order && (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Status Timeline */}
              <div className="bg-card rounded-lg shadow-soft p-6">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">Order Status</h2>

                {order.status === 'cancelled' ? (
                  <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full font-semibold">
                      ✕ Order Cancelled
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between relative">
                    {/* Progress line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full mx-8" />
                    <div
                      className="absolute top-5 left-0 h-1 bg-primary rounded-full mx-8 transition-all duration-700"
                      style={{ width: `${Math.max(0, currentStep / (statusSteps.length - 1)) * (100 - 8)}%` }}
                    />

                    {statusSteps.map((step, i) => {
                      const Icon = step.icon;
                      const isActive = i <= currentStep;
                      return (
                        <div key={step.key} className="flex flex-col items-center relative z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className={`text-xs mt-2 font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="bg-card rounded-lg shadow-soft p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Customer Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{order.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{order.customer_email}</span>
                    </div>
                    {order.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">{order.customer_phone}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-foreground">{order.shipping_address}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-card rounded-lg shadow-soft p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">Payment Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-foreground">{paymentMethodLabel(order.payment_method)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span className={`font-medium capitalize ${order.payment_status === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                        {order.payment_status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date</span>
                      <span className="text-foreground">{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-foreground text-lg">₹{Number(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-card rounded-lg shadow-soft p-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Items Ordered</h3>
                <div className="space-y-4">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {item.products?.image_url ? (
                          <img src={item.products.image_url} alt={item.products?.name || ''} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{item.products?.name || 'Product'}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} × ₹{Number(item.unit_price).toFixed(2)}
                        </p>
                      </div>
                      <span className="font-semibold text-foreground whitespace-nowrap">
                        ₹{Number(item.total_price).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {order.notes && (
                <div className="bg-card rounded-lg shadow-soft p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">Order Notes</h3>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </motion.div>
          )}

          {searched && !loading && !order && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Order Not Found</h2>
              <p className="text-muted-foreground">Double-check your Order ID and try again.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
};

export default TrackOrder;
