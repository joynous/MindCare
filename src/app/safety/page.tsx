'use client';
import { ShieldAlert, Clock, Lock, Users, Heart, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyPage() {
    const guidelines = [
        { 
          icon: <Users className="w-6 h-6" />, 
          title: "Respect for All", 
          text: "Treat every individual with kindness and respect..."
        },
        { 
          icon: <Heart className="w-6 h-6" />,  // Changed from HeartHandshake
          title: "Safe Space", 
          text: "This is a judgment-free zone..."
        },
        { 
          icon: <Lock className="w-6 h-6" />, 
          title: "Privacy Matters", 
          text: "Respect the privacy of others..."
        },
        { 
          icon: <ShieldAlert className="w-6 h-6" />, 
          title: "Zero Tolerance", 
          text: "If a complaint is raised..."
        },
        { 
          icon: <Clock className="w-6 h-6" />, 
          title: "Punctuality", 
          text: "Be on time for events..."
        },
        { 
          icon: <AlertCircle className="w-6 h-6" />,  // Changed from MessageSquareWarning
          title: "Participation", 
          text: "Engage actively but respectfully..."
        }
      ];
    

  return (
    <div className="min-h-screen bg-gray-50 py-12 mt-10">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-teal-600 mb-4">
            Community Safety Guidelines
          </h1>
          <p className="text-gray-600 text-lg">
            Creating a safe and welcoming environment for everyone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guidelines.map((guideline, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start mb-4">
                <span className="text-teal-600 mr-3">{guideline.icon}</span>
                <h3 className="text-xl font-semibold text-gray-800">
                  {guideline.title}
                </h3>
              </div>
              <p className="text-gray-600 pl-9">{guideline.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 p-6 bg-teal-50 rounded-xl text-center"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-600">
            By joining our community, you agree to follow these policies to create a 
            supportive and enjoyable space for everyone. Together we maintain the 
            spirit of kindness and mutual respect.
          </p>
        </motion.div>
      </div>
    </div>
  );
}