import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
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
  Save,
  ImageIcon,
  Upload,
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

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
}

interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  whatsapp: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  googleMapsUrl: string;
}

interface PlaceImage {
  id: string;
  imageUrl: string;
}

type AdminTab = 'overview' | 'categories' | 'menu-items' | 'place-images' | 'contact';

const defaultContact: ContactInfo = {
  id: 1,
  phone: '+966501234567',
  email: 'info@greazy.com',
  address: 'King Fahd Road, Riyadh, Saudi Arabia',
  openingHours: 'Daily 11:00 AM - 11:00 PM',
  whatsapp: '+966501234567',
  instagramUrl: 'https://instagram.com/greazy',
  facebookUrl: 'https://facebook.com/greazy',
  twitterUrl: 'https://twitter.com/greazy',
  googleMapsUrl: '',
};

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error');
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }
  if (res.status === 204) {
    return null;
  }
  return res.json();
}

async function uploadFile(file: File, folder: string): Promise<{ url: string | null; error: string | null }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return { url: null, error: data.error || 'Upload failed' };
    }
    
    return { url: data.url, error: null };
  } catch (error) {
    console.error('Upload failed:', error);
    return { url: null, error: 'Upload failed. Please enter an image URL manually.' };
  }
}

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
    { id: 'place-images' as AdminTab, label: 'Our Place', icon: ImageIcon },
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
        {activeTab === 'place-images' && <PlaceImagesTab toast={toast} />}
        {activeTab === 'contact' && <ContactTab toast={toast} />}
      </main>
    </div>
  );
}

function OverviewTab() {
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: menuItems } = useQuery({
    queryKey: ['/api/menu-items'],
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
              <p className="text-3xl font-bold text-[#f5e6c7]">{(categories as Category[])?.length || 0}</p>
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
              <p className="text-3xl font-bold text-[#f5e6c7]">{(menuItems as MenuItem[])?.length || 0}</p>
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
        <h2 className="text-xl font-bold text-[#f5e6c7] mb-4">Quick Start</h2>
        <p className="text-[#f5e6c7]/80">
          Use the sidebar to manage your restaurant content. Add categories, menu items, and update contact information.
        </p>
      </Card>
    </div>
  );
}

