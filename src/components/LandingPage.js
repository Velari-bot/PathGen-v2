import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save user data to Firestore
      try {
        await addDoc(collection(db, 'earlyAccess'), {
          email: email,
          userId: userCredential.user.uid,
          timestamp: new Date(),
          pricing: 'early-bird',
          amount: 29.99
        });
      } catch (firestoreError) {
        console.log('Firestore error (non-critical):', firestoreError);
        // Continue even if Firestore fails
      }

      // Redirect to success page with email
      navigate('/success', { state: { email: email } });
    } catch (error) {
      console.error('Authentication error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try signing in instead.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <div className="text-center pt-12 pb-8">
        <h1 className="text-lg font-normal text-white">AI Fortnite Coach - PathGen</h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-6xl md:text-7xl font-bold leading-tight mb-8 tracking-tight">
            Level up faster with<br />
            AI-powered<br />
            coaching
          </h2>
          
          <p className="text-lg text-white mb-16 max-w-2xl mx-auto leading-relaxed font-normal">
            Personalized Fortnite training paths, aim drills, and PC<br />
            optimization.<br />
            All powered by AI.
          </p>
        </div>

        {/* Sign-up Form */}
        <div className="max-w-sm mx-auto mb-16 animate-slide-up">
          <form onSubmit={handleSubmit} className="bg-form-bg rounded-lg p-8 border border-form-border">
            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-form-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors text-base"
                placeholder="Enter your email"
                required
              />
              
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-transparent border border-form-border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors text-base"
                placeholder="Create a password (min 8 characters)"
                minLength={8}
                required
              />
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-button-bg text-button-text font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
              >
                {isLoading ? 'Creating Account...' : 'Get Early Access'}
              </button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}
          </form>
          
          <div className="text-center mt-6">
            <p className="text-white text-base">
              Lock in <span className="bg-form-bg px-2 py-1 rounded text-white font-semibold">$29.99</span> early-bird pricing
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto animate-slide-up">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white">Smart Training Paths</h3>
            <p className="text-white leading-relaxed font-normal">
              AI analyzes your gameplay and builds<br />
              custom training sequences
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white">Adaptive Drills</h3>
            <p className="text-white leading-relaxed font-normal">
              Dynamic exercises that evolve with<br />
              your performance
            </p>
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white">PC Optimization</h3>
            <p className="text-white leading-relaxed font-normal">
              Maximize FPS and eliminate<br />
              stuttering for peak performance
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LandingPage;
