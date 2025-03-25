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
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center space-x-2">
                    <span className="text-orange-500">▹</span>
                    <span>Discover new personal growth and self-development skills</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-orange-500">▹</span>
                    <span>Participate in fun, interactive, and engaging activities</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-orange-500">▹</span>
                    <span>Connect with like-minded, positive people</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-orange-500">▹</span>
                    <span>Learn valuable insights and practical tips related to mental health</span>
                  </li>
                </ul>
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

      {/* Updated social links section in app/page.tsx */}
<section className="container mx-auto px-4 py-12 text-center">
  <h3 className="text-2xl font-semibold text-gray-800 mb-6">
    Connect with Our Community
  </h3>
  <p className="text-gray-600 max-w-xl mx-auto mb-8">
    Join our WhatsApp group for event updates and coordination (messages limited to practical info)
  </p>
  
  <div className="flex justify-center space-x-6">
    <a
      href="https://chat.whatsapp.com/E8TtSo1ITfiJaAJx0d4nLl?fbclid=PAY2xjawJCFfhleHRuA2FlbQIxMQABppqLn9-EKFA-zcwhRWUHrO0me2uKv3__SjqQ2lEhYksuqzjYJZR-6pIxLA_aem_R4x79czzDf8tCbfQ4c9cjQ" // Replace with your WhatsApp group link
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
      aria-label="WhatsApp group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
        <path d="M8 12h8"/>
        <path d="M12 16V8"/>
      </svg>
    </a>

    {/* Keep other links the same */}
    <a
      href="https://www.instagram.com/_joynous_?igsh=am55YTh6ZmdiaTV4"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
      aria-label="Instagram profile"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    </a>

    <a
      href="mailto:community@example.com"
      className="p-3 rounded-full bg-orange-100 hover:bg-orange-200 transition-colors"
      aria-label="Email us"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    </a>
  </div>

  <p className="text-sm text-gray-500 mt-6">
    WhatsApp group rules: No forwards, no spam, event info only
  </p>
</section>

    <footer className="font-sans bg-gray-100 p-10 text-gray-800">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
        {/* Newsletter Section */}
        <div className="w-full md:w-1/2 mb-8">
          <h2 className="text-2xl mb-4">Stay Connected with Us</h2>
          <form className="flex flex-wrap gap-3 mb-4">
            <input
              type="email"
              placeholder="Enter Your Email *"
              required
              className="px-4 py-2 border border-gray-300 rounded flex-grow min-w-[200px]"
            />
            <button 
              type="submit"
              className="px-5 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </button>
            <div className="flex items-center gap-3 w-full">
              <input
                type="checkbox"
                id="newsletter"
                defaultChecked
                className="w-4 h-4"
              />
              <label htmlFor="newsletter" className="text-sm">
                Yes, Subscribe me to newsletter
              </label>
            </div>
          </form>
        </div>

        {/* Contact Info */}
        <div className="w-full md:w-2/5 mb-8 leading-relaxed">
          <p className="mb-1">123-456-7890</p>
          <p className="mb-4">info@mystie.com</p>
          <p>
            500 Terry Francine Street, 6th Floor,<br />
            San Francisco, CA 94158
          </p>
        </div>

        {/* Footer Links */}
        <div className="w-full flex flex-wrap gap-4 mb-6">
          <a href="#" className="text-gray-800 hover:text-gray-600 transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600 transition-colors">
            Accessibility Statement
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600 transition-colors">
            Terms & Conditions
          </a>
          <a href="#" className="text-gray-800 hover:text-gray-600 transition-colors">
            Refund Policy
          </a>
        </div>

        {/* Copyright */}
        <div className="w-full text-center mt-6 text-sm text-gray-600">
          © 2035 by JOYNOUS. Powered and secured by Wix
        </div>
      </div>
    </footer>
      </div>
    </div>
    
  );
}