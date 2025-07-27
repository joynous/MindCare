'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import SessionTimeoutModal from './SessionTimeoutModal';
import { Session } from '@supabase/supabase-js';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [session, setSession] = useState<null | Session>(null);
  const [showTimeout, setShowTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // how long until we show the modal (for testing this is 0.01 * 60s)
  const INACTIVITY_LIMIT = 20 * 60 * 1000;

  // 1) Listen for changes in auth state
  useEffect(() => {
    // get initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // subscribe to login / logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 2) Only start/reset timers when there's an active session
  useEffect(() => {
    if (!session) {
      // if logged out, clear any pending timer & hide modal
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setShowTimeout(false);
      return;
    }

    // whenever user does something, reset the timer
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowTimeout(true);
      }, INACTIVITY_LIMIT);
    };

    // wire up our activity events
    resetTimer();
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
    ];
    for (const e of events) window.addEventListener(e, resetTimer);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      for (const e of events) window.removeEventListener(e, resetTimer);
    };
  }, [session]);

  const handleContinue = () => {
    setShowTimeout(false);
    // restart inactivity clock
    if (session) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowTimeout(true), INACTIVITY_LIMIT);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // auth listener will clear modal & timer for us
    router.push('/login');
  };

  return (
    <>
      {/* 3) only show this if we're still logged in */}
      {session && showTimeout && (
        <SessionTimeoutModal
          onContinue={handleContinue}
          onLogout={handleLogout}
        />
      )}
      {children}
    </>
  );
}
