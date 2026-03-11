'use client';

import { useCallback } from 'react';
import { motion } from 'framer-motion';
import EventRegistration from '../../components/EventRegistration';
import { Calendar, Clock, MapPin, Camera, Music, Palette, Users, Sparkles, Heart, Coffee, Trophy, Star, MessageSquare } from 'lucide-react';
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

  const fetchData = useCallback(async () => {
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
  }, [eventid]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

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
      {/* Hero Section */}
      <motion.div 
        className="relative h-[300px] md:h-[400px] lg:h-[500px] pt-16" 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
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
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <motion.div 
            className="text-center text-white max-w-4xl px-4" 
            initial={{ y: 20 }} 
            animate={{ y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">{event.eventname}</h1>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(event.eventdate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{event.eventtime}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{event.eventvenue}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Admin Edit Button */}
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <button 
              onClick={editing ? saveChanges : toggleEdit} 
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                editing 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {editing ? 'Save Changes' : 'Edit Event'}
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - About & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.section 
              initial={{ x: -20 }} 
              animate={{ x: 0 }} 
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-800">About This Event</h2>
              {editing ? (
                <textarea 
                  className="w-full border rounded-lg px-4 py-3 mb-6 focus:ring-2 focus:ring-[#3AA3A0] focus:border-transparent" 
                  rows={6} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                />
              ) : (
                <div className="text-gray-600 leading-relaxed whitespace-pre-wrap mb-6">
                  <Linkify 
                    componentDecorator={(decoratedHref, decoratedText, key) => (
                      <a 
                        href={decoratedHref} 
                        key={key} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#3AA3A0] hover:underline"
                      >
                        {decoratedText}
                      </a>
                    )}
                  >
                    {event.description}
                  </Linkify>
                </div>
              )}

              {/* Event Captains */}
              <h3 className="text-xl font-bold mb-4 text-gray-800">Event Captains</h3>
              <div className="space-y-4">
                {speakers.map((sp, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {editing ? (
                      <>
                        <input 
                          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3AA3A0]" 
                          value={sp.name} 
                          onChange={e => updateSpeaker(idx, 'name', e.target.value)}
                          placeholder="Name"
                        />
                        <input 
                          className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#3AA3A0]" 
                          value={sp.role} 
                          onChange={e => updateSpeaker(idx, 'role', e.target.value)}
                          placeholder="Role"
                        />
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-gradient-to-br from-[#3AA3A0] to-[#F7D330] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {sp.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{sp.name}</h4>
                          <p className="text-gray-600">{sp.role}</p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.section>

            {/* Features Section - ICONS ARE HERE */}
            <motion.section 
              className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6 text-gray-800">What to Expect</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Capture Moments */}
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-red-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Capture Moments</h3>
                  <p className="text-sm text-gray-600">Professional photography to capture your memories</p>
                </div>

                {/* Live Music */}
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Music className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Live Music</h3>
                  <p className="text-sm text-gray-600">Talented local artists performing throughout</p>
                </div>

                {/* Creative Workshops */}
                <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Palette className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Creative Workshops</h3>
                  <p className="text-sm text-gray-600">Hands-on learning with expert guidance</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#3AA3A0]">500+</div>
                  <div className="text-sm text-gray-500">Events</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#F7D330]">10k+</div>
                  <div className="text-sm text-gray-500">Attendees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#FF6B6B]">4.9</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
              </div>
            </motion.section>

            {/* Schedule Section */}
            {event.schedule && event.schedule.length > 0 && (
              <motion.section 
                className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#3AA3A0]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-[#3AA3A0]">{item.time}</span>
                          <span className="text-gray-400">•</span>
                          <span className="font-semibold text-gray-800">{item.title}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          {/* Right Column - Registration */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
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