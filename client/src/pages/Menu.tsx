import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface Category {
  id: number;
  name: string;
  imageUrl: string | null;
}

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryId: number | null;
}

const placeholderCategories: Category[] = [
  { id: 1, name: 'Burgers', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80' },
  { id: 2, name: 'Sides', imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80' },
  { id: 3, name: 'Drinks', imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80' },
  { id: 4, name: 'Desserts', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80' },
  { id: 5, name: 'Combos', imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80' },
  { id: 6, name: 'Specials', imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80' },
];

const placeholderMenuItems: Record<number, MenuItem[]> = {
  1: [
    { id: 1, name: 'Classic Greazy Burger', description: 'Juicy beef patty, fresh lettuce, tomato, pickles, and our secret Greazy sauce', price: '45', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80', categoryId: 1 },
    { id: 2, name: 'Double Stack', description: 'Two beef patties, double cheese, caramelized onions, and bacon', price: '65', imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80', categoryId: 1 },
    { id: 3, name: 'Spicy Inferno', description: 'Beef patty with jalapeños, ghost pepper sauce, and pepper jack cheese', price: '55', imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=500&q=80', categoryId: 1 },
    { id: 4, name: 'Mushroom Swiss', description: 'Sautéed mushrooms, melted Swiss cheese, and truffle aioli', price: '58', imageUrl: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=500&q=80', categoryId: 1 },
  ],
  2: [
    { id: 5, name: 'Loaded Fries', description: 'Crispy fries topped with cheese sauce, bacon bits, and jalapeños', price: '25', imageUrl: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80', categoryId: 2 },
    { id: 6, name: 'Onion Rings', description: 'Beer-battered crispy onion rings with dipping sauce', price: '20', imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=500&q=80', categoryId: 2 },
    { id: 7, name: 'Coleslaw', description: 'Creamy homemade coleslaw with a tangy kick', price: '12', imageUrl: 'https://images.unsplash.com/photo-1625938145312-ab917b6c9e99?w=500&q=80', categoryId: 2 },
  ],
  3: [
    { id: 8, name: 'Fresh Lemonade', description: 'Freshly squeezed lemonade with mint', price: '15', imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&q=80', categoryId: 3 },
    { id: 9, name: 'Milkshake', description: 'Thick and creamy shake in vanilla, chocolate, or strawberry', price: '22', imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80', categoryId: 3 },
  ],
  4: [
    { id: 10, name: 'Chocolate Brownie', description: 'Warm fudgy brownie with vanilla ice cream', price: '28', imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80', categoryId: 4 },
    { id: 11, name: 'Churros', description: 'Crispy churros with chocolate dipping sauce', price: '18', imageUrl: 'https://images.unsplash.com/photo-1624371516448-97f36f9af2eb?w=500&q=80', categoryId: 4 },
  ],
  5: [
    { id: 12, name: 'Greazy Combo', description: 'Classic burger, loaded fries, and a drink', price: '75', imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80', categoryId: 5 },
    { id: 13, name: 'Family Feast', description: 'Four burgers, two large fries, onion rings, and four drinks', price: '220', imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=500&q=80', categoryId: 5 },
  ],
  6: [
    { id: 14, name: 'Weekend Special', description: 'Limited edition burger with premium wagyu beef and truffle mayo', price: '95', imageUrl: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&q=80', categoryId: 6 },
  ],
};

export default function Menu() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [animateItems, setAnimateItems] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: menuItems, isLoading: itemsLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu-items'],
    enabled: !!selectedCategory,
  });

  useEffect(() => {
    if (selectedCategory) {
      setAnimateItems(false);
      const timer = setTimeout(() => setAnimateItems(true), 100);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleBack = () => {
    setSelectedCategory(null);
  };

  if (categoriesLoading) {
    return (
      <div className="min-h-screen bg-[#222222] pt-24 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#f36e27] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#222222] pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 data-testid="menu-title" className="text-4xl md:text-5xl font-black text-[#f36e27] mb-4">
            Our Menu
          </h1>
          <p className="text-[#f5e6c7]/80 text-lg">Fresh, bold, and unforgettable flavors</p>
        </div>

        {!selectedCategory ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {(Array.isArray(categories) && categories.length > 0 ? categories : placeholderCategories).map((category, index) => (
              <Card
                key={category.id}
                data-testid={`category-card-${category.id}`}
                onClick={() => handleCategoryClick(category)}
                className="group cursor-pointer overflow-hidden bg-[#2e2e2e] border-[#3e3e3e] hover:border-[#f36e27] transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square sm:aspect-[4/3] relative overflow-hidden">
                  <img
                    src={category.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                    <h3 className="text-lg sm:text-2xl font-bold text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={handleBack}
              data-testid="back-to-categories"
              className="flex items-center gap-2 text-[#f36e27] font-semibold mb-8 hover:underline transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Categories
            </button>

            <h2 className="text-3xl font-bold text-[#f5e6c7] mb-8">{selectedCategory.name}</h2>

            {itemsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-[#f36e27] animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(menuItems) && menuItems.length > 0 ? menuItems : (placeholderMenuItems[selectedCategory.id] || [])).filter(item => item.categoryId === selectedCategory.id).map((item, index) => (
                  <Card
                    key={item.id}
                    data-testid={`menu-item-${item.id}`}
                    className={`overflow-hidden bg-[#2e2e2e] border-[#3e3e3e] hover:border-[#f36e27]/50 transition-all duration-500 ${
                      animateItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold text-[#f5e6c7]">{item.name}</h3>
                        <span className="text-xl font-black text-[#f36e27] whitespace-nowrap">
                          SAR {item.price}
                        </span>
                      </div>
                      <p className="text-[#f5e6c7]/70 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
