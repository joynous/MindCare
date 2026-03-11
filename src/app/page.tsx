// app/page.tsx (Home)
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Users, Calendar, MessageSquare, ChevronLeft, ChevronRight, ArrowDown, MapPin, Clock, Star, Heart, Camera, Music,   Palette, Coffee, Trophy } from 'lucide-react';
import { eventImages } from './data/event';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import { supabase } from './lib/supabase';

// Feature flag for festive mode
const FESTIVE_MODE = process.env.NEXT_PUBLIC_FESTIVE_MODE === 'true';

export default function Home() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [sparkleKey, setSparkleKey] = useState(0);
  const [showScrollArrow, setShowScrollArrow] = useState(true);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

  // Fetch user profile for greeting
  useEffect(() => {
    async function loadProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile, error } = await supabase
          .from('users')
          .select('first_name')
          .eq('id', session.user.id)
          .single();
        if (!error && profile?.first_name) {
          setFirstName(profile.first_name);
        }
      }
    }
    loadProfile();
  }, []);

  // Confetti & sparkles
  useEffect(() => {
    if (!FESTIVE_MODE) return;
    const triggerConfetti = () => {
      confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.6 }, 
        colors: ['#3AA3A0', '#F7D330', '#FF6B6B', '#8AE2E0', '#A78BFA'] 
      });
    };
    triggerConfetti();
    const confInterval = setInterval(triggerConfetti, 8000);
    const sparkInterval = setInterval(() => setSparkleKey(k => k+1), 1200);
    return () => {
      clearInterval(confInterval);
      clearInterval(sparkInterval);
    };
  }, []);

  const scroll = (direction: 'left'|'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Hide scroll arrow after user scrolls past hero
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollArrow(false);
      } else {
        setShowScrollArrow(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderSparkles = () => {
    if (!FESTIVE_MODE) return null;
    return Array.from({ length: 20 }).map((_, i) => {
      const size = Math.random() * 20 + 10;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = 1 + Math.random() * 2;
      return (
        <motion.div
          key={`${sparkleKey}-${i}`}
          className="absolute pointer-events-none text-[#F7D330]"
          style={{ left: `${left}%`, top: `${top}%`, fontSize: `${size}px` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0], 
            scale: [0, 1, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: duration,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          ✨
        </motion.div>
      );
    });
  };

const features = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Meet New People",
    text: "Connect with like-minded individuals in your area",
    color: "from-[#3AA3A0] to-[#2E827F]",
    bgColor: "bg-[#3AA3A0]/10",
    stats: "500+ connections made"
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    title: "Weekly Events",
    text: "Curated activities from board games to outdoor adventures",
    color: "from-[#F7D330] to-[#E5C02E]",
    bgColor: "bg-[#F7D330]/10",
    stats: "50+ events monthly"
  },
  {
    icon: <MessageSquare className="w-8 h-8" />,
    title: "Safe Space",
    text: "Inclusive environment with strict safety guidelines",
    color: "from-[#8AE2E0] to-[#6FB5B3]",
    bgColor: "bg-[#8AE2E0]/10",
    stats: "100% verified community"
  },
  {
    icon: <Camera className="w-8 h-8" />,
    title: "Capture Moments",
    text: "Professional photography at every event",
    color: "from-[#FF6B6B] to-[#FF5252]",
    bgColor: "bg-[#FF6B6B]/10",
    stats: "1000+ memories captured"
  },
  {
    icon: <Music className="w-8 h-8" />,
    title: "Live Music",
    text: "Enjoy performances by local artists",
    color: "from-[#A78BFA] to-[#8B5CF6]",
    bgColor: "bg-[#A78BFA]/10",
    stats: "30+ artists featured"
  },
  {
    icon: <Palette className="w-8 h-8" />,
    title: "Creative Workshops",
    text: "Learn new skills in fun environments",
    color: "from-[#F472B6] to-[#EC4899]",
    bgColor: "bg-[#F472B6]/10",
    stats: "20+ workshop types"
  }
];
  // const upcomingEvents = [
  //   { name: "Art & Wine Night", date: "Mar 15", attendees: 45, icon: <Palette className="w-4 h-4" /> },
  //   { name: "Sunset Yoga", date: "Mar 18", attendees: 30, icon: <Heart className="w-4 h-4" /> },
  //   { name: "Board Game Cafe", date: "Mar 20", attendees: 60, icon: <Coffee className="w-4 h-4" /> },
  //   { name: "Live Jazz Evening", date: "Mar 22", attendees: 80, icon: <Music className="w-4 h-4" /> }
  // ];
// Add state for background image index
const [bgIndex, setBgIndex] = useState(0);
const bgImages = [
  // '/images/hero-bg-2.jpg',
  '/images/hero-bg.jpg',
  '/images/hero-bg-3.jpg',
];

// Auto-rotate background images
useEffect(() => {
  const interval = setInterval(() => {
    setBgIndex((prev) => (prev + 1) % bgImages.length);
  }, 5000);
  return () => clearInterval(interval);
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-1/4 w-72 h-72 bg-[#3AA3A0]/10 rounded-full blur-3xl"
          animate={{
            y: [0, 50, 0],
            x: [0, 30, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#F7D330]/10 rounded-full blur-3xl"
          animate={{
            y: [0, -50, 0],
            x: [0, -30, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF6B6B]/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Festive sparkles overlay */}
      {FESTIVE_MODE && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {renderSparkles()}
        </div>
      )}

      {/* Festive banner */}
      {FESTIVE_MODE && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="fixed top-0 left-0 right-0 bg-gradient-to-r from-[#FF6B6B] via-[#F7D330] to-[#3AA3A0] py-3 text-white font-bold text-center z-50 shadow-lg"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0, repeat: Infinity }}
            className="flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            🎊 Joynous Fest coming this Sunday! Early bird tickets available now 🎊
            <Sparkles className="w-5 h-5" />
          </motion.div>
        </motion.div>
      )}

    
      {/* Hero Section with Background Image */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Background Image */}
        {/* <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div> */}
          <AnimatePresence mode="wait">
            <motion.div
              key={bgIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0"
            >
              <Image
                src={bgImages[bgIndex]}
                alt="Hero background"
                fill
                className="object-cover"
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>
          </AnimatePresence>
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {/* Main heading */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6">
              <span className="text-white">Connect</span>
              <br />
              <span className="bg-gradient-to-r from-[#F7D330] to-[#FF6B6B] bg-clip-text text-transparent">
                Beyond Screens
              </span>
            </h1>
            
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "200px" }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 bg-gradient-to-r from-[#F7D330] to-[#FF6B6B] mx-auto rounded-full"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-white/90 mt-8 mb-10 max-w-2xl mx-auto"
          >
            Join real-world experiences that spark joy and create lasting memories with amazing people
          </motion.p>

          {/* Stats bar */}
          {/* <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center gap-8 mb-10"
          >
            {[
              { value: "500+", label: "Events" },
              { value: "10k+", label: "Members" },
              { value: "50+", label: "Cities" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold text-[#F7D330]">{stat.value}</div>
                <div className="text-sm text-white/80">{stat.label}</div>
              </div>
            ))}
          </motion.div> */}

          {/* CTA Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
          >
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 bg-gradient-to-r from-[#F7D330] to-[#FF6B6B] text-white rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                Discover Events Near You
              </motion.button>
            </Link>
          </motion.div>

          {/* Rating Badge */}
          {/* <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: "spring" }}
            className="absolute bottom-10 right-10 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#F7D330] fill-[#F7D330]" />
              <span className="text-white font-semibold">4.9/5 Rating</span>
            </div>
          </motion.div> */}
        </div>
      </motion.section>

      {/* Event Gallery Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Recent Memories
            </h2>
            <p className="text-gray-600">Moments captured at our recent events</p>
          </div>
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('left')}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-white/20"
            >
              <ChevronLeft className="w-5 h-5 text-[#3AA3A0]" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => scroll('right')}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all border border-white/20"
            >
              <ChevronRight className="w-5 h-5 text-[#3AA3A0]" />
            </motion.button>
          </div>
        </motion.div>

        <div className="relative">
          <div
            ref={scrollContainer}
            className="flex overflow-x-auto scrollbar-hide pb-6 gap-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {eventImages.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex-shrink-0 w-[350px] h-[450px] rounded-2xl overflow-hidden shadow-xl group"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Image caption */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                  >
                    <p className="text-lg font-semibold">{image.alt}</p>
                    {/* <div className="flex items-center gap-2 mt-2 text-sm text-white/80"> */}
                      {/* <Calendar className="w-4 h-4" />
                      <span>March 2024</span> */}
                    {/* </div> */}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid - Now with 6 items in 2 rows */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Why Join Our Community?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the best of real-world connections with our carefully curated features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredFeature(index)}
              onHoverEnd={() => setHoveredFeature(null)}
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 h-full">
                {/* Icon with animated background */}
                <div className={`relative mb-6 inline-block ${feature.bgColor} p-4 rounded-xl`}>
                  <motion.div
                    animate={{ rotate: hoveredFeature === index ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                    className={`text-transparent bg-gradient-to-r ${feature.color} bg-clip-text`}
                  >
                    {feature.icon}
                  </motion.div>
                  
                  {/* Floating sparkle for festive mode */}
                  {FESTIVE_MODE && hoveredFeature === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1, 0] }}
                      transition={{ duration: 0.8 }}
                      className="absolute -top-2 -right-2 text-[#F7D330]"
                    >
                      ✨
                    </motion.div>
                  )}
                </div>

                <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 mb-4">
                  {feature.text}
                </p>

                {/* Stats badge */}
                <div className={`inline-block px-3 py-1 ${feature.bgColor} rounded-full text-sm font-medium`}>
                  {feature.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Events Preview */}
      {/* <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                Upcoming This Week
              </h2>
              <p className="text-gray-600">Don't miss out on these amazing experiences</p>
            </div>
            <Link href="/events">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 md:mt-0 px-6 py-2 bg-gradient-to-r from-[#3AA3A0] to-[#F7D330] text-white rounded-full font-medium hover:shadow-lg transition-all"
              >
                View All Events
              </motion.button>
            </Link>
          </div>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gradient-to-r from-[#3AA3A0]/10 to-[#F7D330]/10 rounded-lg">
                    {event.icon}
                  </div>
                  <span className="text-sm font-semibold text-[#3AA3A0]">{event.date}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">{event.name}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{event.attendees} attending</span>
                </div>
              </motion.div>
            ))}
          </div> 
        </motion.div>
      </section> */}

      {/* CTA Banner */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#3AA3A0] to-[#F7D330] p-12 text-center"
        >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }} />
          </div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 relative z-10">
            Ready to Join the Fun?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto relative z-10">
            Find your next adventure and meet amazing people in your area
          </p>
          
          <Link href="/events">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative z-10 px-10 py-4 bg-white text-[#3AA3A0] rounded-full text-lg font-bold shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Events</span>
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </Link>

          {/* Floating elements */}
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          />
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          />
        </motion.div>
      </section>
    </div>
  );
}