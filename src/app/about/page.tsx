'use client';
import { motion } from 'framer-motion';
import { HeartHandshake, Sparkles, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const values = [
    { 
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Authentic Connections",
      text: "Fostering real friendships through shared experiences"
    },
    { 
      icon: <Sparkles className="w-8 h-8" />,
      title: "Joyful Engagement",
      text: "Curating activities that spark happiness and creativity"
    },
    { 
      icon: <Trophy className="w-8 h-8" />,
      title: "Inclusive Wins",
      text: "Celebrating every member's unique contributions"
    }
  ];

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-b from-orange-50 to-amber-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-16 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#3AA3A0] to-[#F7D330] bg-clip-text text-transparent mb-6">
          Our Story
        </h1>
        <p className="text-xl text-[#1A2E35] dark:text-[#1A2E35]/90 max-w-3xl mx-auto">
          From a small group of friends to a nationwide movement fostering real human connections
        </p>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-[#3AA3A0]/10 dark:bg-[#3AA3A0]/20 py-12"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-[#1A2E35] dark:text-[#1A2E35]/90 mb-12 text-center">
            Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white dark:bg-white/90 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-center mb-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    className="bg-[#F7D330] dark:bg-[#F7D330]/90 p-3 rounded-full"
                  >
                    {value.icon}
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 text-[#1A2E35] dark:text-[#1A2E35]/90">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-[#1A2E35]/80 text-center">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-[#1A2E35] dark:bg-[#1A2E35]/90 text-[#F7FFF7] dark:text-[#F7FFF7]/90 py-16 mt-12"
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Join the Movement?
          </h2>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block"
          >
            <Link
              href="/events"
              className="bg-[#F7D330] dark:bg-[#F7D330]/90 text-[#1A2E35] dark:text-[#1A2E35]/90 px-8 py-3 rounded-full text-lg font-bold hover:bg-[#F7DD80] dark:hover:bg-[#F7D330]/80 transition-colors"
            >
              Find Your First Event
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}