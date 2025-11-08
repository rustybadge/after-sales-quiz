import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, lastUpdated, children }) => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={() => navigate('/')}
          className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
        >
          ← Back
        </button>
      </div>

      <div className="mx-auto px-6 py-16" style={{ maxWidth: '800px' }}>
        {/* Page Title */}
        <h1 
          className="text-4xl md:text-5xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          {title}
        </h1>
        
        {/* Last Updated */}
        <p className="text-sm text-gray-500 mb-12">
          Last updated: {lastUpdated}
        </p>
        
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {children}
        </div>
      </div>
    </main>
  );
};

export default PolicyPage;

