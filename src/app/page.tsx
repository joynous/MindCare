// app/page.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Users, Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { eventImages } from './data/event';
import Image from 'next/image';
import { useRef } from 'react';

export default function Home() {

  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F7FFF7] to-[#8AE2E0]/10">
      {/* Animated Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mt-10 mx-auto px-4 py-16 text-center relative overflow-hidden"
      >
        {/* Floating Background Elements */}
        <motion.div
          className="absolute top-20 left-1/4 w-24 h-24 bg-[#F7D330]/20 rounded-full blur-xl"
          animate={{
            y: [0, 30, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="relative z-10">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-[#3AA3A0] to-[#F7D330] bg-clip-text text-transparent">
              Connect
            </span>
            <br />
            <span className="text-[#1A2E35]">Beyond Screens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-[#1A2E35] mb-8 max-w-2xl mx-auto"
          >
            Join real-world experiences that spark joy and create lasting memories
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/events"  // Direct link to the event page
              className="bg-[#F7D330] text-[#1A2E35] px-8 py-3 rounded-full text-lg font-bold hover:bg-[#F7DD80] transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
                  Join Us for Next Event
              </Link>
          </motion.div>
        </div>
      </motion.section>

            {/* Event Gallery Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#1A2E35]">
            Recent Memories
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[#F7D330] hover:bg-[#F7DD80]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-[#1A2E35]" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[#F7D330] hover:bg-[#F7DD80]"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-[#1A2E35]" />
            </button>
          </div>
        </div>

        <div className="relative">
    <div
      ref={scrollContainer}
      className="flex overflow-x-auto scrollbar-hide pb-4 gap-4"
    >
      {eventImages.map((image) => (
        <div 
          key={image.id}
          className="relative flex-shrink-0 w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
        >
          {/* Image Container */}
          <div className="relative w-full h-full">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm font-medium">
                {image.alt}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
        </div>

      </section>

      {/* Features Grid */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="container mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold text-[#1A2E35] mb-12 text-center">
          Why Join Our Community?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-8 h-8 text-[#3AA3A0]" />,
              title: "Meet New People",
              text: "Connect with like-minded individuals in your area"
            },
            {
              icon: <Calendar className="w-8 h-8 text-[#F7D330]" />,
              title: "Weekly Events",
              text: "Curated activities from board games to outdoor adventures"
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-[#8AE2E0]" />,
              title: "Safe Space",
              text: "Inclusive environment with strict safety guidelines"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-[#1A2E35] mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}