'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (e) => {
      setError(e.message);
    };
    const handleUnhandledRejection = (e) => {
      setError(e.reason?.message || 'Unhandled Promise Error');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] px-4">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Oops! 😔</h1>
          <p className="text-gray-700 mb-2">Something went wrong.</p>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReload}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Retry
            </button>
            <Link
              href="/"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
