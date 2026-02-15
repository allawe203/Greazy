import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { SiInstagram, SiFacebook, SiTiktok, SiSnapchat } from 'react-icons/si';
import logo from '@assets/V1_1768668285045.png';

interface ContactInfo {
  id: number;
  phone: string | null;
  email: string | null;
  address: string | null;
  openingHours: string | null;
  whatsapp: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  snapchatUrl: string | null;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/our-place', label: 'Our Place' },
  { href: '/reservations', label: 'Reservations' },
  { href: '/about-us', label: 'About Us' },
];

export function Footer() {
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['/api/contact'],
  });

  const contact = contactInfo || {
    phone: '+966501234567',
    email: 'info@greazy.com',
    address: 'King Fahd Road, Riyadh, Saudi Arabia',
    whatsapp: '+966501234567',
  };

  return (
    <footer className="bg-[#1a1a1a] border-t border-[#3e3e3e]" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="inline-block mb-4">
              <img src={logo} alt="GREAZY" className="h-12 w-auto" />
            </Link>
            <p className="text-[#f5e6c7]/60 text-sm mb-4">
              We Stack, You Attack
            </p>
            <div className="flex items-center gap-3">
              <a
                href={contactInfo?.instagramUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-social-instagram"
                className="p-2 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27] hover:bg-[#f36e27]/10 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <SiInstagram className="w-5 h-5 text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors" />
              </a>
              <a
                href={contactInfo?.facebookUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-social-facebook"
                className="p-2 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27] hover:bg-[#f36e27]/10 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <SiFacebook className="w-5 h-5 text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors" />
              </a>
              <a
                href={contactInfo?.tiktokUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-social-tiktok"
                className="p-2 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27] hover:bg-[#f36e27]/10 transition-all duration-300 group"
                aria-label="TikTok"
              >
                <SiTiktok className="w-5 h-5 text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors" />
              </a>
              <a
                href={contactInfo?.snapchatUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="footer-social-snapchat"
                className="p-2 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27] hover:bg-[#f36e27]/10 transition-all duration-300 group"
                aria-label="Snapchat"
              >
                <SiSnapchat className="w-5 h-5 text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[#f36e27] font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-testid={`footer-link-${link.label.toLowerCase().replace(' ', '-')}`}
                    className="text-[#f5e6c7]/80 hover:text-[#f36e27] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[#f36e27] font-bold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {contact.phone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#f36e27]" />
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-[#f5e6c7]/80 hover:text-[#f36e27] transition-colors text-sm"
                    data-testid="footer-phone"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.whatsapp && (
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#f36e27]" />
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}?text=hello`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#f5e6c7]/80 hover:text-[#f36e27] transition-colors text-sm"
                    data-testid="footer-whatsapp"
                  >
                    {contact.whatsapp}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#f36e27]" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-[#f5e6c7]/80 hover:text-[#f36e27] transition-colors text-sm"
                    data-testid="footer-email"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
              {contact.address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#f36e27] mt-0.5 flex-shrink-0" />
                  <span className="text-[#f5e6c7]/80 text-sm" data-testid="footer-address">
                    {contact.address}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-[#3e3e3e] text-center">
          <p className="text-[#606161] text-sm">
            © {new Date().getFullYear()} GREAZY. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
