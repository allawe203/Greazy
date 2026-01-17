import { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase, type Category, type MenuItem, type ContactInfo } from '@/lib/supabase';
import { queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  LayoutDashboard,
  Grid3X3,
  UtensilsCrossed,
  Phone,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  AlertTriangle,
  Save,
  ImageIcon,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type AdminTab = 'overview' | 'categories' | 'menu-items' | 'contact';

const defaultContact: ContactInfo = {
  id: 1,
  phone: '+966501234567',
  email: 'info@greazy.com',
  address: 'King Fahd Road, Riyadh, Saudi Arabia',
  opening_hours: 'Daily 11:00 AM - 11:00 PM',
  whatsapp: '+966501234567',
  instagram_url: 'https://instagram.com/greazy',
  facebook_url: 'https://facebook.com/greazy',
  twitter_url: 'https://twitter.com/greazy',
};

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { toast } = useToast();

  useEffect(() => {
    const session = localStorage.getItem('greazy_admin_session');
    if (!session) {
      setLocation('/admin');
      return;
    }
    try {
      const { authenticated, expiry } = JSON.parse(session);
      if (!authenticated || Date.now() > expiry) {
        localStorage.removeItem('greazy_admin_session');
        setLocation('/admin');
      }
    } catch {
      setLocation('/admin');
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem('greazy_admin_session');
    setLocation('/admin');
  };

  const tabs = [
    { id: 'overview' as AdminTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'categories' as AdminTab, label: 'Categories', icon: Grid3X3 },
    { id: 'menu-items' as AdminTab, label: 'Menu Items', icon: UtensilsCrossed },
    { id: 'contact' as AdminTab, label: 'Contact Info', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#222222] flex">
      <aside className="w-64 bg-[#1a1a1a] border-r border-[#3e3e3e] flex flex-col">
        <div className="p-6 border-b border-[#3e3e3e]">
          <Link href="/">
            <span className="text-2xl font-black text-[#f36e27]">GREAZY</span>
          </Link>
          <p className="text-sm text-[#606161] mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              data-testid={`admin-tab-${tab.id}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#f36e27] text-white'
                  : 'text-[#f5e6c7] hover:bg-[#2e2e2e]'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#3e3e3e]">
          <Button
            onClick={handleLogout}
            variant="ghost"
            data-testid="admin-logout"
            className="w-full justify-start text-[#f5e6c7] hover:text-[#f36e27] hover:bg-[#2e2e2e]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'categories' && <CategoriesTab toast={toast} />}
        {activeTab === 'menu-items' && <MenuItemsTab toast={toast} />}
        {activeTab === 'contact' && <ContactTab toast={toast} />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const { data: categories } = useQuery({
    queryKey: ['/admin/categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*');
      return data || [];
    },
  });

  const { data: menuItems } = useQuery({
    queryKey: ['/admin/menu-items'],
    queryFn: async () => {
      const { data } = await supabase.from('menu_items').select('*');
      return data || [];
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#f5e6c7] mb-8">Dashboard Overview</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#f36e27]/10">
              <Grid3X3 className="w-8 h-8 text-[#f36e27]" />
            </div>
            <div>
              <p className="text-sm text-[#606161]">Categories</p>
              <p className="text-3xl font-bold text-[#f5e6c7]">{categories?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#f36e27]/10">
              <UtensilsCrossed className="w-8 h-8 text-[#f36e27]" />
            </div>
            <div>
              <p className="text-sm text-[#606161]">Menu Items</p>
              <p className="text-3xl font-bold text-[#f5e6c7]">{menuItems?.length || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-green-500/10">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">ON</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-[#606161]">Status</p>
              <p className="text-xl font-bold text-green-500">Online</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
        <h2 className="text-xl font-bold text-[#f5e6c7] mb-4">Database Setup</h2>
        <p className="text-[#f5e6c7]/80 mb-4">
          If you haven't set up the database tables yet, please run the following SQL in your Supabase SQL Editor:
        </p>
        <pre className="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto text-sm text-[#f5e6c7]/80 border border-[#3e3e3e]">
{`-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact info table
CREATE TABLE IF NOT EXISTS contact_info (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(50),
  email VARCHAR(255),
  address TEXT,
  opening_hours TEXT,
  whatsapp VARCHAR(50),
  instagram_url TEXT,
  facebook_url TEXT,
  twitter_url TEXT
);

-- Gallery images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  title VARCHAR(255),
  order_index INTEGER DEFAULT 0
);

-- Insert default contact info
INSERT INTO contact_info (phone, email, address, opening_hours, whatsapp, instagram_url, facebook_url, twitter_url)
VALUES ('+966501234567', 'info@greazy.com', 'King Fahd Road, Riyadh, Saudi Arabia', 'Daily 11:00 AM - 11:00 PM', '+966501234567', 'https://instagram.com/greazy', 'https://facebook.com/greazy', 'https://twitter.com/greazy')
ON CONFLICT DO NOTHING;`}
        </pre>
      </Card>
    </div>
  );
}

function CategoriesTab({ toast }: { toast: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', image_url: '' });

  const { data: categories, isLoading } = useQuery({
    queryKey: ['/admin/categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('id');
      if (error) throw error;
      return data as Category[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: { name: string; image_url: string; id?: number }) => {
      if (data.id) {
        const { error } = await supabase.from('categories').update({ name: data.name, image_url: data.image_url }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('categories').insert({ name: data.name, image_url: data.image_url });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', image_url: '' });
      toast({ title: 'Success', description: 'Category saved successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/categories'] });
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setDeleteCategory(null);
      toast({ title: 'Success', description: 'Category deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete category', variant: 'destructive' });
    },
  });

  const openAddDialog = () => {
    setEditingCategory(null);
    setFormData({ name: '', image_url: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image_url: category.image_url });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingCategory?.id });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#f5e6c7]">Manage Categories</h1>
        <Button onClick={openAddDialog} data-testid="add-category-button" className="bg-[#f36e27] hover:bg-[#e05d1a]">
          <Plus className="w-5 h-5 mr-2" /> Add Category
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 text-[#f36e27] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#2e2e2e] rounded-lg border border-[#3e3e3e] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3e3e3e]">
                <th className="text-left p-4 text-[#606161] font-medium">Image</th>
                <th className="text-left p-4 text-[#606161] font-medium">Name</th>
                <th className="text-right p-4 text-[#606161] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories?.map((category) => (
                <tr key={category.id} className="border-b border-[#3e3e3e] last:border-0" data-testid={`category-row-${category.id}`}>
                  <td className="p-4">
                    {category.image_url ? (
                      <img src={category.image_url} alt={category.name} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-[#3e3e3e] rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#606161]" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[#f5e6c7] font-medium">{category.name}</td>
                  <td className="p-4 text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(category)} className="text-[#f5e6c7] hover:text-[#f36e27]">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteCategory(category)} className="text-[#f5e6c7] hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(!categories || categories.length === 0) && (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-[#606161]">No categories yet. Add your first category!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
          <DialogHeader>
            <DialogTitle className="text-[#f5e6c7]">{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#606161] mb-2">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Category name" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" required />
            </div>
            <div>
              <label className="block text-sm text-[#606161] mb-2">Image URL</label>
              <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[#f5e6c7]">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="bg-[#f36e27] hover:bg-[#e05d1a]">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCategory} onOpenChange={() => setDeleteCategory(null)}>
        <AlertDialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5e6c7]">Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-[#606161]">
              Are you sure you want to delete "{deleteCategory?.name}"? This will also delete all menu items in this category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#3e3e3e] text-[#f5e6c7] border-[#3e3e3e] hover:bg-[#4e4e4e]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteCategory && deleteMutation.mutate(deleteCategory.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function MenuItemsTab({ toast }: { toast: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<MenuItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image_url: '', category_id: '' });

  const { data: categories } = useQuery({
    queryKey: ['/admin/categories'],
    queryFn: async () => {
      const { data } = await supabase.from('categories').select('*').order('id');
      return data as Category[];
    },
  });

  const { data: menuItems, isLoading } = useQuery({
    queryKey: ['/admin/menu-items'],
    queryFn: async () => {
      const { data } = await supabase.from('menu_items').select('*').order('id');
      return data as MenuItem[];
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (data.id) {
        const { error } = await supabase.from('menu_items').update({ name: data.name, description: data.description, price: parseFloat(data.price), image_url: data.image_url, category_id: parseInt(data.category_id) }).eq('id', data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('menu_items').insert({ name: data.name, description: data.description, price: parseFloat(data.price), image_url: data.image_url, category_id: parseInt(data.category_id) });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/menu-items'] });
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', image_url: '', category_id: '' });
      toast({ title: 'Success', description: 'Menu item saved successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save menu item', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/menu-items'] });
      setDeleteItem(null);
      toast({ title: 'Success', description: 'Menu item deleted' });
    },
  });

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category_id: categories?.[0]?.id.toString() || '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, description: item.description, price: item.price.toString(), image_url: item.image_url, category_id: item.category_id.toString() });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingItem?.id });
  };

  const filteredItems = menuItems?.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.category_id.toString() === filterCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryName = (categoryId: number) => categories?.find((c) => c.id === categoryId)?.name || 'Unknown';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#f5e6c7]">Manage Menu Items</h1>
        <Button onClick={openAddDialog} data-testid="add-menu-item-button" className="bg-[#f36e27] hover:bg-[#e05d1a]">
          <Plus className="w-5 h-5 mr-2" /> Add Item
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search items..." className="max-w-xs bg-[#2e2e2e] border-[#3e3e3e] text-[#f5e6c7]" />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48 bg-[#2e2e2e] border-[#3e3e3e] text-[#f5e6c7]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#2e2e2e] border-[#3e3e3e]">
            <SelectItem value="all" className="text-[#f5e6c7]">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()} className="text-[#f5e6c7]">{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-10 h-10 text-[#f36e27] animate-spin" />
        </div>
      ) : (
        <div className="bg-[#2e2e2e] rounded-lg border border-[#3e3e3e] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#3e3e3e]">
                <th className="text-left p-4 text-[#606161] font-medium">Image</th>
                <th className="text-left p-4 text-[#606161] font-medium">Name</th>
                <th className="text-left p-4 text-[#606161] font-medium">Category</th>
                <th className="text-left p-4 text-[#606161] font-medium">Price</th>
                <th className="text-right p-4 text-[#606161] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems?.map((item) => (
                <tr key={item.id} className="border-b border-[#3e3e3e] last:border-0">
                  <td className="p-4">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-[#3e3e3e] rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#606161]" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[#f5e6c7] font-medium">{item.name}</td>
                  <td className="p-4 text-[#606161]">{getCategoryName(item.category_id)}</td>
                  <td className="p-4 text-[#f36e27] font-bold">SAR {item.price}</td>
                  <td className="p-4 text-right">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)} className="text-[#f5e6c7] hover:text-[#f36e27]">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeleteItem(item)} className="text-[#f5e6c7] hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {(!filteredItems || filteredItems.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#606161]">No menu items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] border-[#3e3e3e] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#f5e6c7]">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#606161] mb-2">Name</label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Item name" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" required />
            </div>
            <div>
              <label className="block text-sm text-[#606161] mb-2">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Item description" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#606161] mb-2">Price (SAR)</label>
                <Input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="0.00" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" required />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Category</label>
                <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v })}>
                  <SelectTrigger className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2e2e2e] border-[#3e3e3e]">
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()} className="text-[#f5e6c7]">{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#606161] mb-2">Image URL</label>
              <Input value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} placeholder="https://example.com/image.jpg" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
            {formData.image_url && (
              <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded" />
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[#f5e6c7]">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending} className="bg-[#f36e27] hover:bg-[#e05d1a]">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5e6c7]">Delete Menu Item</AlertDialogTitle>
            <AlertDialogDescription className="text-[#606161]">
              Are you sure you want to delete "{deleteItem?.name}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#3e3e3e] text-[#f5e6c7] border-[#3e3e3e] hover:bg-[#4e4e4e]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteItem && deleteMutation.mutate(deleteItem.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ContactTab({ toast }: { toast: any }) {
  const [formData, setFormData] = useState<ContactInfo>(defaultContact);

  const { data: contactInfo, isLoading } = useQuery({
    queryKey: ['/admin/contact'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error || !data) return defaultContact;
      return data as ContactInfo;
    },
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const saveMutation = useMutation({
    mutationFn: async (data: ContactInfo) => {
      const { error } = await supabase.from('contact_info').upsert({ ...data, id: 1 });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/admin/contact'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({ title: 'Success', description: 'Contact info saved successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save contact info', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-10 h-10 text-[#f36e27] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#f5e6c7] mb-8">Contact Information</h1>

      <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#606161] mb-2">Phone</label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+966501234567" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
            <div>
              <label className="block text-sm text-[#606161] mb-2">Email</label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="info@greazy.com" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#606161] mb-2">Address</label>
            <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Restaurant address" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#606161] mb-2">Opening Hours</label>
              <Input value={formData.opening_hours} onChange={(e) => setFormData({ ...formData, opening_hours: e.target.value })} placeholder="Daily 11:00 AM - 11:00 PM" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
            <div>
              <label className="block text-sm text-[#606161] mb-2">WhatsApp Number</label>
              <Input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} placeholder="+966501234567" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
            </div>
          </div>

          <div className="border-t border-[#3e3e3e] pt-6">
            <h3 className="text-lg font-semibold text-[#f5e6c7] mb-4">Social Media</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm text-[#606161] mb-2">Instagram URL</label>
                <Input value={formData.instagram_url} onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })} placeholder="https://instagram.com/greazy" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Facebook URL</label>
                <Input value={formData.facebook_url} onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })} placeholder="https://facebook.com/greazy" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Twitter URL</label>
                <Input value={formData.twitter_url} onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })} placeholder="https://twitter.com/greazy" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-[#f36e27] hover:bg-[#e05d1a]">
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
