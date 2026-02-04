import { useQuery } from '@tanstack/react-query';
import { MessageCircle } from 'lucide-react';

interface ContactInfo {
  whatsapp: string | null;
}

export function WhatsAppButton() {
  const { data: contactInfo } = useQuery<ContactInfo>({
    queryKey: ['/api/contact'],
  });

  const whatsappNumber = contactInfo?.whatsapp || '+966501234567';
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}?text=hello`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-floating-button"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
