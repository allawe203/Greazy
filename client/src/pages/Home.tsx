import { Link } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';

const heroVideoUrl = 'https://umyrutkzbunvqeumrqwi.supabase.co/storage/v1/object/public/images/videos/hero-video.mp4';

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={heroVideoUrl} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-lg">
          GREAZY
        </h1>
        <p className="text-xl md:text-2xl text-[#f5e6c7] mb-8 drop-shadow-md">
          We Stack, You Attack
        </p>
        <Link
          href="/menu"
          data-testid="order-now-button"
          className="flex items-center gap-3 bg-[#f36e27] hover:bg-[#d55a1a] text-white font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
        >
          <ShoppingBag className="w-6 h-6" />
          Order Now
        </Link>
      </div>

      <WhatsAppButton />
    </div>
  );
}
