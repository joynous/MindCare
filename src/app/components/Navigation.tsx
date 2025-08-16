// app/components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BrainCircuit, HeartPulse, SmilePlus, Menu, X, LogOut, PlusCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/', icon: <SmilePlus size={20} /> },
    { name: 'Mental Health Check', href: '/assessor', icon: <BrainCircuit size={20} /> },
    { name: 'About Us', href: '/about', icon: <HeartPulse size={20} /> },
  ];

  // Load profile (name + admin flag)
  const loadProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, is_admin')
        .eq('id', session.user.id)
        .single();
      if (!error && data) {
        setFirstName(data.first_name);
        setIsAdmin(data.is_admin);
      }
    } else {
      setFirstName(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    // Initial load
    loadProfile();
    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        loadProfile();
      } else {
        // On logout
        setFirstName(null);
        setIsAdmin(false);
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="bg-[#F9BF04]/80 backdrop-blur-md border-b border-gray-100 fixed w-full top-0 z-50 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" onClick={() => setIsMenuOpen(false)} className="flex items-center">
          <img src="/favicon.png" height={40} width={40} alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map(link => (
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

          {/* Admin: Create Event */}
          {isAdmin && (
            <Link
              href="/admin/events/new"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                pathname === '/admin/events/new'
                  ? 'bg-[#F9BF04] text-white'
                  : 'text-gray-700 hover:bg-[#F9BF04]/20'
              }`}
            >
              <PlusCircle size={20} />
              <span className="text-sm font-medium">Create Event</span>
            </Link>
          )}

          {/* Greeting & Logout (only when logged in) */}
          {firstName && (
            <>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-[#F9BF04]/20 transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
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

            {/* Admin: Create Event (mobile) */}
            {isAdmin && (
              <Link
                href="/admin/events/new"
                className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-[#F9BF04]/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusCircle size={20} />
                <span className="text-sm font-medium">Create Event</span>
              </Link>
            )}

            {/* Logout */}
            {firstName && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 p-3 text-gray-700 hover:text-red-600"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
