"use client";
import { JSX, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, LeafyGreen, Activity, MoonStar } from 'lucide-react';
interface Activity {
  title: string;
  desc: string;
}
interface MentalHealthData {
  keywords: string[];
  activities: Record<string, Activity[]>;
}

const mentalHealthData: MentalHealthData = {
  keywords: [
    'Anxiety', 'Stress', 'Sadness', 
    'Loneliness', 'Anger', 'Overwhelmed',
    'Fatigue', 'Insomnia', 'Low Motivation'
  ],
  
  activities: {
    'Anxiety': [
      { title: 'Deep Breathing', desc: 'Practice 4-7-8 breathing technique' },
      { title: 'Grounding Exercise', desc: 'Name 5 things you can see, 4 you can touch...' }
    ],
    'Stress': [
      { title: 'Progressive Relaxation', desc: 'Tense and relax muscle groups sequentially' },
      { title: 'Time Blocking', desc: 'Break tasks into 25-minute focused intervals' }
    ],
    'Sadness': [
      { title: 'Gratitude Journal', desc: 'Write down 3 things you appreciate' },
      { title: 'Nature Walk', desc: '15-minute walk in green space' }
    ],
    // Add more entries for other keywords
  }
};

const keywordIcons: Record<string, JSX.Element> = {
    'Anxiety': <LeafyGreen className="w-5 h-5" />,
    'Stress': <Activity className="w-5 h-5" />,
    'Loneliness': <MoonStar className="w-5 h-5" />,
    // Add icons for other keywords
  };
  

type KeywordType = typeof mentalHealthData.keywords[number];

export default function MentalHealthAssessor() {
  const [selectedKeywords, setSelectedKeywords] = useState<Set<KeywordType>>(new Set());
  const [showActivities, setShowActivities] = useState(false);
  
  const toggleKeyword = (keyword: KeywordType) => {
    const newKeywords = new Set(selectedKeywords);
    if (newKeywords.has(keyword)) {
      newKeywords.delete(keyword);
    } else {
      newKeywords.add(keyword);
    }
    setSelectedKeywords(newKeywords);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            How are you feeling today?
          </h1>
          
          {!showActivities ? (
            <>
              <p className="text-gray-600 mb-6 text-center">
                Select what resonates with your current state
              </p>
              <div className="grid grid-cols-2 gap-3">
                {mentalHealthData.keywords.map((keyword) => (
                  <motion.button
                    key={keyword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleKeyword(keyword)}
                    className={`p-4 rounded-xl flex items-center space-x-3 transition-all ${
                      selectedKeywords.has(keyword)
                        ? 'bg-purple-100 border-2 border-purple-200'
                        : 'bg-white hover:bg-gray-50 border-2 border-gray-100'
                    }`}
                  >
                    {keywordIcons[keyword] || <CheckCircle className="w-5 h-5" />}
                    <span className="text-gray-700 font-medium">{keyword}</span>
                  </motion.button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowActivities(true)}
                disabled={selectedKeywords.size === 0}
                className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Get Personalized Recommendations
              </motion.button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Curated Wellness Activities
              </h2>
              <div className="space-y-4">
                {Array.from(selectedKeywords).map((keyword) => (
                  mentalHealthData.activities[keyword]?.map((activity, index) => (
                    <motion.div
                      key={`${keyword}-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-gray-50 p-5 rounded-xl border-l-4 border-purple-500"
                    >
                      <h3 className="font-semibold text-purple-600 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{activity.desc}</p>
                    </motion.div>
                  ))
                ))}
              </div>
              <button
                onClick={() => {
                  setShowActivities(false);
                  setSelectedKeywords(new Set());
                }}
                className="mt-8 w-full bg-white text-purple-600 py-3 rounded-xl font-medium border-2 border-purple-100 hover:border-purple-200"
              >
                Start Over
              </button>
            </>
          )}
        </motion.div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p className="mb-2">Remember to breathe deeply and be kind to yourself 🌸</p>
          <div className="flex items-center justify-center space-x-4">
            <span className="h-px w-16 bg-gray-200" />
            <span>24/7 Support: 1-800-273-TALK</span>
            <span className="h-px w-16 bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  );
}