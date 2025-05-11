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
    <div className="min-h-screen mt-20 bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1A2E35]">
          Upcoming Events
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {events.map((event) => (
            <div 
              key={event.eventid}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image 
                src={`/images/events/event-${Math.floor(Math.random()*(29))}.webp`}
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
                
                <div className="space-y-2 text-gray-600">
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
                    <span>
                      {event.bookedseats}/{event.totalseats} seats filled
                      ({Math.round((event.bookedseats / event.totalseats) * 100)}%)
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#3AA3A0] h-2 rounded-full"
                      style={{ width: `${(event.bookedseats / event.totalseats) * 100}%` }}
                    />
                  </div>
                  
                  <Link
                    href={`/events/${event.eventid}`}
                    className="ml-4 bg-[#F7D330] text-[#1A2E35] px-4 py-2 rounded-full hover:bg-[#F7DD80] transition-colors"
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