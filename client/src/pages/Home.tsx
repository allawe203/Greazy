import { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'wouter';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1920&q=80"
        >
          <source
            src="https://cdn.coverr.co/videos/coverr-making-a-burger-3741/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#222222]/70 via-[#222222]/50 to-[#222222]/90" />
      </div>

      <div
        className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-4 transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center">
          <h1
            data-testid="hero-title"
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#f36e27] mb-4"
            style={{ textShadow: '0 4px 30px rgba(243, 110, 39, 0.5)' }}
          >
            GREAZY
          </h1>
          <p
            data-testid="hero-tagline"
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#f5e6c7] mb-8 tracking-wide"
          >
            We Stack, You Attack
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              data-testid="cta-view-menu"
              className="px-8 py-4 bg-[#f36e27] text-white font-bold text-lg rounded-md hover:bg-[#e05d1a] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[#f36e27]/30"
            >
              View Our Menu
            </Link>
            <Link
              href="/reservations"
              data-testid="cta-book-table"
              className="px-8 py-4 border-2 border-[#f5e6c7] text-[#f5e6c7] font-bold text-lg rounded-md hover:bg-[#f5e6c7] hover:text-[#222222] transition-all duration-300 transform hover:scale-105"
            >
              Book a Table
            </Link>
          </div>
        </div>

        <button
          onClick={scrollToContent}
          data-testid="scroll-indicator"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#f5e6c7] animate-bounce hover:text-[#f36e27] transition-colors"
          aria-label="Scroll down"
        >
          <ChevronDown className="w-10 h-10" />
        </button>
      </div>

      <section className="relative z-10 bg-[#222222] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27]/50 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f36e27]/20 flex items-center justify-center">
                <span className="text-3xl">🍔</span>
              </div>
              <h3 className="text-xl font-bold text-[#f36e27] mb-2">Fresh Ingredients</h3>
              <p className="text-[#f5e6c7]/80">Only the freshest ingredients make it to your plate</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27]/50 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f36e27]/20 flex items-center justify-center">
                <span className="text-3xl">🔥</span>
              </div>
              <h3 className="text-xl font-bold text-[#f36e27] mb-2">Flame Grilled</h3>
              <p className="text-[#f5e6c7]/80">Cooked to perfection with our signature flame grill</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27]/50 transition-all duration-300">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#f36e27]/20 flex items-center justify-center">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-[#f36e27] mb-2">Fast & Fresh</h3>
              <p className="text-[#f5e6c7]/80">Quick service without compromising on quality</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
