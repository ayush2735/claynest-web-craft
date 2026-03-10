import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Users, ShoppingBag, Package, TrendingUp, DollarSign, Shield, Pencil, ExternalLink } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const Analytics = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const { onlineCount } = useOnlineUsers();

  const { data: ordersData } = useQuery({
    queryKey: ['analytics', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at, customer_name')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['analytics', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, stock_quantity, price, image_url');
      if (error) throw error;
      return data;
    },
  });

  // Fetch order items with product names for recent orders
  const recentOrderIds = ordersData?.slice(0, 5).map(o => o.id) || [];
  const { data: recentOrderItems } = useQuery({
    queryKey: ['analytics', 'recent-order-items', recentOrderIds],
    queryFn: async () => {
      if (recentOrderIds.length === 0) return [];
      const { data, error } = await supabase
        .from('order_items')
        .select('order_id, quantity, unit_price, total_price, product_id')
        .in('order_id', recentOrderIds);
      if (error) throw error;
      return data;
    },
    enabled: recentOrderIds.length > 0,
  });

  // Build product name map
  const productNameMap = productsData?.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {} as Record<string, string>) || {};

  const productImageMap = productsData?.reduce((acc, p) => {
    acc[p.id] = p.image_url;
    return acc;
  }, {} as Record<string, string | null>) || {};

  // Group order items by order_id
  const orderItemsMap = recentOrderItems?.reduce((acc, item) => {
    if (!acc[item.order_id]) acc[item.order_id] = [];
    acc[item.order_id].push(item);
    return acc;
  }, {} as Record<string, typeof recentOrderItems>) || {};

  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0;
  const totalProducts = productsData?.length || 0;
  const lowStockProducts = productsData?.filter(p => p.stock_quantity < 100).length || 0;

  const categoryStats = productsData?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const recentOrders = ordersData?.slice(0, 5) || [];

  if (authLoading || roleLoading) {
    return <Layout><div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Loading...</div></Layout>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Access Denied</h1>
          <p className="text-muted-foreground">Admin privileges required.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Analytics Dashboard</h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-3 py-1.5 rounded-full text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <Users className="h-3.5 w-3.5" />
              <span className="font-medium">{onlineCount} live</span>
            </div>
            <Link to="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Edit Dashboard</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Live Visitors</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{onlineCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">{pendingOrders} pending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-xl sm:text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 sm:p-6 sm:pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Products</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="text-2xl sm:text-3xl font-bold text-foreground">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">{lowStockProducts} low stock</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
                Products by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary flex-shrink-0"></div>
                      <span className="capitalize font-medium text-sm sm:text-base truncate">{category}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-muted-foreground text-xs sm:text-sm">{count}</span>
                      <div className="w-16 sm:w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(count / totalProducts) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders with Item Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Recent Orders
              </CardTitle>
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="gap-1 text-xs">
                  <ExternalLink className="h-3 w-3" /> View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => {
                    const items = orderItemsMap[order.id] || [];
                    return (
                      <div key={order.id} className="border border-border rounded-lg p-3 sm:p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{order.customer_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()} • #{order.id.slice(0, 8)}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-bold text-sm">₹{Number(order.total_amount).toLocaleString()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              order.status === 'delivered' ? 'bg-blue-100 text-blue-700' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        {/* Order Items */}
                        {items.length > 0 && (
                          <div className="bg-muted/50 rounded p-2 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Items ordered:</p>
                            {items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs">
                                {productImageMap[item.product_id] ? (
                                  <img src={productImageMap[item.product_id]!} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                                ) : (
                                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                  </div>
                                )}
                                <span className="truncate mr-2">
                                  {productNameMap[item.product_id] || 'Unknown Product'} × {item.quantity}
                                </span>
                                <span className="flex-shrink-0 font-medium ml-auto">₹{Number(item.total_price).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
