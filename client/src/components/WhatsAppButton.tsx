import { useQuery } from '@tanstack/react-query';
import { MessageCircle, MapPin } from 'lucide-react';

interface ContactInfo {
  whatsapp: string | null;
  googleMapsUrl: string | null;
}

export function WhatsAppButton() {
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['/api/contact'],
  });

  const whatsappNumber = contactInfo?.whatsapp || '+966501234567';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=hello`;
  const googleMapsUrl = contactInfo?.googleMapsUrl;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-center">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="whatsapp-floating-button"
        className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2e2e2e]/80 border border-[#3e3e3e] text-[#f5e6c7] hover:text-[#f36e27] hover:border-[#f36e27] transition-all duration-300"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-5 h-5" />
      </a>
      {googleMapsUrl && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="google-maps-floating-button"
          className="w-12 h-12 flex items-center justify-center rounded-full bg-[#2e2e2e]/80 border border-[#3e3e3e] text-[#f5e6c7] hover:text-[#f36e27] hover:border-[#f36e27] transition-all duration-300"
          aria-label="Open Google Maps"
        >
          <MapPin className="w-5 h-5" />
        </a>
      )}
    </div>
  );
}
