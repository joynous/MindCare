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
            <Link href="https://docs.google.com/forms/d/1HBYyI0L43N-kTbfaUspzQwk-K8O81a6xPEiflmCbOWw" passHref target="_blank" rel="noopener noreferrer">
            <button className="bg-orange-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-orange-600 transition-all cursor-pointer">
              Join Next Meetup →
            </button>
            </Link>
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
      </div>
    </div>
    
  );
}