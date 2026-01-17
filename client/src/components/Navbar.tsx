import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/our-food', label: 'Our Food' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#222222]/95 backdrop-blur-md shadow-lg' : 'bg-[#222222]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-[#f36e27]">
                GREAZY
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
                  location === link.href
                    ? 'text-[#f36e27] bg-[#f36e27]/10'
                    : 'text-[#f5e6c7] hover:text-[#f36e27] hover:bg-[#f36e27]/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[#f5e6c7] hover:text-[#f36e27] transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-[#222222]/98 backdrop-blur-md border-t border-[#3e3e3e] transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
              className={`block px-4 py-3 rounded-md text-base font-semibold transition-all duration-200 ${
                location === link.href
                  ? 'text-[#f36e27] bg-[#f36e27]/10'
                  : 'text-[#f5e6c7] hover:text-[#f36e27] hover:bg-[#f36e27]/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
