import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PlaceImage {
  id: string;
  imageUrl: string;
  createdAt?: string;
}

const placeholderImages: PlaceImage[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&q=80' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&q=80' },
];

export default function OurPlace() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { data: placeImages } = useQuery<PlaceImage[]>({
    queryKey: ['/api/place-images'],
  });

  const images = placeImages && placeImages.length > 0 ? placeImages : placeholderImages;

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isAutoPlaying || images.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, goToNext, images.length]);

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((image) => (
          <div
            key={image.id}
            className="min-w-full h-full flex-shrink-0"
            data-testid={`place-image-${image.id}`}
          >
            <img
              src={image.imageUrl}
              alt="Our Place"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            data-testid="slider-prev"
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#222222]/70 text-[#f5e6c7] hover:bg-[#f36e27] transition-colors z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          <button
            onClick={goToNext}
            data-testid="slider-next"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#222222]/70 text-[#f5e6c7] hover:bg-[#f36e27] transition-colors z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                data-testid={`slider-dot-${index}`}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-[#f36e27] scale-125'
                    : 'bg-[#f5e6c7]/50 hover:bg-[#f5e6c7]'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
