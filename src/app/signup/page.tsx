"use client";

import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;
    if (!regex.test(value)) {
      setError('Password should be 6 to 20 characters long with at least 1 numeric, 1 lowercase, and 1 uppercase letter');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md shadow-lg rounded-xl p-8 bg-white">
        <h1 className="text-2xl font-semibold text-center mb-6">Join Us Today</h1>
        <div className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <FaUser className="mr-2 text-gray-500" />
            <input type="text" placeholder="Name" className="w-full outline-none" />
          </div>
          <div className="flex items-center border rounded-lg p-2">
            <FaEnvelope className="mr-2 text-gray-500" />
            <input type="email" placeholder="Email" className="w-full outline-none" />
          </div>
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              className="w-full outline-none"
              value={password}
              onChange={validatePassword}
            />
          </div>
          <div className="flex items-center border rounded-lg p-2 relative">
            <FaLock className="mr-2 text-gray-500" />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full outline-none"
              value={password}
              onChange={validatePassword}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-black text-white rounded-lg py-2">Sign Up</button>
          <div className="text-center text-sm text-gray-500">OR</div>
          <button className="w-full bg-white text-black border flex items-center justify-center py-2">
            <FcGoogle className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
          <p className="text-center text-sm text-gray-500">
            Already a member? <a href="/login" className="text-black underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
