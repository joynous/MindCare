'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Image from 'next/image';

interface Event {
  eventid: string;
  eventname: string;
  eventdate: string;
  eventtime: string;
  eventtype: string;
  eventvenue: string;
  bookedseats: number;
  totalseats: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  // load events & admin flag
  useEffect(() => {
    const load = async () => {
      // fetch events
      const { data: evts, error: evErr } = await supabase
        .from('events')
        .select('eventid, eventname, eventdate, eventtime, eventtype, eventvenue, bookedseats, totalseats')
        .order('eventdate', { ascending: true });
      if (!evErr && evts) setEvents(evts);

      // check admin
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
        setIsAdmin(profile?.is_admin ?? false);
      }
    };
    load();
  }, []);

  // delete handler
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const { error } = await supabase.from('events').delete().eq('eventid', id);
    if (error) {
      alert('Failed to delete');
      return;
    }
    setEvents((prev) => prev.filter((e) => e.eventid !== id));
  };

  // split future vs past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const futureEvents = events.filter((e) => {
    const d = new Date(e.eventdate);
    d.setHours(0, 0, 0, 0);
    return d >= today;
  });
  const pastEvents = events.filter((e) => {
    const d = new Date(e.eventdate);
    d.setHours(0, 0, 0, 0);
    return d < today;
  });

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1A2E35]">
          Upcoming Events
        </h1>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {futureEvents.map((event) => {
            const d = new Date(event.eventdate);
            d.setHours(0, 0, 0, 0);
            const daysToEvent = Math.floor((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isSoldOut = event.bookedseats >= event.totalseats;

            return (
              <div
                key={event.eventid}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={`/images/events-header/${event.eventtype.toLowerCase()}.jpg`}
                    alt={event.eventname}
                    width={600}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
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
                      <Calendar className="w-5 h-5 text-[#3AA3A0]" />
                      <span>
                        {d.toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        • {event.eventtime}
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
                      ) : event.bookedseats >= event.totalseats * 0.8 ? (
                        <span className="font-semibold text-purple-600 animate-pulse">
                          Only few seats left! Secure your spot now 🎟️
                        </span>
                      ) : (
                        <span className="font-semibold text-purple-600 animate-pulse">
                          Only few seats left! Secure your spot now 🎟️
                      </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={isSoldOut ? '#' : `/events/${event.eventid}`}
                    className={`block w-full text-center bg-[#F7D330] text-[#1A2E35] px-4 py-3 rounded-lg font-medium transition-colors ${
                      isSoldOut
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-[#F7DD80] hover:shadow-md'
                    }`}
                    aria-disabled={isSoldOut}
                  >
                    {isSoldOut ? 'Sold Out' : 'Register Now'}
                  </Link>

                  {isAdmin && (
                    <button
                      onClick={() => handleDelete(event.eventid)}
                      className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                    >
                      Delete Event
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {pastEvents.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-[#1A2E35]">Past Events</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {pastEvents.map((event) => {
                const d = new Date(event.eventdate);
                const daysSince = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));

                return (
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
                        <span className="text-white font-bold text-lg">
                          {daysSince === 0 ? 'Event Ended Today' : `Ended ${daysSince} days ago`}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-[#1A2E35] mb-2">
                        {event.eventname}
                      </h3>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {d.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
