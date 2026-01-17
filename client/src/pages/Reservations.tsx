import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase, type ContactInfo } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MessageCircle, Clock, Users } from 'lucide-react';

const defaultContact: ContactInfo = {
  id: 1,
  phone: '+966501234567',
  email: 'info@greazy.com',
  address: 'Riyadh, Saudi Arabia',
  opening_hours: 'Daily 11:00 AM - 11:00 PM',
  whatsapp: '+966501234567',
  instagram_url: 'https://instagram.com/greazy',
  facebook_url: 'https://facebook.com/greazy',
  twitter_url: 'https://twitter.com/greazy',
};

export default function Reservations() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [message, setMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { data: contactInfo } = useQuery({
    queryKey: ['/api/contact'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_info').select('*').single();
      if (error || !data) return defaultContact;
      return data as ContactInfo;
    },
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleBookNow = () => {
    if (!selectedDate) return;

    const whatsappNumber = (contactInfo?.whatsapp || defaultContact.whatsapp).replace(/[^0-9]/g, '');
    const formattedMessage = encodeURIComponent(
      `Hello GREAZY Restaurant,\n\nI would like to make a reservation for ${formatDate(selectedDate)}\n\n${message}`
    );
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${formattedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#222222] pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 data-testid="reservations-title" className="text-4xl md:text-5xl font-black text-[#f36e27] mb-4">
            Make a Reservation
          </h1>
          <p className="text-[#f5e6c7]/80 text-lg">Book your table and get ready for an amazing experience</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-[#2e2e2e] rounded-lg border border-[#3e3e3e] p-6">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-[#f36e27]" />
              <h2 className="text-xl font-bold text-[#f5e6c7]">Select Date</h2>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="p-2 text-[#f5e6c7] hover:text-[#f36e27] transition-colors"
                  aria-label="Previous month"
                >
                  &larr;
                </button>
                <span className="text-lg font-semibold text-[#f5e6c7]">{monthName}</span>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="p-2 text-[#f5e6c7] hover:text-[#f36e27] transition-colors"
                  aria-label="Next month"
                >
                  &rarr;
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-[#606161] py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((date, index) => {
                  const disabled = isDateDisabled(date);
                  const isSelected = date && selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => date && !disabled && setSelectedDate(date)}
                      disabled={disabled}
                      data-testid={date ? `date-${date.getDate()}` : undefined}
                      className={`
                        aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-all
                        ${!date ? 'invisible' : ''}
                        ${disabled ? 'text-[#606161] cursor-not-allowed' : 'text-[#f5e6c7] hover:bg-[#f36e27]/20 cursor-pointer'}
                        ${isSelected ? 'bg-[#f36e27] text-white hover:bg-[#f36e27]' : ''}
                      `}
                    >
                      {date?.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedDate && (
              <div className="mt-4 p-3 bg-[#f36e27]/10 rounded-md border border-[#f36e27]/30">
                <p className="text-[#f36e27] font-medium text-sm">
                  Selected: {formatDate(selectedDate)}
                </p>
              </div>
            )}
          </div>

          <div className="bg-[#2e2e2e] rounded-lg border border-[#3e3e3e] p-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-[#f36e27]" />
              <h2 className="text-xl font-bold text-[#f5e6c7]">Your Message</h2>
            </div>

            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Number of guests, special requests, preferred time, etc."
              data-testid="reservation-message"
              className="min-h-[150px] bg-[#222222] border-[#3e3e3e] text-[#f5e6c7] placeholder:text-[#606161] focus:border-[#f36e27] resize-none"
            />

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-[#f5e6c7]/70 text-sm">
                <Users className="w-5 h-5 text-[#f36e27]" />
                <span>Mention party size in your message</span>
              </div>
              <div className="flex items-center gap-3 text-[#f5e6c7]/70 text-sm">
                <Clock className="w-5 h-5 text-[#f36e27]" />
                <span>Include your preferred time</span>
              </div>
            </div>

            <Button
              onClick={handleBookNow}
              disabled={!selectedDate}
              data-testid="book-now-button"
              className="w-full mt-8 py-6 text-lg font-bold bg-[#f36e27] hover:bg-[#e05d1a] disabled:bg-[#3e3e3e] disabled:text-[#606161]"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Book via WhatsApp
            </Button>

            <p className="text-center text-[#606161] text-sm mt-4">
              Opens WhatsApp with your reservation details
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
