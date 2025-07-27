'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcryptjs';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password !== confirm) { setError("Passwords don't match"); return; }
    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw new Error(authError.message);
      const userId = data.user?.id;
      if (!userId) throw new Error('User ID not returned');
      const hashedPassword = await bcrypt.hash(password, 10);
      const { error: dbError } = await supabase.from('users').insert({
        id: userId,
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        mobile_number: mobile,
      });
      if (dbError) throw new Error(dbError.message);
      setMessage('Registration successful! Please check your email to confirm.');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      console.error('Registration error:', err);
      setError('Please try again, registration has failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-amber-50 overflow-hidden">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg dark:shadow-black/20">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {(error || message) && (
            <p className={`text-sm ${error ? 'text-red-500' : 'text-green-600'}`}>{error || message}</p>
          )}
          <div><label htmlFor="firstName" className="block text-gray-700 dark:text-gray-300 mb-1">First Name</label>
            <input id="firstName" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <div><label htmlFor="lastName" className="block text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
            <input id="lastName" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <div><label htmlFor="mobile" className="block text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
            <input id="mobile" type="tel" required pattern="[0-9]{10,15}" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <div><label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <div><label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input id="password" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <div><label htmlFor="confirm" className="block text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input id="confirm" type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#3AA3A0]" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#F7D330] hover:bg-[#F7DD80] text-[#1A2E35] dark:text-gray-900 font-medium py-2 rounded transition disabled:opacity-50">{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">Already have an account? <a href="/login" className="text-[#3AA3A0] hover:underline">Login</a></p>
      </div>
    </div>
  );
}
