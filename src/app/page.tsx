// app/page.tsx (Home)
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Sparkles, Users, Calendar, MessageSquare, ChevronLeft, ChevronRight, ArrowDown } from 'lucide-react';
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
  const showArrow = true;

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
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#F7D330','#3AA3A0','#FF6B6B','#8AE2E0'] });
    };
    triggerConfetti();
    const confInterval = setInterval(triggerConfetti, 10000);
    const sparkInterval = setInterval(() => setSparkleKey(k => k+1), 1500);
    return () => {
      clearInterval(confInterval);
      clearInterval(sparkInterval);
    };
  }, []);

  const scroll = (direction: 'left'|'right') => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({ left: direction==='left'? -500:500, behavior:'smooth' });
    }
  };

  const renderSparkles = () => {
    if (!FESTIVE_MODE) return null;
    return Array.from({ length: 30 }).map((_, i) => {
      const size = Math.random()*20+5;
      return (
        <motion.div key={`${sparkleKey}-${i}`} className="absolute text-2xl" style={{ left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, fontSize:`${size}px`, opacity:0 }} animate={{ y:[0,-50,0], x:[0,(Math.random()-0.5)*50], rotate:[0,360], opacity:[0,0.8,0] }} transition={{ duration:1+Math.random()*2, ease:'easeInOut' }}>
          ✨
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 overflow-hidden">
      {FESTIVE_MODE && <div className="fixed inset-0 pointer-events-none z-50">{renderSparkles()}</div>}

      <motion.section className="container mt-10 mx-auto px-4 py-16 text-center relative overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Greeting with styled name */}
        {firstName && (
          <p className="text-lg text-gray-700 mb-4">
            Hey,&nbsp;
            <span className="text-teal-600 font-semibold underline decoration-yellow-300">
              {firstName}
            </span>
            .
          </p>
        )}

        {FESTIVE_MODE && (
          <motion.div initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5}} className="absolute top-4 left-0 right-0 bg-gradient-to-r from-[#FF6B6B] to-[#F7D330] py-2 text-white font-bold text-lg text-center z-50">
            🎊 Joynous Fest coming sunday! 🎊
          </motion.div>
        )}
        
        {/* Floating Background Elements */}
        <motion.div
          className="absolute top-20 left-1/4 w-24 h-24 bg-[#F7D330]/20 dark:bg-[#F7D330]/30 rounded-full blur-xl"
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
            <span className="text-[#1A2E35] dark:text-[#1A2E35]/90">Beyond Screens</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl text-[#1A2E35] dark:text-[#1A2E35]/90 mb-8 max-w-2xl mx-auto"
          >
            Join real-world experiences that spark joy and create lasting memories
          </motion.p>

          {/* Arrow pointing to button (festive mode only) */}
          {FESTIVE_MODE && showArrow && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex justify-center mb-4"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  repeatType: "loop"
                }}
              >
                <ArrowDown className="w-8 h-8 text-[#FF6B6B] animate-bounce" />
              </motion.div>
            </motion.div>
          )}

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative"
          >
            {/* Festive sparkles around button (more frequent) */}
            {FESTIVE_MODE && (
              <motion.div
                key={`sparkle-${sparkleKey}`}
                className="absolute -inset-2 rounded-full bg-[#F7D330]/20"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.8, opacity: [0.3, 0.8, 0] }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut"
                }}
              />
            )}
            
            <Link
              href="/events"
              className="relative bg-[#F7D330] dark:bg-[#F7D330]/90 text-[#1A2E35] dark:text-[#1A2E35]/90 px-8 py-3 rounded-full text-lg font-bold hover:bg-[#F7DD80] dark:hover:bg-[#F7D330]/80 transition-colors flex items-center gap-2 z-10"
            >
              <Sparkles className="w-5 h-5" />
              {FESTIVE_MODE ? "Join Joynous Fest Now!" : "Join Us for Next Event"}
            </Link>
            
            {/* Additional sparkles (festive mode only) - More frequent */}
            {FESTIVE_MODE && (
              <>
                <motion.div
                  className="absolute -top-4 -right-4 text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0.5
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -top-4 -left-4 text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 0
                  }}
                >
                  ✨
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -right-4 text-2xl"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 360],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1.5
                  }}
                >
                  ✨
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Event Gallery Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-[#1A2E35] dark:text-[#1A2E35]/90">
            Recent Memories
          </h2>
          <div className="flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-[#F7D330] dark:bg-[#F7D330]/90 hover:bg-[#F7DD80] dark:hover:bg-[#F7D330]/80"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-[#1A2E35] dark:text-[#1A2E35]/90" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-[#F7D330] dark:bg-[#F7D330]/90 hover:bg-[#F7DD80] dark:hover:bg-[#F7D330]/80"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-[#1A2E35] dark:text-[#1A2E35]/90" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div
            ref={scrollContainer}
            className="flex overflow-x-auto scrollbar-hide pb-4 gap-4"
          >
            {eventImages.map((image) => (
              <motion.div 
                key={image.id}
                className="relative flex-shrink-0 w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
                whileHover={{ y: -10 }}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-black/50 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">
                      {image.alt}
                    </p>
                  </div>
                </div>
              </motion.div>
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
        <h2 className="text-3xl font-bold text-[#1A2E35] dark:text-[#1A2E35]/90 mb-12 text-center">
          Why Join Our Community?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Users className="w-8 h-8 text-[#3AA3A0] dark:text-[#3AA3A0]/90" />,
              title: "Meet New People",
              text: "Connect with like-minded individuals in your area"
            },
            {
              icon: <Calendar className="w-8 h-8 text-[#F7D330] dark:text-[#F7D330]/90" />,
              title: "Weekly Events",
              text: "Curated activities from board games to outdoor adventures"
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-[#8AE2E0] dark:text-[#8AE2E0]/90" />,
              title: "Safe Space",
              text: "Inclusive environment with strict safety guidelines"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white dark:bg-white/90 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden"
            >
              {/* Festive corner accent (festive mode only) */}
              {FESTIVE_MODE && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FF6B6B]/10 transform rotate-45 translate-x-8 -translate-y-8" />
              )}
              
              <div className="flex justify-center mb-4 relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {feature.icon}
                </motion.div>
              </div>
              <h3 className="text-xl font-semibold text-[#1A2E35] dark:text-[#1A2E35]/90 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-[#1A2E35]/80">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}