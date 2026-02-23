import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnlineUsers } from '@/hooks/useOnlineUsers';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { Users, ShoppingBag, Package, TrendingUp, DollarSign, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

const Analytics = () => {
  const { onlineCount } = useOnlineUsers();

  // Fetch orders stats
  const { data: ordersData } = useQuery({
    queryKey: ['analytics', 'orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('id, total_amount, status, created_at');
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch products stats
  const { data: productsData } = useQuery({
    queryKey: ['analytics', 'products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, category, stock_quantity, price');
      
      if (error) throw error;
      return data;
    },
  });

  // Calculate stats
  const totalOrders = ordersData?.length || 0;
  const totalRevenue = ordersData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0;
  const pendingOrders = ordersData?.filter(o => o.status === 'pending').length || 0;
  const totalProducts = productsData?.length || 0;
  const lowStockProducts = productsData?.filter(p => p.stock_quantity < 100).length || 0;

  // Category breakdown
  const categoryStats = productsData?.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // Recent orders
  const recentOrders = ordersData?.slice(0, 5) || [];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-playfair font-bold text-foreground">Analytics Dashboard</h1>
          <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <Users className="h-4 w-4" />
            <span className="font-medium">{onlineCount} live visitors</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Live Visitors
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{onlineCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingBag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalOrders}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingOrders} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Products
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {lowStockProducts} low stock
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Products by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-primary"></div>
                      <span className="capitalize font-medium">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{count} products</span>
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
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

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No orders yet</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{Number(order.total_amount).toLocaleString()}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
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
