// components/Navigation.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, HeartPulse, SmilePlus, Menu, X, Camera, SquareActivity } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: <SmilePlus size={20} /> },
    { name: 'Assessor', href: '/assessor', icon: <BrainCircuit size={20} /> },
    // { name: 'Blogs', href: '/blogs', icon: <PenBox size={20} /> },
    { name: 'About', href: '/about', icon: <HeartPulse size={20} /> },
    { name: 'Create event', href: '/admin/events/new', icon: <SquareActivity size={20} /> },
    { name: 'Gallery', href: '/gallery', icon: <Camera size={20} /> },
  ];

  return (
    <nav className="bg-[#F9BF04]/80 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo with Link */}
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          <Link 
            href="/" 
            className="hover:opacity-80 transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          >
            <img src='favicon.png' height={50} width={50}/>
          </Link>
        </span>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                pathname === link.href
                  ? 'bg-[#F9BF04] text-white'
                  : 'text-gray-700 hover:bg-[#F9BF04]/20'
              }`}
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#F9BF04]/20 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-lg ${isMenuOpen ? 'block' : 'hidden'}`}>
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  pathname === link.href
                    ? 'bg-[#F9BF04] text-white'
                    : 'text-gray-700 hover:bg-[#F9BF04]/10'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}