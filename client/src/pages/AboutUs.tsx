import { useQuery } from '@tanstack/react-query';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { SiInstagram, SiFacebook, SiTiktok, SiSnapchat } from 'react-icons/si';
import { Card } from '@/components/ui/card';

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
  googleMapsUrl: string | null;
}

function getGoogleMapsEmbedUrl(mapsUrl: string | null): string {
  if (!mapsUrl) return '';
  
  // If it's already an embed URL, return as-is
  if (mapsUrl.includes('/embed')) {
    return mapsUrl;
  }
  
  // Try to extract place or coordinates from various Google Maps URL formats
  try {
    const url = new URL(mapsUrl);
    
    // Handle maps.google.com or google.com/maps URLs
    // Extract place name or coordinates
    const pathMatch = mapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
    if (pathMatch) {
      const lat = pathMatch[1];
      const lng = pathMatch[2];
      return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2s!4v1234567890`;
    }
    
    // Handle place URLs with /place/ in the path
    const placeMatch = mapsUrl.match(/\/place\/([^\/]+)/);
    if (placeMatch) {
      const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
      return `https://www.google.com/maps/embed/v1/place?key=&q=${encodeURIComponent(placeName)}`;
    }
    
    // Handle query parameter based URLs
    const q = url.searchParams.get('q');
    if (q) {
      return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(q)}`;
    }
    
    // Fallback: convert to embed format
    return mapsUrl.replace('/maps/', '/maps/embed/') + '&output=embed';
  } catch {
    // If URL parsing fails, try a simple embed conversion
    return `https://www.google.com/maps?output=embed&q=${encodeURIComponent(mapsUrl)}`;
  }
}

const defaultContact: ContactInfo = {
  id: 1,
  phone: '+27123456789',
  email: 'info@greazy.com',
  address: 'Johannesburg, South Africa',
  openingHours: 'Daily 11:00 AM - 11:00 PM',
  whatsapp: '+27123456789',
  instagramUrl: 'https://instagram.com/greazy',
  facebookUrl: 'https://facebook.com/greazy',
  tiktokUrl: 'https://tiktok.com/@greazy',
  snapchatUrl: 'https://snapchat.com/add/greazy',
  googleMapsUrl: 'https://www.google.com/maps/place/Johannesburg,+South+Africa',
};

export default function AboutUs() {
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['/api/contact'],
  });

  const contact = contactInfo || defaultContact;

  const contactCards = [
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone || '',
      href: contact.phone ? `tel:${contact.phone}` : null,
      testId: 'contact-phone',
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email || '',
      href: contact.email ? `mailto:${contact.email}` : null,
      testId: 'contact-email',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsapp || '',
      href: contact.whatsapp ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}` : null,
      testId: 'contact-whatsapp',
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: contact.openingHours || '',
      href: null,
      testId: 'contact-hours',
    },
  ];

  const socialLinks = [
    { icon: SiInstagram, href: contact.instagramUrl || '#', label: 'Instagram', testId: 'social-instagram' },
    { icon: SiFacebook, href: contact.facebookUrl || '#', label: 'Facebook', testId: 'social-facebook' },
    { icon: SiTiktok, href: contact.tiktokUrl || '#', label: 'TikTok', testId: 'social-tiktok' },
    { icon: SiSnapchat, href: contact.snapchatUrl || '#', label: 'Snapchat', testId: 'social-snapchat' },
  ];

  return (
    <div className="min-h-screen bg-[#222222] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 data-testid="about-us-title" className="text-4xl md:text-5xl font-black text-[#f36e27] mb-4">
            About Us
          </h1>
          <p className="text-[#f5e6c7]/80 text-lg max-w-2xl mx-auto" data-testid="about-us-description">
            Welcome to GREAZY — where bold flavors meet street food culture. We're all about stacking up the tastiest, 
            juiciest bites that keep you coming back for more. Every dish is crafted with passion, fresh ingredients, 
            and a whole lot of love. Come hungry, leave happy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactCards.map((item) => (
            <Card
              key={item.label}
              data-testid={item.testId}
              className="p-6 bg-[#2e2e2e] border-[#3e3e3e] hover:border-[#f36e27]/50 transition-all duration-300"
            >
              {item.href ? (
                <a
                  href={item.href}
                  target={item.href.startsWith('http') ? '_blank' : undefined}
                  rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex items-start gap-4 group"
                >
                  <div className="p-3 rounded-lg bg-[#f36e27]/10 group-hover:bg-[#f36e27]/20 transition-colors">
                    <item.icon className="w-6 h-6 text-[#f36e27]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#606161] mb-1">{item.label}</p>
                    <p className="text-lg font-semibold text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors">
                      {item.value}
                    </p>
                  </div>
                </a>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-[#f36e27]/10">
                    <item.icon className="w-6 h-6 text-[#f36e27]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#606161] mb-1">{item.label}</p>
                    <p className="text-lg font-semibold text-[#f5e6c7]">{item.value}</p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <Card className="p-6 bg-[#2e2e2e] border-[#3e3e3e] mb-12" data-testid="contact-address">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-[#f36e27]/10">
              <MapPin className="w-6 h-6 text-[#f36e27]" />
            </div>
            <div>
              <p className="text-sm text-[#606161] mb-1">Address</p>
              <p className="text-lg font-semibold text-[#f5e6c7]">{contact.address}</p>
            </div>
          </div>

                  </Card>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#f5e6c7] mb-6">Follow Us</h2>
          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={social.testId}
                className="p-4 rounded-lg bg-[#2e2e2e] border border-[#3e3e3e] hover:border-[#f36e27] hover:bg-[#f36e27]/10 transition-all duration-300 group"
                aria-label={social.label}
              >
                <social.icon className="w-6 h-6 text-[#f5e6c7] group-hover:text-[#f36e27] transition-colors" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
