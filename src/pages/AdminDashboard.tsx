import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, SiteSettings } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Package, ShoppingBag, Settings, Users } from 'lucide-react';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '', price: 0, image: '', category: '', stock: 0, rating: 5, reviewsCount: 0, description: ''
  });

  const [activeTab, setActiveTab] = useState('products');
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Zenvy',
    heroBanner: 'https://picsum.photos/seed/zenvy-hero/1920/800',
    contactEmail: 'support@zenvy.com'
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        setProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'products');
      }
      
      try {
        const orderSnap = await getDocs(collection(db, 'orders'));
        setOrders(orderSnap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'orders');
      }

      try {
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as SiteSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
      
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await setDoc(doc(db, 'settings', 'global'), settings);
      toast.success('Settings updated successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/global');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = await addDoc(collection(db, 'products'), newProduct);
      setProducts([...products, { id: docRef.id, ...newProduct } as Product]);
      setNewProduct({ name: '', price: 0, image: '', category: '', stock: 0, rating: 5, reviewsCount: 0, description: '' });
      toast.success('Product added successfully');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `products/${id}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#161616] border-r border-[#333333] p-6 flex flex-col gap-8">
        <div>
          <div className="bg-[rgba(242,125,38,0.1)] text-[#F27D26] px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest w-fit mb-4">
            Staff Dashboard
          </div>
          <div className="text-xl font-black tracking-tighter uppercase mb-8">
            ZENVY<span className="text-[#F27D26]">.</span>
          </div>
          
          <nav className="space-y-1">
            <div 
              onClick={() => setActiveTab('products')}
              className={`text-sm font-bold py-2 border-b border-[#333333] cursor-pointer transition-colors ${activeTab === 'products' ? 'text-[#F27D26]' : 'text-[#A0A0A0] hover:text-white'}`}
            >
              Inventory Manager
            </div>
            <div 
              onClick={() => setActiveTab('orders')}
              className={`text-sm font-bold py-2 border-b border-[#333333] cursor-pointer transition-colors ${activeTab === 'orders' ? 'text-[#F27D26]' : 'text-[#A0A0A0] hover:text-white'}`}
            >
              Order Processing
            </div>
            <div 
              onClick={() => setActiveTab('settings')}
              className={`text-sm font-bold py-2 border-b border-[#333333] cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-[#F27D26]' : 'text-[#A0A0A0] hover:text-white'}`}
            >
              Global Site Settings
            </div>
          </nav>
        </div>

        <div className="mt-auto pt-6 border-t border-[#333333]">
          <div className="text-[10px] text-[#A0A0A0] uppercase font-bold mb-2">Logged in as</div>
          <div className="text-sm font-bold mb-4">raghav</div>
          <Button 
            variant="outline" 
            className="w-full border-[#333333] hover:bg-[#222222] text-xs h-8"
            onClick={() => { localStorage.removeItem('admin_session'); window.location.href = '/admin'; }}
          >
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-[#161616] border border-[#333333] p-1 h-12">
              <TabsTrigger value="products" className="data-[state=active]:bg-[#222222] data-[state=active]:text-[#F27D26] px-6">Products</TabsTrigger>
              <TabsTrigger value="orders" className="data-[state=active]:bg-[#222222] data-[state=active]:text-[#F27D26] px-6">Orders</TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-[#222222] data-[state=active]:text-[#F27D26] px-6">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="bg-[#161616] border-[#333333] lg:col-span-1">
                  <CardHeader><CardTitle className="text-lg font-bold uppercase tracking-tight">Add New Product</CardTitle></CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProduct} className="space-y-4">
                      <Input className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                      <Input className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} required />
                      <Input className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" placeholder="Image URL" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} required />
                      <Input className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
                      <Input className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" type="number" placeholder="Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} required />
                      <Button type="submit" className="w-full bg-[#F27D26] hover:bg-[#d96a1a] text-black font-bold">Add Product</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="bg-[#161616] border-[#333333] lg:col-span-2">
                  <CardHeader><CardTitle className="text-lg font-bold uppercase tracking-tight">Product Inventory</CardTitle></CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-[#333333] hover:bg-transparent">
                          <TableHead className="text-[#A0A0A0]">Image</TableHead>
                          <TableHead className="text-[#A0A0A0]">Name</TableHead>
                          <TableHead className="text-[#A0A0A0]">Price</TableHead>
                          <TableHead className="text-[#A0A0A0]">Stock</TableHead>
                          <TableHead className="text-[#A0A0A0]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map(product => (
                          <TableRow key={product.id} className="border-[#333333] hover:bg-[#222222]/50 transition-colors">
                            <TableCell><img src={product.image} className="w-10 h-10 object-cover rounded bg-[#222222]" referrerPolicy="no-referrer" /></TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-[#F27D26] font-bold">${product.price}</TableCell>
                            <TableCell>{product.stock}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="ghost" size="icon" className="hover:text-[#F27D26]"><Edit size={16} /></Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-500/10" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="bg-[#161616] border-[#333333]">
                <CardHeader><CardTitle className="text-lg font-bold uppercase tracking-tight">Recent Orders</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[#333333] hover:bg-transparent">
                        <TableHead className="text-[#A0A0A0]">Order ID</TableHead>
                        <TableHead className="text-[#A0A0A0]">Customer</TableHead>
                        <TableHead className="text-[#A0A0A0]">Total</TableHead>
                        <TableHead className="text-[#A0A0A0]">Status</TableHead>
                        <TableHead className="text-[#A0A0A0]">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map(order => (
                        <TableRow key={order.id} className="border-[#333333] hover:bg-[#222222]/50 transition-colors">
                          <TableCell className="font-mono text-[10px] text-[#A0A0A0]">{order.id}</TableCell>
                          <TableCell className="text-sm">{order.userId}</TableCell>
                          <TableCell className="text-[#F27D26] font-bold">${order.totalAmount}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'delivered' ? 'bg-green-500/10 text-green-500' : 'bg-[#F27D26]/10 text-[#F27D26]'
                            }`}>
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-[#A0A0A0]">{order.createdAt?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="bg-[#161616] border-[#333333]">
                <CardHeader><CardTitle className="text-lg font-bold uppercase tracking-tight">Website Settings</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Store Name</label>
                      <Input 
                        className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" 
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Contact Email</label>
                      <Input 
                        className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" 
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0]">Hero Banner URL</label>
                      <Input 
                        className="bg-[#0A0A0A] border-[#333333] focus-visible:ring-[#F27D26]" 
                        value={settings.heroBanner}
                        onChange={(e) => setSettings({ ...settings, heroBanner: e.target.value })}
                      />
                    </div>
                  </div>
                  <Button 
                    className="bg-[#F27D26] text-black font-bold hover:bg-[#d96a1a] px-8"
                    onClick={handleSaveSettings}
                    disabled={savingSettings}
                  >
                    {savingSettings ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
