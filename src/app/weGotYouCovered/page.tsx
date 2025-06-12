'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Users, Activity, Heart, Calendar, ChevronDown } from 'lucide-react';

export default function WeGotYouCoveredPage() {
  const problems = [
    "No plans on weekend",
    "No friends to meet on weekend",
    "Bored of same old 9 to 5 routine",
    "Facing issues communicating with people",
    "Difficulty expressing yourself to others"
  ];

  const solutions = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Real Connections",
      text: "Meet like-minded people in a safe, welcoming environment"
    },
    {
      icon: <Activity className="w-6 h-6" />,
      title: "Interactive Activities",
      text: "Engage in brain-stimulating games and team challenges"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Mental Wellness",
      text: "Activities designed to boost confidence and reduce anxiety"
    }
  ];

  const galleryImages = [
    { id: 1, src: "/images/events/event-21.webp", alt: "express emotions in drawing" },
    { id: 2, src: "/images/events/event-3.webp", alt: "pick the cone" },
    { id: 3, src: "/images/events/event-31.webp", alt: "3rd offline meetup" },
    { id: 4, src: "/images/events/event-1.webp", alt: "Machine game" }
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Enhanced Hero Section with Image Collage */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
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

        {/* Mobile background image */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src="/images/events/event-21.webp"
            alt="Community event background"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2E35]/70 to-[#1A2E35]/40"></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8,
                delay: 0.2
              }}
            >
              <span className="block bg-gradient-to-r from-[#F7D330] to-[#3AA3A0] bg-clip-text text-transparent mb-2">
                Tired of Lonely Weekends?
              </span>
              <span className="block text-white text-4xl md:text-5xl mt-4 drop-shadow">
                We&apos;ve Got Your Back
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-white max-w-2xl mx-auto mb-10 drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Transform solitary weekends into meaningful connections through fun activities
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/events"
                  className="bg-[#3AA3A0] hover:bg-[#2E827F] text-white px-8 py-4 rounded-full text-lg md:text-xl font-bold transition-colors flex items-center gap-3"
                >
                  <Calendar className="w-6 h-6" />
                  Join Our Next Event
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="#solution"
                  className="bg-white hover:bg-gray-100 text-[#1A2E35] border border-[#3AA3A0] px-8 py-4 rounded-full text-lg md:text-xl font-bold transition-colors flex items-center gap-3"
                >
                  Learn How It Works
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
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

      {/* Rest of the page remains the same */}
      {/* Problem Section */}
      <motion.section 
        id="problem"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 md:py-24"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-red-100 p-2 rounded-full">
              <div className="bg-red-500 w-6 h-6 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">!</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#1A2E35]">The Weekend Struggle</h2>
          </div>
          
          <div className="space-y-4 pl-4">
            {problems.map((problem, index) => (
              <motion.div 
                key={index}
                initial={{ x: -20 }}
                whileInView={{ x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="bg-red-500 rounded-full w-2 h-2 mt-2.5 flex-shrink-0"></div>
                <p className="text-xl text-[#1A2E35] font-medium">{problem}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-8 p-4 bg-red-50 rounded-lg border-l-4 border-red-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
          >
            <p className="text-red-700 font-medium">
              If you&apos;re nodding to any of these, you&apos;re not alone. Millions feel disconnected on weekends.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Solution Section */}
      <motion.section 
        id="solution"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container mx-auto px-4 py-12 md:py-24"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-2 rounded-full">
              <div className="bg-green-500 w-6 h-6 rounded-full flex items-center justify-center">
                <Sparkles className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-[#1A2E35]">Our Solution</h2>
          </div>
          
          <motion.div 
            className="bg-green-50 p-6 rounded-xl mb-8"
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
          >
            <p className="text-xl text-[#1A2E35] mb-4 font-medium">
              <span className="font-bold">We transform lonely weekends</span> into opportunities for connection, growth, and joy through our carefully curated meetups.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              {solutions.map((solution, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-white p-4 rounded-lg shadow-md border border-green-100"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-500 p-2 rounded-full text-white">
                      {solution.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-[#1A2E35]">{solution.title}</h3>
                  </div>
                  <p className="text-gray-700">{solution.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-[#1A2E35] mb-4">What to Expect at Our Meetups:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Ice-breaking sessions to help you connect naturally",
                "Brainstorming games to spark creativity",
                "Physical activities to energize your body",
                "Mindfulness exercises to calm your mind",
                "Group discussions to share perspectives",
                "Creative workshops to express yourself"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -20 }}
                  whileInView={{ x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 bg-orange-50 p-3 rounded-lg"
                >
                  <div className="bg-[#3AA3A0] rounded-full w-2 h-2 mt-2.5 flex-shrink-0"></div>
                  <span className="text-[#1A2E35] font-medium">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

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
        <div className="bg-[#3AA3A0] rounded-2xl p-8 max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Weekends?
          </h2>
          <p className="text-white/90 mb-8 text-xl">
            Join our next event and experience the difference
          </p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              href="/events"
              className="bg-[#F7D330] text-[#1A2E35] px-8 py-4 rounded-full text-xl font-bold hover:bg-[#F7DD80] transition-colors flex items-center gap-3"
            >
              <Calendar className="w-6 h-6" />
              View Upcoming Events
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}