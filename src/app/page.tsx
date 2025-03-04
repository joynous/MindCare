export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Reconnect <span className="text-orange-600">Offline</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Break free from digital overload through real-world connections. Join our community of 
            people rediscovering the joy of face-to-face interactions.
          </p>
          <button className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition-all">
            Join Next Meetup → 
          </button>
        </div>

        {/* Weekly Events */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Weekly Activities</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-orange-500">▹</span>
                <span>Board Game Nights</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-orange-500">▹</span>
                <span>Community Hiking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-orange-500">▹</span>
                <span>Creative Workshops</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Why Join Us?</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <span className="text-orange-600">🌱</span>
                </div>
                <div>
                  <h4 className="font-medium">Digital Detox</h4>
                  <p className="text-sm text-gray-500">Phone-free interactions</p>
                </div>
              </div>
              {/* Add more benefit cards */}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Next Meetup</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <span className="text-2xl">🗓️</span>
                </div>
                <div>
                  <p className="font-medium">Saturday Morning</p>
                  <p className="text-sm text-gray-500">Community Center</p>
                </div>
              </div>
              {/* Add more meetup details */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}