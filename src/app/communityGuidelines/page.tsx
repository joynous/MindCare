'use client';
import { ShieldAlert, Clock, Lock, Users, Heart, AlertCircle, ListChecks, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SafetyPage() {
    const guidelines = [
        { 
          icon: <Users className="w-6 h-6" />, 
          title: "Respect for All", 
          text: "Treat every individual with kindness and respect. Harassment, hate speech, or stalking of any kind will not be tolerated." 
        },
        { 
          icon: <Heart className="w-6 h-6" />,
          title: "Safe Space", 
          text: "This is a judgment-free zone. Please refrain from making derogatory remarks or sharing offensive content." 
        },
        { 
          icon: <Lock className="w-6 h-6" />, 
          title: "Privacy Matters", 
          text: "Respect the privacy of others. Do not share personal information or discussions outside the community without explicit consent." 
        },
        { 
          icon: <ShieldAlert className="w-6 h-6" />, 
          title: "Zero Tolerance for Misconduct", 
          text: "If a complaint is raised, we will thoroughly investigate the matter and take appropriate action." 
        },
        { 
          icon: <Clock className="w-6 h-6" />, 
          title: "Punctuality", 
          text: "Be on time for events to ensure smooth participation for everyone." 
        },
        { 
          icon: <AlertCircle className="w-6 h-6" />,
          title: "Participation", 
          text: "Engage actively but respectfully during meetups, games, and discussions. Everyone deserves a chance to speak and be heard." 
        },
        // New policies added below
        { 
          icon: <ListChecks className="w-6 h-6" />, 
          title: "Follow Event Guidelines", 
          text: "Adhere to specific rules for games and activities as outlined during the event." 
        },
        { 
          icon: <MessageCircle className="w-6 h-6" />, 
          title: "Feedback Welcome", 
          text: "Share constructive feedback to help us improve the community experience." 
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
            By joining Joynous, you agree to follow these policies to create a 
            supportive and enjoyable space for everyone. Together we maintain the 
            spirit of kindness and mutual respect.
          </p>
        </motion.div>
      </div>
    </div>
  );
}