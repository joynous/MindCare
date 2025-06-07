import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Image from 'next/image'

async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('eventdate', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  return data;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1A2E35]">
          Upcoming Events
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {events.map((event, index) => (
            <div 
              key={event.eventid}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image 
                src={`/images/events-header/${index+1}.jpg`} 
                key={event.eventid}
                width={100}
                height={48}
                alt={event.eventname}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2 text-[#1A2E35]">
                  {event.eventname}
                </h2>
                
                <div className="space-y-2 text-gray-600 dark:text-[#9CA3AF]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#3AA3A0]" />
                    <span>
                      {new Date(event.eventdate).toLocaleDateString('en-IN')} • {event.eventtime}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#3AA3A0]" />
                    <span>{event.eventvenue}</span>
                  </div>
                  
                    <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#3AA3A0]" />
                    {new Date(event.eventdate) < new Date() ? (
                      <span className="font-semibold text-gray-500">
                        No more seats left
                      </span>
                    ) : (
                      <span className="font-semibold text-purple-600 animate-pulse">
                        Only few seats left! Secure your spot now 🎟️
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">                  
                    <Link
                    href={new Date(event.eventdate) < new Date() ? "#" : `/events/${event.eventid}`}
                    className={`ml-4 bg-[#F7D330] dark:bg-[#F7D330]/80 text-[#1A2E35] dark:text-[#1F2937] 
                      px-4 py-2 rounded-full transition-colors
                      ${new Date(event.eventdate) < new Date() ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:bg-[#F7DD80] dark:hover:bg-[#F7D330]/60"}`}
                    tabIndex={new Date(event.eventdate) < new Date() ? -1 : 0}
                    aria-disabled={new Date(event.eventdate) < new Date()}
                    >
                    {event.bookedseats < event.totalseats ? 'Register Now' : 'Sold Out'}
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