'use client';

import React from 'react';

interface SessionTimeoutModalProps {
  onContinue: () => void;
  onLogout: () => void;
}

export default function SessionTimeoutModal({
  onContinue,
  onLogout,
}: SessionTimeoutModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]"
    >
      <div
        className="relative z-[10000] bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">Session Timeout</h2>
        <p className="text-gray-600 mb-6">
          You have been inactive for 20 minutes. For your security, please log in again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Login Again
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Continue Session
          </button>
        </div>
      </div>
    </div>
  );
}
