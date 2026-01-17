import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, type GalleryImage } from '@/lib/supabase';

const placeholderImages: GalleryImage[] = [
  { id: 1, image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', title: 'Signature Burger', order_index: 1 },
  { id: 2, image_url: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=800&q=80', title: 'Double Stack Perfection', order_index: 2 },
  { id: 3, image_url: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=800&q=80', title: 'Complete Meal Experience', order_index: 3 },
  { id: 4, image_url: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=800&q=80', title: 'Loaded Fries', order_index: 4 },
  { id: 5, image_url: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=80', title: 'Premium Selection', order_index: 5 },
  { id: 6, image_url: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=800&q=80', title: 'Spicy Sensation', order_index: 6 },
  { id: 7, image_url: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&q=80', title: 'Family Feast', order_index: 7 },
  { id: 8, image_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80', title: 'Creamy Milkshakes', order_index: 8 },
];

export default function OurFood() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { data: galleryImages } = useQuery({
    queryKey: ['/api/gallery'],
    queryFn: async () => {
      const { data, error } = await supabase.from('gallery_images').select('*').order('order_index');
      if (error || !data || data.length === 0) return placeholderImages;
      return data as GalleryImage[];
    },
  });

  const images = galleryImages || placeholderImages;

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.getAttribute('data-id') || '0');
            setVisibleItems((prev) => new Set([...prev, id]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '50px' }
    );

    return () => observerRef.current?.disconnect();
  }, []);

  useEffect(() => {
    const elements = document.querySelectorAll('[data-gallery-item]');
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => {
      elements.forEach((el) => observerRef.current?.unobserve(el));
    };
  }, [images]);

  return (
    <div className="min-h-screen bg-[#222222] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 data-testid="our-food-title" className="text-4xl md:text-5xl font-black text-[#f36e27] mb-4">
            Our Food
          </h1>
          <p className="text-[#f5e6c7]/80 text-lg max-w-2xl mx-auto">
            Feast your eyes on our mouthwatering creations. Every dish is crafted with passion and served with pride.
          </p>
        </div>

        <div className="space-y-24">
          {images.map((image, index) => {
            const isVisible = visibleItems.has(image.id);
            const isEven = index % 2 === 0;

            return (
              <div
                key={image.id}
                data-gallery-item
                data-id={image.id}
                data-testid={`gallery-item-${image.id}`}
                className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
              >
                <div
                  className={`flex-1 overflow-hidden rounded-lg transition-all duration-1000 ease-out ${
                    isVisible
                      ? 'opacity-100 translate-x-0 scale-100'
                      : isEven
                      ? 'opacity-0 -translate-x-16 scale-95'
                      : 'opacity-0 translate-x-16 scale-95'
                  }`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg group">
                    <img
                      src={image.image_url}
                      alt={image.title || 'Delicious food'}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/60 via-transparent to-transparent" />
                  </div>
                </div>

                <div
                  className={`flex-1 text-center lg:text-left transition-all duration-1000 delay-200 ease-out ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                >
                  {image.title && (
                    <h2 className="text-3xl md:text-4xl font-bold text-[#f5e6c7] mb-4">
                      {image.title}
                    </h2>
                  )}
                  <div className="w-24 h-1 bg-[#f36e27] mx-auto lg:mx-0" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-24 text-center">
          <p className="text-[#606161] text-lg italic">
            "Every bite tells a story of flavor, passion, and craftsmanship"
          </p>
        </div>
      </div>
    </div>
  );
}
