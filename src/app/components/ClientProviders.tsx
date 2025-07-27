// src/app/components/ClientProviders.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import SessionTimeoutModal from './SessionTimeoutModal';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [showTimeout, setShowTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const INACTIVITY_LIMIT = 20 * 60 * 1000;

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowTimeout(true), INACTIVITY_LIMIT);
  };

  useEffect(() => {
    resetTimer();
    const events = ['mousemove','mousedown','keydown','touchstart','scroll'] as const;
    events.forEach(e => window.addEventListener(e, resetTimer));
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);

  const handleContinue = () => {
    setShowTimeout(false);
    resetTimer();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <>
      {showTimeout && (
        <SessionTimeoutModal
          onContinue={handleContinue}
          onLogout={handleLogout}
        />
      )}
      {children}
    </>
  );
}
