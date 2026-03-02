import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { useUserRole } from '@/hooks/useUserRole';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import {
  Pencil, Trash2, Plus, Package, ShoppingBag, MessageSquare, Shield,
  Upload, Image, Search, IndianRupee, Eye, BarChart3, Users, AlertTriangle, LogOut
} from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';

const categories = ['cups', 'plates', 'pots', 'bowls', 'vases', 'tiles', 'decorative', 'other'];

const emptyProduct = {
  name: '', description: '', category: 'cups', price: 0,
  min_order_quantity: 10, stock_quantity: 0, is_featured: false, image_url: '',
};

const AdminDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState(emptyProduct);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiryFilter, setInquiryFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: inquiries } = useQuery({
    queryKey: ['admin-inquiries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: orderItems } = useQuery({
    queryKey: ['admin-order-items', selectedOrder?.id],
    queryFn: async () => {
      if (!selectedOrder) return [];
      const { data, error } = await supabase.from('order_items').select('*').eq('order_id', selectedOrder.id);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedOrder,
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setProductForm(p => ({ ...p, image_url: publicUrl }));
      toast({ title: 'Image uploaded successfully' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = useMutation({
    mutationFn: async (product: typeof productForm & { id?: string }) => {
      const payload = {
        name: product.name, description: product.description || null,
        category: product.category, price: product.price,
        min_order_quantity: product.min_order_quantity, stock_quantity: product.stock_quantity,
        is_featured: product.is_featured, image_url: product.image_url || null,
      };
      if (product.id) {
        const { error } = await supabase.from('products').update(payload).eq('id', product.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: editingProduct ? 'Product updated' : 'Product added' });
      setDialogOpen(false);
      setEditingProduct(null);
      setProductForm(emptyProduct);
    },
    onError: (err: any) => toast({ title: 'Error', description: err.message, variant: 'destructive' }),
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'Product deleted' });
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Order status updated' });
    },
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, payment_status }: { id: string; payment_status: string }) => {
      const { error } = await supabase.from('orders').update({ payment_status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast({ title: 'Payment status updated' });
    },
  });

  const updateInquiryStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('inquiries').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-inquiries'] });
      toast({ title: 'Inquiry status updated' });
    },
  });

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
          <p className="text-muted-foreground">You need admin privileges to access this page.</p>
        </div>
      </Layout>
    );
  }

  const openEdit = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name, description: product.description || '',
      category: product.category, price: product.price,
      min_order_quantity: product.min_order_quantity, stock_quantity: product.stock_quantity,
      is_featured: product.is_featured ?? false, image_url: product.image_url || '',
    });
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingProduct(null);
    setProductForm(emptyProduct);
    setDialogOpen(true);
  };

  const filteredProducts = products?.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const filteredInquiries = inquiries?.filter(inq =>
    inquiryFilter === 'all' || inq.status === inquiryFilter
  );

  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
  const pendingOrders = orders?.filter(o => o.status === 'pending').length || 0;
  const lowStockProducts = products?.filter(p => p.stock_quantity < 50).length || 0;
  const newInquiries = inquiries?.filter(i => i.status === 'new').length || 0;

  const handleAdminLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Admin Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/analytics')} className="gap-2">
              <BarChart3 className="h-4 w-4" />Analytics
            </Button>
            <Button variant="destructive" size="sm" onClick={handleAdminLogout} className="gap-2">
              <LogOut className="h-4 w-4" />Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{products?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Products</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <ShoppingBag className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{orders?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <IndianRupee className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Package className="h-6 w-6 mx-auto mb-2 text-destructive" />
              <div className="text-2xl font-bold text-destructive">{lowStockProducts}</div>
              <p className="text-xs text-muted-foreground">Low Stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-foreground">{newInquiries}</div>
              <p className="text-xs text-muted-foreground">New Inquiries</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products" className="gap-2"><Package className="h-4 w-4" />Products</TabsTrigger>
            <TabsTrigger value="orders" className="gap-2"><ShoppingBag className="h-4 w-4" />Orders</TabsTrigger>
            <TabsTrigger value="inquiries" className="gap-2"><MessageSquare className="h-4 w-4" />Inquiries</TabsTrigger>
          </TabsList>

          {/* PRODUCTS TAB */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <CardTitle>Manage Products</CardTitle>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-9 w-[180px]" />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button onClick={openAdd} className="gap-2"><Plus className="h-4 w-4" />Add Product</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Min Qty</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts?.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell>
                            {p.image_url ? (
                              <img src={p.image_url} alt={p.name} className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                                <Image className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell><Badge variant="secondary" className="capitalize">{p.category}</Badge></TableCell>
                          <TableCell>₹{Number(p.price).toLocaleString()}</TableCell>
                          <TableCell>
                            <span className={p.stock_quantity < 50 ? 'text-destructive font-semibold' : ''}>
                              {p.stock_quantity}
                            </span>
                          </TableCell>
                          <TableCell>{p.min_order_quantity}</TableCell>
                          <TableCell>{p.is_featured ? '⭐' : '—'}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { if (confirm('Delete this product?')) deleteProduct.mutate(p.id); }}><Trash2 className="h-4 w-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!filteredProducts || filteredProducts.length === 0) && (
                        <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No products found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders">
            <Card>
              <CardHeader><CardTitle>Manage Orders</CardTitle></CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-xs">{o.id.slice(0, 8)}...</TableCell>
                          <TableCell>
                            <div>{o.customer_name}</div>
                            <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                          </TableCell>
                          <TableCell>₹{Number(o.total_amount).toLocaleString()}</TableCell>
                          <TableCell>
                            <Select defaultValue={o.status} onValueChange={(v) => updateOrderStatus.mutate({ id: o.id, status: v })}>
                              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={o.payment_status} onValueChange={(v) => updatePaymentStatus.mutate({ id: o.id, payment_status: v })}>
                              <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['pending', 'paid', 'refunded', 'failed'].map(s => (
                                  <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-sm">{new Date(o.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedOrder(o); setOrderDetailOpen(true); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!orders || orders.length === 0) && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No orders yet</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* INQUIRIES TAB */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <CardTitle>Customer Inquiries</CardTitle>
                <Select value={inquiryFilter} onValueChange={setInquiryFilter}>
                  <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Update</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInquiries?.map((inq) => (
                        <TableRow key={inq.id}>
                          <TableCell className="font-medium">{inq.name}</TableCell>
                          <TableCell>{inq.email}</TableCell>
                          <TableCell>{inq.company_name || '—'}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{inq.message}</TableCell>
                          <TableCell className="text-sm">{new Date(inq.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Badge variant={inq.status === 'new' ? 'destructive' : inq.status === 'resolved' ? 'default' : 'secondary'}>
                              {inq.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select defaultValue={inq.status} onValueChange={(v) => updateInquiryStatus.mutate({ id: inq.id, status: v })}>
                              <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                {['new', 'in_progress', 'resolved'].map(s => (
                                  <SelectItem key={s} value={s} className="capitalize">{s.replace('_', ' ')}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!filteredInquiries || filteredInquiries.length === 0) && (
                        <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No inquiries found</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Product Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                {editingProduct ? 'Update product details, image, and inventory.' : 'Fill in the details to add a new product.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveProduct.mutate(editingProduct ? { ...productForm, id: editingProduct.id } : productForm); }} className="space-y-4">
              <Input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm(p => ({ ...p, name: e.target.value }))} required />
              <Textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm(p => ({ ...p, description: e.target.value }))} rows={3} />
              <div className="grid grid-cols-2 gap-4">
                <Select value={productForm.category} onValueChange={(v) => setProductForm(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="number" placeholder="Price (₹)" value={productForm.price || ''} onChange={(e) => setProductForm(p => ({ ...p, price: Number(e.target.value) }))} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input type="number" placeholder="Min order qty" value={productForm.min_order_quantity || ''} onChange={(e) => setProductForm(p => ({ ...p, min_order_quantity: Number(e.target.value) }))} />
                <Input type="number" placeholder="Stock qty" value={productForm.stock_quantity || ''} onChange={(e) => setProductForm(p => ({ ...p, stock_quantity: Number(e.target.value) }))} />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Image</label>
                {productForm.image_url && (
                  <div className="relative w-full h-40 rounded-lg overflow-hidden bg-muted">
                    <img src={productForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                    <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => setProductForm(p => ({ ...p, image_url: '' }))}>
                      Remove
                    </Button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
                  <Button type="button" variant="outline" className="gap-2 flex-1" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                </div>
                <Input placeholder="Or paste image URL" value={productForm.image_url} onChange={(e) => setProductForm(p => ({ ...p, image_url: e.target.value }))} />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={productForm.is_featured} onChange={(e) => setProductForm(p => ({ ...p, is_featured: e.target.checked }))} className="rounded" />
                <span className="text-sm">Featured product</span>
              </label>
              <Button type="submit" className="w-full" disabled={saveProduct.isPending}>
                {saveProduct.isPending ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Order Detail Dialog */}
        <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>Order #{selectedOrder?.id.slice(0, 8)}</DialogDescription>
            </DialogHeader>
            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Customer</p>
                    <p className="font-medium">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedOrder.customer_email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedOrder.customer_phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-medium">{selectedOrder.company_name || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Shipping Address</p>
                    <p className="font-medium">{selectedOrder.shipping_address}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-primary">₹{Number(selectedOrder.total_amount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm bg-muted p-3 rounded">{selectedOrder.notes}</p>
                  </div>
                )}
                {orderItems && orderItems.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Order Items</p>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product ID</TableHead>
                          <TableHead>Qty</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono text-xs">{item.product_id.slice(0, 8)}...</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>₹{Number(item.unit_price).toLocaleString()}</TableCell>
                            <TableCell>₹{Number(item.total_price).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
