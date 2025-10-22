import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await fetch('https://api.pathgen.online/me', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log('User not logged in');
      }
    };
    
    checkUser();
  }, []);

  const handleDiscordLogin = () => {
    setIsLoading(true);
    setError('');
    
    // Redirect to Discord OAuth
    window.location.href = 'https://api.pathgen.online/auth/discord';
  };

  const handleLogout = async () => {
    try {
      await fetch('https://api.pathgen.online/logout', {
        method: 'GET',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
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

        {/* Discord Login Form */}
        <div className="max-w-sm mx-auto mb-16 animate-slide-up">
          {user ? (
            <div className="bg-form-bg rounded-lg p-8 border border-form-border text-center">
              <div className="mb-6">
                <img 
                  src={user.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png` : '/default-avatar.png'} 
                  alt="Discord Avatar" 
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white mb-2">Welcome back, {user.username}!</h3>
                <p className="text-gray-300">{user.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full bg-red-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-700 transition-colors text-base"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="bg-form-bg rounded-lg p-8 border border-form-border">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Sign in with Discord</h3>
                <p className="text-gray-300 text-sm">Connect your Discord account to get started</p>
              </div>
              
              <button
                onClick={handleDiscordLogin}
                disabled={isLoading}
                className="w-full bg-[#5865F2] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#4752C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                    <span>Continue with Discord</span>
                  </>
                )}
              </button>
            </div>
          )}
          
          <div className="text-center mt-6">
            <p className="text-white text-base">
              Lock in <span className="bg-form-bg px-2 py-1 rounded text-white font-semibold">$49.99</span> pricing
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
