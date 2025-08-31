'use client';

import { motion } from 'framer-motion';
import EventRegistration from '../../components/EventRegistration';
import { Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useParams } from 'next/navigation';
import Linkify from 'react-linkify';

interface Speaker { name: string; role: string; photo: string; }
interface Event {
  eventid: string;
  eventname: string;
  eventdate: string;
  eventtime: string;
  eventtype: string;
  eventvenue: string;
  eventimage: string;
  description: string;
  schedule: Array<{ time: string; title: string; description: string }>;
  speakers: Speaker[];
  totalseats: number;
  bookedseats: number;
  payment_amount: number;
}

export default function EventDetailPage() {
  const { eventid } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState('');
  const [speakers, setSpeakers] = useState<Speaker[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const { data: evt } = await supabase.from('events').select('*').eq('eventid', eventid!).single();
    if (evt) {
      setEvent(evt);
      setDescription(evt.description);
      setSpeakers(evt.speakers || []);
    }
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase.from('users').select('is_admin').eq('id', session.user.id).single();
      setIsAdmin(profile?.is_admin ?? false);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [eventid]);

  const toggleEdit = () => setEditing(prev => !prev);
  const updateSpeaker = (idx: number, field: 'name' | 'role', value: string) =>
    setSpeakers(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  const saveChanges = async () => {
    setLoading(true);
    const { error } = await supabase.from('events').update({ description, speakers }).eq('eventid', eventid!);
    if (!error) {
      setEditing(false);
      fetchData();
    }
    setLoading(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!event) return <div className="min-h-screen flex items-center justify-center">Event not found</div>;

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero */}
      <motion.div className="relative h-48 md:h-64 lg:h-96 pt-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Image
          src={
        event.eventtype
          ? `/images/events-header/${event.eventtype.toLowerCase()}.webp`
          : '/images/events-header/stranger.webp'
          }
          alt={event.eventname}
          fill
          className="object-cover"
          priority
          sizes="(max-width:768px)100vw,80vw"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div className="text-center text-white max-w-2xl px-4 pt-5" initial={{ y:20 }} animate={{ y:0 }}>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 drop-shadow-lg">{event.eventname}</h1>
        <div className="flex flex-col sm:flex-row justify-center gap-2 mb-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{new Date(event.eventdate).toLocaleDateString('en-US',{weekday:'short',year:'numeric',month:'short',day:'numeric'})}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{event.eventvenue}</span>
          </div>
        </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="flex justify-end mb-4">
          {isAdmin && (<button onClick={editing ? saveChanges : toggleEdit} className={`px-4 py-2 rounded ${editing ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}>{editing ? 'Save' : 'Edit'}</button>)}
        </div>

        {/* Main Flex: About & Registration */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* About Section with improved dark text */}
          <div className="w-full lg:w-3/5">
            <motion.section initial={{ x:-20 }} animate={{ x:0 }} className="bg-white dark:bg-[#1F2937] dark:text-gray-200 p-4 md:p-6 lg:p-8 rounded-xl shadow">
              <h2 className="text-xl md:text-2xl font-bold mb-4 dark:text-white">About This Event</h2>
              {editing ? (
                <textarea className="w-full border rounded px-3 py-2 mb-6 dark:bg-[#374151] dark:text-white" rows={4} value={description} onChange={e => setDescription(e.target.value)} />
              ) : (
                <div className="text-base leading-relaxed whitespace-pre-wrap mb-6 break-words overflow-x-hidden dark:text-gray-200">
                  <Linkify componentDecorator={(decoratedHref, decoratedText, key) => (<a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer" className="text-[#3AA3A0] dark:text-[#2DB4AF] hover:underline">{decoratedText}</a>)}>
                    {event.description}
                  </Linkify>
                </div>
              )}

              <h3 className="text-lg font-bold mb-3 dark:text-white">Event Captains</h3>
              <div className="space-y-4">
                {speakers.map((sp, idx) => (<div key={idx} className="flex flex-col md:flex-row gap-4">
                  {editing ? (<><input className="flex-1 border rounded px-2 py-1 dark:bg-[#374151] dark:text-white" value={sp.name} onChange={e => updateSpeaker(idx,'name',e.target.value)}/><input className="flex-1 border rounded px-2 py-1 dark:bg-[#374151] dark:text-white" value={sp.role} onChange={e => updateSpeaker(idx,'role',e.target.value)}/></>) : (<div className="flex items-center gap-4"><Image src={`/images/${sp.name.split(' ')[0].toLowerCase()}.jpeg`} alt={sp.name} width={80} height={80} className="rounded-full" /><div><h4 className="font-semibold dark:text-white">{sp.name}</h4><p className="text-gray-600 dark:text-gray-400">{sp.role}</p></div></div>)}
                </div>))}
              </div>
            </motion.section>
          </div>

          {/* Registration Section with dark text */}
          <div className="w-full lg:w-2/5">
            <motion.div className="bg-white dark:bg-[#1F2937] dark:text-white p-4 md:p-6 lg:p-8 rounded-xl shadow lg:sticky lg:top-8" initial={{ y:20 }} animate={{ y:0 }}>
              <EventRegistration event={{ eventId:event.eventid, eventName:event.eventname, eventDate:event.eventdate, eventVenue:event.eventvenue, totalSeats:event.totalseats, bookedSeats:event.bookedseats, paymentAmount:event.payment_amount }} />
            </motion.div>
          </div>
        </div>


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
            {/* {event.speakers?.length >= 1 && (
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
                        src={`/images/${speaker.name.split(" ")[0].toLowerCase()}.jpeg`}
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
            )} */}
          </div>
        </div>
  );
}