'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

// Feature flag for festive mode
const FESTIVE_MODE = process.env.NEXT_PUBLIC_FESTIVE_MODE === 'true';

export default function WeGotYouCoveredPage() {
  const [sparkleKey, setSparkleKey] = useState(0); // Key to force re-render sparkles


  const galleryImages = [
    { id: 1, src: "/images/events/event-37.jpg", alt: "gurgaon stranger meetup" },
    { id: 2, src: "/images/events/event-35.jpg", alt: "trekk meetup" },
    { id: 3, src: "/images/events/event-31.webp", alt: "3rd offline meetup" },
    { id: 4, src: "/images/events/event-36.jpg", alt: "stranger meetup at lazy monk" }
  ];

  // Floating animation variants
  const floatingVariants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Image collage positions
  const imagePositions = [
    { top: "15%", left: "5%", rotate: -5, width: "30%" },
    { top: "10%", right: "5%", rotate: 3, width: "35%" },
    { bottom: "20%", left: "12%", rotate: 2, width: "32%" },
    { bottom: "15%", right: "8%", rotate: -4, width: "28%" }
  ];

  // Trigger confetti on page load (only in festive mode)
  useEffect(() => {
    if (!FESTIVE_MODE) return;
    
    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F7D330', '#3AA3A0', '#FF6B6B', '#8AE2E0']
      });
    };

    // Initial confetti
    triggerConfetti();
    
    // Periodic confetti every 10 seconds
    const confettiInterval = setInterval(triggerConfetti, 10000);
    
    // More frequent sparkles
    const sparkleInterval = setInterval(() => {
      setSparkleKey(prev => prev + 1);
    }, 1500); // Changed to 1.5 seconds for more frequent sparkles
    
    return () => {
      clearInterval(confettiInterval);
      clearInterval(sparkleInterval);
    };
  }, []);

  // Render sparkles with random positions
  const renderSparkles = () => {
    if (!FESTIVE_MODE) return null;
    
    return [...Array(30)].map((_, i) => {
      const size = Math.random() * 20 + 5;
      return (
        <motion.div
          key={`${sparkleKey}-${i}`}
          className="absolute text-2xl pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${size}px`,
            opacity: 0,
            zIndex: 10
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, (Math.random() - 0.5) * 50],
            rotate: [0, 360],
            opacity: [0, 0.8, 0]
          }}
          transition={{
            duration: 1 + Math.random() * 2,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 relative overflow-hidden">
      {/* Festive Sparkles */}
      {FESTIVE_MODE && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {renderSparkles()}
        </div>
      )}

      {/* Enhanced Hero Section with Image Collage */}
      <section className="relative h-screen overflow-hidden">
        {/* Festive Banner */}
        {FESTIVE_MODE && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-4 left-0 right-0 bg-gradient-to-r from-[#FF6B6B] to-[#F7D330] py-2 text-white font-bold text-lg text-center z-50"
          >
            🎊 Joynous Fest coming sunday! 🎊
          </motion.div>
        )}
        
        {/* Animated Background Elements */}
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2E35]/50 to-[#1A2E35]/20 md:from-[#3AA3A0]/10 md:to-[#F7D330]/10"></div>
          
          {/* Floating circles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${Math.random() * 100}%`,
                width: `${20 + Math.random() * 100}px`,
                height: `${20 + Math.random() * 100}px`,
                background: i % 2 === 0 
                  ? 'radial-gradient(circle, #3AA3A0 0%, transparent 70%)' 
                  : 'radial-gradient(circle, #F7D330 0%, transparent 70%)',
                opacity: 0.1 + Math.random() * 0.2
              }}
              variants={floatingVariants}
              animate="float"
            />
          ))}
          
          {/* Image Collage - Hidden on mobile */}
          <div className="hidden md:block">
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className="absolute rounded-2xl shadow-2xl overflow-hidden border-4 border-white"
                style={{
                  ...imagePositions[index],
                  aspectRatio: "3/4",
                  zIndex: index + 1,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                initial={{ opacity: 0, scale: 0.8, rotate: imagePositions[index].rotate + 10 }}
                animate={{ opacity: 1, scale: 1, rotate: imagePositions[index].rotate }}
                transition={{ 
                  duration: 0.8,
                  delay: 0.3 * index,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  zIndex: 10,
                  scale: 1.05,
                  rotate: imagePositions[index].rotate + (index % 2 === 0 ? -2 : 2),
                  transition: { duration: 0.3 }
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mobile background image - without blur */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src="/images/events/event-33.jpg"
            alt="Community event background"
            fill
            className="object-cover"
          />
          {/* Removed gradient overlay to prevent blurring */}
        </div>

        {/* Content */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end md:justify-center pb-20 md:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="container mx-auto px-4 text-center"
          >
            {/* Join Event Button with Festive Sparkles */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block relative"
            >
              {/* Festive sparkles around button */}
              {FESTIVE_MODE && (
                <>
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
                </>
              )}
              
              <Link
                href="/events"
                className="relative bg-[#3AA3A0] hover:bg-[#2E827F] text-white px-8 py-4 rounded-full text-lg md:text-xl font-bold transition-colors flex items-center gap-3 z-10"
              >
                <Calendar className="w-6 h-6" />
                {FESTIVE_MODE ? "Join Joynous Fest Now!" : "Join Our Next Event"}
              </Link>
            </motion.div>              
          </motion.div>
        </div>
        
        {/* Scroll indicator - positioned above the button on mobile */}
        <motion.div 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ 
              y: [0, 10, 0],
              opacity: [1, 0.7, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <ChevronDown className="w-10 h-10 text-white animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 md:py-24"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#1A2E35] mb-8 text-center">
            Glimpse of Our Past Meetups
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {galleryImages.map((image) => (
              <motion.div
                key={image.id}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-medium">{image.alt}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 md:py-24 text-center"
      >
        <div className="bg-[#3AA3A0] rounded-2xl p-8 max-w-2xl mx-auto relative overflow-hidden">
          {/* Festive accent */}
          {FESTIVE_MODE && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6B6B]/20 transform rotate-45 translate-x-16 -translate-y-16" />
          )}
          
          <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
            Ready to Transform Your Weekends?
          </h2>
          <p className="text-white/90 mb-8 text-xl relative z-10">
            Join our next event and experience the difference
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block relative"
          >
            {/* Festive sparkles around button */}
            {FESTIVE_MODE && (
              <>
                <motion.div
                  key={`cta-sparkle-${sparkleKey}`}
                  className="absolute -inset-2 rounded-full bg-[#F7D330]/20"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.8, opacity: [0.3, 0.8, 0] }}
                  transition={{
                    duration: 1.5,
                    ease: "easeOut"
                  }}
                />
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
              </>
            )}
            
            <Link
              href="/events"
              className="relative bg-[#F7D330] text-[#1A2E35] px-8 py-4 rounded-full text-xl font-bold hover:bg-[#F7DD80] transition-colors flex items-center gap-3 z-10"
            >
              <Calendar className="w-6 h-6" />
              {FESTIVE_MODE ? "Join Joynous Fest Now!" : "View Upcoming Events"}
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}