function CategoriesTab({ toast }: { toast: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', imageUrl: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const result = await uploadFile(file, 'categories');
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (result.url) {
      setFormData({ ...formData, imageUrl: result.url });
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } else {
      toast({ title: 'Upload Failed', description: result.error || 'Unknown error', variant: 'destructive' });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: { name: string; imageUrl: string; id?: number }) => {
      if (data.id) {
        return apiFetch(`/api/categories/${data.id}`, {
          method: 'PATCH',
          body: JSON.stringify({ name: data.name, imageUrl: data.imageUrl }),
        });
      } else {
        return apiFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: data.name, imageUrl: data.imageUrl }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      setIsDialogOpen(false);
      setEditingCategory(null);
      setFormData({ name: '', imageUrl: '' });
      toast({ title: 'Success', description: 'Category saved successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save category', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiFetch(`/api/categories/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
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
    setFormData({ name: '', imageUrl: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, imageUrl: category.imageUrl });
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
                    {category.imageUrl ? (
                      <img src={category.imageUrl} alt={category.name} className="w-16 h-12 object-cover rounded" />
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
              <label className="block text-sm text-[#606161] mb-2">Image</label>
              <div className="flex gap-2">
                <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg or upload" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7] flex-1" />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-[#3e3e3e] text-[#f5e6c7]">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[#f5e6c7]">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending || uploading} className="bg-[#f36e27] hover:bg-[#e05d1a]">
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
  const [formData, setFormData] = useState({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const result = await uploadFile(file, 'menu-items');
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (result.url) {
      setFormData({ ...formData, imageUrl: result.url });
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } else {
      toast({ title: 'Upload Failed', description: result.error || 'Unknown error', variant: 'destructive' });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        imageUrl: data.imageUrl,
        categoryId: parseInt(data.categoryId),
      };
      if (data.id) {
        return apiFetch(`/api/menu-items/${data.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        return apiFetch('/api/menu-items', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData({ name: '', description: '', price: '', imageUrl: '', categoryId: '' });
      toast({ title: 'Success', description: 'Menu item saved successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to save menu item', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiFetch(`/api/menu-items/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/menu-items'] });
      setDeleteItem(null);
      toast({ title: 'Success', description: 'Menu item deleted' });
    },
  });

  const openAddDialog = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', imageUrl: '', categoryId: categories?.[0]?.id.toString() || '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({ 
      name: item.name, 
      description: item.description || '', 
      price: item.price?.toString() || '', 
      imageUrl: item.imageUrl || '', 
      categoryId: item.categoryId?.toString() || '' 
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ ...formData, id: editingItem?.id });
  };

  const filteredItems = menuItems?.filter((item) => {
    const matchesCategory = filterCategory === 'all' || item.categoryId.toString() === filterCategory;
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
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-[#3e3e3e] rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-[#606161]" />
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-[#f5e6c7] font-medium">{item.name}</td>
                  <td className="p-4 text-[#606161]">{getCategoryName(item.categoryId)}</td>
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
                  <td colSpan={5} className="p-8 text-center text-[#606161]">No menu items yet. Add your first item!</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
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
                <Select value={formData.categoryId} onValueChange={(val) => setFormData({ ...formData, categoryId: val })}>
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
              <label className="block text-sm text-[#606161] mb-2">Image</label>
              <div className="flex gap-2">
                <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg or upload" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7] flex-1" />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-[#3e3e3e] text-[#f5e6c7]">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {formData.imageUrl && (
              <img src={formData.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[#f5e6c7]">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending || uploading} className="bg-[#f36e27] hover:bg-[#e05d1a]">
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

function PlaceImagesTab({ toast }: { toast: any }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteImage, setDeleteImage] = useState<PlaceImage | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: placeImages, isLoading } = useQuery<PlaceImage[]>({
    queryKey: ['/api/place-images'],
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const result = await uploadFile(file, 'our-place');
    setUploading(false);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    
    if (result.url) {
      setImageUrl(result.url);
      toast({ title: 'Success', description: 'Image uploaded successfully' });
    } else {
      toast({ title: 'Upload Failed', description: result.error || 'Unknown error', variant: 'destructive' });
    }
  };

  const saveMutation = useMutation({
    mutationFn: async (data: { imageUrl: string }) => {
      return apiFetch('/api/place-images', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/place-images'] });
      setIsDialogOpen(false);
      setImageUrl('');
      toast({ title: 'Success', description: 'Image added successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add image', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiFetch(`/api/place-images/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/place-images'] });
      setDeleteImage(null);
      toast({ title: 'Success', description: 'Image deleted' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete image', variant: 'destructive' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate({ imageUrl });
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#f5e6c7]">Manage Our Place</h1>
        <Button onClick={() => setIsDialogOpen(true)} data-testid="add-place-image-button" className="bg-[#f36e27] hover:bg-[#e05d1a]">
          <Plus className="w-5 h-5 mr-2" /> Add Image
        </Button>
      </div>

      {!placeImages || placeImages.length === 0 ? (
        <Card className="p-12 bg-[#2e2e2e] border-[#3e3e3e] text-center">
          <ImageIcon className="w-16 h-16 text-[#606161] mx-auto mb-4" />
          <p className="text-[#f5e6c7]">No images yet. Add your first image!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {placeImages.map((image) => (
            <Card key={image.id} className="overflow-hidden bg-[#2e2e2e] border-[#3e3e3e] group relative">
              <div className="aspect-video">
                <img src={image.imageUrl} alt="Place" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteImage(image)}
                  className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
          <DialogHeader>
            <DialogTitle className="text-[#f5e6c7]">Add Image</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#606161] mb-2">Image</label>
              <div className="flex gap-2">
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg or upload" className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7] flex-1" required />
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="border-[#3e3e3e] text-[#f5e6c7]">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="w-full h-32 object-cover rounded" />
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-[#f5e6c7]">Cancel</Button>
              <Button type="submit" disabled={saveMutation.isPending || uploading} className="bg-[#f36e27] hover:bg-[#e05d1a]">
                {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteImage} onOpenChange={() => setDeleteImage(null)}>
        <AlertDialogContent className="bg-[#2e2e2e] border-[#3e3e3e]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f5e6c7]">Delete Image</AlertDialogTitle>
            <AlertDialogDescription className="text-[#606161]">
              Are you sure you want to delete this image?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#3e3e3e] text-[#f5e6c7] border-[#3e3e3e] hover:bg-[#4e4e4e]">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteImage && deleteMutation.mutate(deleteImage.id)} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ContactTab({ toast }: { toast: any }) {
  const [formData, setFormData] = useState<ContactInfo>(defaultContact);

  const { data: contactData, isLoading } = useQuery<ContactInfo>({
    queryKey: ['/api/contact'],
  });

  useEffect(() => {
    if (contactData) {
      setFormData(contactData);
    }
  }, [contactData]);

  const saveMutation = useMutation({
    mutationFn: async (data: ContactInfo) => {
      return apiFetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
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

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
            <h2 className="text-lg font-bold text-[#f5e6c7] mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#606161] mb-2">Phone</label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">WhatsApp</label>
                <Input value={formData.whatsapp} onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e]">
            <h2 className="text-lg font-bold text-[#f5e6c7] mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#606161] mb-2">Address</label>
                <Textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Opening Hours</label>
                <Input value={formData.openingHours} onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Google Maps Link</label>
                <Input 
                  value={formData.googleMapsUrl} 
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })} 
                  placeholder="https://www.google.com/maps?q=..." 
                  className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" 
                  data-testid="input-google-maps-url"
                />
                <p className="text-xs text-[#606161] mt-1">Paste a Google Maps link for your location</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e] md:col-span-2">
            <h2 className="text-lg font-bold text-[#f5e6c7] mb-4">Social Media</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[#606161] mb-2">Instagram URL</label>
                <Input value={formData.instagramUrl} onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Facebook URL</label>
                <Input value={formData.facebookUrl} onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
              <div>
                <label className="block text-sm text-[#606161] mb-2">Twitter URL</label>
                <Input value={formData.twitterUrl} onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })} className="bg-[#222222] border-[#3e3e3e] text-[#f5e6c7]" />
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saveMutation.isPending} className="bg-[#f36e27] hover:bg-[#e05d1a]">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
