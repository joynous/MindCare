// components/Footer.tsx
'use client';
import Link from 'next/link';
import { Instagram, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {

  return (
    <footer className="bg-gray-900 text-gray-100 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#F7D330] mb-4">Joynous Community</h3>
            <p className="text-sm text-gray-400">
              Building real connections through offline experiences and shared activities
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
        
            <h3 className="text-lg font-bold text-[#F7D330] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-gray-300 hover:text-[#8AE2E0]">Events</Link></li>
              <li><Link href="/trips-landing" className="text-gray-300 hover:text-[#8AE2E0]">Trips</Link></li>
              <li><Link href="/login" className="text-gray-300 hover:text-[#8AE2E0]">Login</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-[#8AE2E0]">About Us</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#F7D330] mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/communityGuidelines" className="text-gray-300 hover:text-[#8AE2E0]">Community Guidelines</Link></li>
            </ul>
          </div>

          {/* Social & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#F7D330] mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/_joynous_?igsh=am55YTh6ZmdiaTV4" target='_blank' className="p-2 bg-gray-800 rounded-full hover:bg-[#3AA3A0]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://chat.whatsapp.com/E8TtSo1ITfiJaAJx0d4nLl?fbclid=PAY2xjawJCFfhleHRuA2FlbQIxMQABppqLn9-EKFA-zcwhRWUHrO0me2uKv3__SjqQ2lEhYksuqzjYJZR-6pIxLA_aem_R4x79czzDf8tCbfQ4c9cjQ" target='_blank' className="p-2 bg-gray-800 rounded-full hover:bg-[#3AA3A0]">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="mailTo:support@joynous.cc" target='_blank' className="p-2 bg-gray-800 rounded-full hover:bg-[#3AA3A0]">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Join our newsletter</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Enter email"
                  className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-[#F7D330]"
                />
                <button className="px-4 py-2 bg-[#F7D330] text-gray-900 rounded-lg hover:bg-[#F7DD80]">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Joynous. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}