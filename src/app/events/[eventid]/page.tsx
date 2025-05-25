'use client';
import { motion } from 'framer-motion';
import EventRegistration from '../../components/EventRegistration';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';

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
      <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3AA3A0]"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10 flex items-center justify-center">
        <h1 className="text-2xl text-[#1A2E35]">Event not found</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10">
      {/* Hero Section */}
      <motion.div 
        className="relative h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={`/images/events/event-${Math.floor(Math.random()*(28))+1}.webp`}
          alt={event.eventname}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div 
            className="text-center text-white max-w-2xl px-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{event.eventname}</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(event.eventdate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>{event.eventvenue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Event Details Column */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <motion.section 
              initial={{ x: -20 }}
              animate={{ x: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-[#1A2E35]">About This Event</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </motion.section>

            {/* Schedule Section */}
            {event.schedule && (
              <motion.section 
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-3xl font-bold mb-6 text-[#1A2E35]">Event Schedule</h2>
                <div className="space-y-6">
                  {event.schedule.map((item, index) => (
                    <div 
                      key={index}
                      className="flex gap-6 p-4 hover:bg-[#F7FFF7] rounded-xl transition-colors"
                    >
                      <div className="flex-shrink-0">
                        <Clock className="w-8 h-8 text-[#3AA3A0]" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{item.time} - {item.title}</h3>
                        <p className="text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Speakers Section */}
            {event.speakers && (
              <motion.section 
                className="bg-white p-8 rounded-2xl shadow-lg"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <h2 className="text-3xl font-bold mb-8 text-[#1A2E35]">Event captains</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center gap-6 p-4 bg-[#F7FFF7] rounded-xl">
                      <Image
                        src={speaker.photo}
                        alt={speaker.name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-xl font-semibold">{speaker.name}</h3>
                        <p className="text-gray-600">{speaker.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Registration Column */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-xl sticky top-8"
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