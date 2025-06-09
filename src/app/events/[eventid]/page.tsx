'use client';
import { motion } from 'framer-motion';
import EventRegistration from '../../components/EventRegistration';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';
import Linkify from 'react-linkify';

interface Event {
  eventid: string;
  eventname: string;
  eventdate: string;
  eventtime: string;
  eventvenue: string;
  eventimage: string;
  description: string;
  schedule: Array<{ time: string; title: string; description: string }>;
  speakers: Array<{ name: string; role: string; photo: string }>;
  totalseats: number;
  bookedseats: number;
  payment_amount: number;
}

export default function EventDetailPage() {
  const { eventid } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('eventid', eventid)
          .single();

        if (error) throw error;
        setEvent(data);
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] dark:from-[#F7FFF7]/95 to-[#8AE2E0]/10 dark:to-[#8AE2E0]/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3AA3A0] dark:border-[#2DB4AF]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] dark:from-[#F7FFF7]/95 to-[#8AE2E0]/10 dark:to-[#8AE2E0]/20 flex items-center justify-center">
        <h1 className="text-2xl text-[#1A2E35] dark:text-[#E5E7EB]">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero Section - Made responsive */}
      <motion.div 
        className="relative h-48 md:h-64 lg:h-96 pt-16" // Added top padding
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={`/images/events-header/${Math.floor(Math.random()*(5))+1}.jpg`}
          alt={event.eventname}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div 
            className="text-center text-white max-w-2xl px-4 pt-5"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">{event.eventname}</h1>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center justify-center gap-2 bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">
                  {new Date(event.eventdate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white/10 px-3 py-1 md:px-4 md:py-2 rounded-full">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base">{event.eventvenue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section - Made responsive */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Event Details Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-12">
            {/* About Section */}
            <motion.section 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="bg-white dark:bg-[#1F2937] p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow"
            >
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-[#1A2E35] dark:text-[#E5E7EB]">About This Event</h2>
              <div className="text-base md:text-lg text-gray-600 dark:text-[#9CA3AF] leading-relaxed whitespace-pre-wrap">
                <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a 
                    href={decoratedHref} 
                    key={key} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#3AA3A0] dark:text-[#2DB4AF] hover:underline"
                  >
                    {decoratedText}
                  </a>
                )}>
                  {event.description}
                </Linkify>
              </div>
            </motion.section>

            {/* Schedule Section */}
            {event.schedule && (
              <motion.section 
                className="bg-white dark:bg-[#1F2937] p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-[#1A2E35] dark:text-[#E5E7EB]">Event Schedule</h2>
                <div className="space-y-4 md:space-y-6">
                  {event.schedule.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-3 md:p-4 hover:bg-[#F7FFF7] dark:hover:bg-[#374151] rounded-lg transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#3AA3A0] dark:text-[#2DB4AF]" />
                      </div>
                      <div>
                        <h3 className="text-lg md:text-xl font-semibold dark:text-[#E5E7EB]">
                          <span className="block md:inline-block">{item.time}</span>
                          <span className="hidden md:inline-block mx-2">-</span>
                          <span>{item.title}</span>
                        </h3>
                        <p className="text-gray-600 dark:text-[#9CA3AF] mt-1 text-sm md:text-base">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Speakers Section */}
            {event.speakers && (
              <motion.section 
                className="bg-white dark:bg-[#1F2937] p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6 text-[#1A2E35] dark:text-[#E5E7EB]">Event captains</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 md:p-4 bg-[#F7FFF7] dark:bg-[#374151] rounded-lg">
                      <Image
                        src={`/images/${speaker.name}.jpeg`}
                        alt={speaker.name}
                        width={80}
                        height={80}
                        className="rounded-full w-16 h-16 md:w-20 md:h-20"
                      />
                      <div>
                        <h3 className="text-base md:text-lg lg:text-xl font-semibold dark:text-[#E5E7EB]">{speaker.name}</h3>
                        <p className="text-gray-600 dark:text-[#9CA3AF] text-sm md:text-base">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Registration Column - Made responsive */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white dark:bg-[#1F2937] p-4 md:p-6 lg:p-8 rounded-xl md:rounded-2xl shadow lg:sticky lg:top-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <EventRegistration 
                event={{
                  eventId: event.eventid,
                  eventName: event.eventname,
                  eventDate: event.eventdate,
                  eventVenue: event.eventvenue,
                  totalSeats: event.totalseats,
                  bookedSeats: event.bookedseats,
                  paymentAmount: event.payment_amount
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}