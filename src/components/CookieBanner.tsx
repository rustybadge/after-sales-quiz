import React, { useState, useEffect } from 'react';

const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
    // Here you would initialize Google Analytics or other tracking
    console.log('Analytics cookies accepted');
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setShowBanner(false);
    console.log('Analytics cookies rejected');
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg z-50">
      <div className="mx-auto px-6 py-6" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Message */}
          <div className="flex-1">
            <h3 
              className="text-lg font-semibold mb-2" 
              style={{ 
                fontFamily: 'Inter, sans-serif', 
                fontWeight: 600, 
                letterSpacing: '-0.03em', 
                color: '#111827' 
              }}
            >
              We use cookies
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use essential cookies to make our site work and analytics cookies to understand how you use it.{' '}
              <a href="/cookie-policy" className="underline hover:text-gray-900">Learn more</a>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleRejectAll}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
            >
              Reject all
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors text-sm whitespace-nowrap"
              style={{ color: '#111827' }}
            >
              Accept all cookies
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

