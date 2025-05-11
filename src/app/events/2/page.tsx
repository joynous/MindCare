'use client';
import { motion } from 'framer-motion';
import EventRegistration from '../../components/EventRegistration';
import { Calendar, Clock, MapPin} from 'lucide-react';
import Image from 'next/image';

const nextEvent = {
  id: 'mental-health-workshop',
  title: "Mental Health & Wellness Workshop",
  date: "Saturday, 25 May 2025",
  time: "10:00 AM - 4:00 PM",
  location: "Community Wellness Center, Mumbai",
  image: "/images/events/event-1.webp",
  description: "Join our expert-led workshop focusing on mental health awareness and practical coping strategies.",
  schedule: [
    { time: "10:00 AM", title: "Welcome & Registration", description: "Light breakfast provided" },
    { time: "10:30 AM", title: "Morning Session", description: "Understanding Mental Health Basics" },
    { time: "12:30 PM", title: "Lunch Break", description: "Healthy meal options provided" },
    { time: "1:30 PM", title: "Interactive Workshop", description: "Practical coping strategies" },
    { time: "3:30 PM", title: "Q&A Session", description: "Ask our experts anything" },
  ],
  speakers: [
    { name: "Dr. Sarah Johnson", role: "Clinical Psychologist", photo: "/images/speakers/sarah.jpg" },
    { name: "Michael Chen", role: "Mindfulness Expert", photo: "/images/speakers/michael.jpg" },
  ]
};

export default function NextEventPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10">
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        className="relative h-96"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={nextEvent.image}
          alt={nextEvent.title}
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
            <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">{nextEvent.title}</h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-5 h-5" />
                <span>{nextEvent.date}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                <MapPin className="w-5 h-5" />
                <span>{nextEvent.location}</span>
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
                {nextEvent.description}
              </p>
            </motion.section>

            {/* Schedule Section */}
            <motion.section 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-[#1A2E35]">Event Schedule</h2>
              <div className="space-y-6">
                {nextEvent.schedule.map((item, index) => (
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

            {/* Speakers Section */}
            <motion.section 
              className="bg-white p-8 rounded-2xl shadow-lg"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
            >
              <h2 className="text-3xl font-bold mb-8 text-[#1A2E35]">Featured Speakers</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {nextEvent.speakers.map((speaker, index) => (
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
          </div>

          {/* Registration Column */}
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white p-8 rounded-2xl shadow-xl sticky top-8"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <EventRegistration eventId={nextEvent.id} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}