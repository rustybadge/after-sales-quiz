import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="mx-auto px-6" style={{ maxWidth: '1280px' }}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="https://www.humblebee.se" target="_blank" rel="noopener noreferrer">
              <img 
                src="/logo.png" 
                alt="Humblebee" 
                style={{ height: '27px' }}
              />
            </a>
          </div>
          
          {/* Links */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <a 
              href="/privacy-policy" 
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="/terms-of-use" 
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Use
            </a>
            <span className="text-gray-400">|</span>
            <a 
              href="/cookie-policy" 
              className="hover:text-gray-900 transition-colors"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

