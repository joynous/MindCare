import Link from 'next/link';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

const events = [
  {
    id: 1,
    title: "Mental Health Awareness Workshop",
    date: "2025-06-15",
    time: "10:00 AM - 4:00 PM",
    location: "Community Wellness Center, Mumbai",
    seats: 50,
    registered: 32,
    image: "/images/events/event-20.webp"
  },
  {
    id: 2,
    title: "Mindfulness & Meditation Retreat",
    date: "2025-06-22",
    time: "8:00 AM - 12:00 PM",
    location: "Serenity Park, Delhi",
    seats: 30,
    registered: 18,
    image: "/images/events/event-3.webp"
  }
];

export default function EventsPage() {
  return (
    <div className="min-h-screen mt-20 bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1A2E35]">
          Upcoming Events
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {events.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img 
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-[#1A2E35]">
                  {event.title}
                </h2>
                
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#3AA3A0]" />
                    <span>{new Date(event.date).toLocaleDateString()} • {event.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#3AA3A0]" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#3AA3A0]" />
                    <span>
                      {event.registered}/{event.seats} seats filled
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3AA3A0] h-2 rounded-full"
                      style={{ width: `${(event.registered/event.seats)*100}%` }}
                    />
                  </div>
                  
                  <Link
                    href={`/events/${event.id}`}
                    className="ml-4 bg-[#F7D330] text-[#1A2E35] px-4 py-2 rounded-full hover:bg-[#F7DD80] transition-colors"
                  >
                    Register Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}