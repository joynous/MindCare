import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

// Helper function to calculate days until event with timezone awareness
function daysUntil(eventDate: string) {
  const today = new Date();
  const event = new Date(eventDate);
  
  // Adjust both dates to UTC to eliminate timezone differences
  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const eventUTC = Date.UTC(event.getUTCFullYear(), event.getUTCMonth(), event.getUTCDate());
  
  const diffTime = eventUTC - todayUTC;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper to check if event is in the future (timezone safe)
function isFutureEvent(eventDate: string) {
  const today = new Date();
  const event = new Date(eventDate);
  
  // Compare dates without time components
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const eventDateOnly = new Date(event.getFullYear(), event.getMonth(), event.getDate());
  
  return eventDateOnly >= todayDate;
}

async function getEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return data;
}

export default async function EventsPage() {
  const events = await getEvents();
  
  // Use timezone-safe functions to categorize events
  const futureEvents = events.filter(event => isFutureEvent(event.eventdate));
  const pastEvents = events.filter(event => !isFutureEvent(event.eventdate));
  
  // Sort future events ascending, past events descending
  futureEvents.sort((a, b) => 
    new Date(a.eventdate).getTime() - new Date(b.eventdate).getTime()
  );
  
  pastEvents.sort((a, b) => 
    new Date(b.eventdate).getTime() - new Date(a.eventdate).getTime()
  );

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1A2E35]">
          Upcoming Events
        </h1>

        {futureEvents.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-medium text-gray-600 mb-4">
              No upcoming events scheduled yet
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Check back soon for our next gathering! We&apos;re planning exciting events to help you connect and thrive.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {futureEvents.map((event) => {
            const daysToEvent = daysUntil(event.eventdate);
            const isSoldOut = event.bookedseats >= event.totalseats;
            
            return (
              <div 
                key={event.eventid}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <Image 
                    src={`/images/events-header/${(event.eventid.charCodeAt(0) % 5) + 1}.jpg`}
                    alt={event.eventname}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Event status badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {daysToEvent > 0 ? (
                      <span className="text-green-600">
                        {daysToEvent === 1 ? 'Tomorrow' : `In ${daysToEvent} days`}
                      </span>
                    ) : (
                      <span className="text-[#F7D330]">Today</span>
                    )}
                  </div>
                </div>
                
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 text-[#1A2E35]">
                    {event.eventname}
                  </h2>
                  
                  <div className="space-y-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#3AA3A0] flex-shrink-0" />
                      <span>
                        {new Date(event.eventdate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })} • {event.eventtime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#3AA3A0] flex-shrink-0" />
                      <span>{event.eventvenue}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#3AA3A0]" />
                      {isSoldOut ? (
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

                  <div className="mt-4">
                    <Link
                      href={isSoldOut ? "#" : `/events/${event.eventid}`}
                      className={`block w-full text-center bg-[#F7D330] text-[#1A2E35] 
                        px-4 py-3 rounded-lg transition-colors font-medium
                        ${isSoldOut 
                          ? "opacity-50 cursor-not-allowed" 
                          : "hover:bg-[#F7DD80] hover:shadow-md"}`}
                      aria-disabled={isSoldOut}
                    >
                      {isSoldOut ? 'Sold Out' : 'Register Now'}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {pastEvents.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1A2E35]">
              Past Events
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <div 
                  key={event.eventid}
                  className="bg-white rounded-xl shadow overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Image 
                      src={`/images/events-header/${(event.eventid.charCodeAt(0) % 5) + 1}.jpg`}
                      alt={event.eventname}
                      width={600}
                      height={300}
                      className="w-full h-40 object-cover opacity-70"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">Event Ended</span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[#1A2E35] mb-2">
                      {event.eventname}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(event.eventdate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}