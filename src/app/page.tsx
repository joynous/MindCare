import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { eventImages } from './data/event';

// Replace the Home component with this updated version
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

              {/* Event Photos Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Moments from Our Gatherings
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Glimpses of real connections and genuine smiles from our recent meetups
          </p>
        </div>
        {/* Scrollable Gallery */}
        <div className="relative group">
          <div className="flex overflow-x-auto pb-6 scrollbar-hide space-x-4 snap-x snap-mandatory">
            {eventImages.map((image) => (
              <figure 
                key={image.id}
                className="relative flex-shrink-0 w-[300px] h-[400px] rounded-2xl overflow-hidden shadow-lg snap-center group-hover:opacity-75 transition-opacity"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
                <figcaption className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-sm">
                  {image.alt}
                </figcaption>
              </figure>
            ))}
          </div>
          
          {/* Scroll Hint */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight className="w-6 h-6 text-orange-500 animate-pulse-horizontal" />
          </div>
        </div>

        {/* Caption */}
      <Link 
        href="/gallery" 
        className="text-center text-orange-600 mt-6 text-sm hover:underline inline-block w-full"
      >
        Swipe or drag to see more memories →
      </Link>
      </section>


        

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