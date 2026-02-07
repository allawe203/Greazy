import { Link } from 'wouter';
import { ShoppingBag } from 'lucide-react';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import logo from '@assets/V1_1768668285045.png';

import Greazy_logo_Black_Stroke from "@assets/Greazy_logo_Black_Stroke.png";

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
        <img src={Greazy_logo_Black_Stroke} alt="GREAZY" className="h-24 md:h-36 w-auto mb-4 drop-shadow-lg" />
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
