// components/Navigation.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrainCircuit, HeartPulse, SmilePlus } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/', icon: <SmilePlus size={20} /> },
    { name: 'Assessor', href: '/assessor', icon: <BrainCircuit size={20} /> },
    { name: 'About', href: '/about', icon: <HeartPulse size={20} /> },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          MindCare
        </span>
        <div className="flex space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                pathname === link.href
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {link.icon}
              <span className="text-sm font-medium">{link.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}