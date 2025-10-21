import React from 'react';
import { Check } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const ConfirmationPage = () => {
  const location = useLocation();
  const userEmail = location.state?.email || 'your email';

  return (
    <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6 animate-fade-in">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-full mb-8">
          <Check className="w-12 h-12 text-white" />
        </div>
        
        {/* Main Message */}
        <h1 className="text-4xl font-bold mb-6 text-white">You're in.</h1>
        
        {/* Pricing Info */}
        <p className="text-lg text-white mb-8 font-normal">
          Your early-bird price of <span className="bg-gray-800 px-2 py-1 rounded font-semibold">$29.99</span> is locked in.
        </p>
        
        {/* Email Confirmation */}
        <p className="text-sm text-white mb-12 font-normal">
          We'll email you at <span className="bg-gray-800 px-2 py-1 rounded font-semibold">{userEmail}</span> when we launch.
        </p>
        
      </div>
    </div>
  );
};

export default ConfirmationPage;
