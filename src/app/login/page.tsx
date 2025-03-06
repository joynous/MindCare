"use client";

import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      setError('Both fields are required');
    } else {
      setError('');
      console.log('Logging in with:', { email, password });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Welcome Back</h1>
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input 
              type="email" 
              placeholder="Email" 
              className="w-full outline-none" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full outline-none" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-black text-white rounded-lg py-2" onClick={handleLogin}>Sign In</button>
          <div className="text-center text-sm text-gray-500">
            Don't have an account? <a href="/signup" className="text-black underline">Sign up here</a>
          </div>
        </div>
      </div>
    </div>
  );
}
