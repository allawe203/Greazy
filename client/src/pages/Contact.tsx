import { useQuery } from '@tanstack/react-query';
import { supabase, type ContactInfo } from '@/lib/supabase';
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react';
import { SiInstagram, SiFacebook, SiX } from 'react-icons/si';
import { Card } from '@/components/ui/card';

const defaultContact: ContactInfo = {
  id: 1,
  phone: '+966501234567',
  email: 'info@greazy.com',
  address: 'King Fahd Road, Riyadh, Saudi Arabia',
  opening_hours: 'Daily 11:00 AM - 11:00 PM',
  whatsapp: '+966501234567',
  instagram_url: 'https://instagram.com/greazy',
  facebook_url: 'https://facebook.com/greazy',
  twitter_url: 'https://twitter.com/greazy',
};

export default function Contact() {
  const { data: contactInfo } = useQuery({
    queryKey: ['/api/contact'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error || !data) return defaultContact;
      return data as ContactInfo;
    },
  });

  const contact = contactInfo || defaultContact;

  const contactCards = [
    {
      icon: Phone,
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
      testId: 'contact-phone',
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      testId: 'contact-email',
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, '')}`,
      testId: 'contact-whatsapp',
    },
    {
      icon: Clock,
      label: 'Opening Hours',
      value: contact.opening_hours,
      href: null,
      testId: 'contact-hours',
    },
  ];

  const socialLinks = [
    { icon: SiInstagram, href: contact.instagram_url, label: 'Instagram', testId: 'social-instagram' },
    { icon: SiFacebook, href: contact.facebook_url, label: 'Facebook', testId: 'social-facebook' },
    { icon: SiX, href: contact.twitter_url, label: 'Twitter', testId: 'social-twitter' },
  ];

  return (
    <div className="min-h-screen bg-[#222222] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 data-testid="contact-title" className="text-4xl md:text-5xl font-black text-[#f36e27] mb-4">
            Contact Us
          </h1>
          <p className="text-[#f5e6c7]/80 text-lg">We'd love to hear from you</p>
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

          <div className="aspect-video rounded-lg overflow-hidden border border-[#3e3e3e]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.7550445746854!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="GREAZY Location"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
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
