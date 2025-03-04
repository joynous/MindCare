export default function About() {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">
              Our Mission to Reconnect
            </h1>
  
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-orange-600">The Digital Dilemma</h2>
                <p className="text-gray-600 leading-relaxed">
                  While social media promised connection, it left many feeling isolated. Our community 
                  addresses this paradox by creating tech-conscious spaces where real relationships flourish.
                </p>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <p className="text-sm text-orange-700">
                    📱 72% of members report reduced social media usage after joining
                  </p>
                </div>
              </div>
  
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-orange-600">How We Connect</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="font-medium mb-2">Weekly Meetups</h3>
                    <p className="text-sm text-gray-600">
                      Every Saturday in 15+ cities - from coffee chats to outdoor adventures
                    </p>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-xl">
                    <h3 className="font-medium mb-2">Activity-Based Bonding</h3>
                    <p className="text-sm text-gray-600">
                      Collaborative cooking, team sports, art jams - connections through shared doing
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-orange-600">Our Community Values</h2>
                <div className="flex flex-wrap gap-4">
                  {['Presence Over Posts', 'Vulnerability', 'Active Listening', 'No Phones Zone'].map((value) => (
                    <div key={value} className="bg-white border-2 border-orange-100 px-4 py-2 rounded-full">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="bg-orange-50 p-6 rounded-xl text-center">
                <p className="text-lg font-medium mb-2">Ready to Unplug?</p>
                <p className="text-sm text-gray-600 mb-4">
                  Join 5,000+ members who've found deeper connections offline
                </p>
                <button className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }