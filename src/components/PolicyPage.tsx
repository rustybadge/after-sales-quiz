import React from 'react';

interface PolicyPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

const PolicyPage: React.FC<PolicyPageProps> = ({ title, lastUpdated, children }) => {
  return (
    <main className="min-h-screen bg-white">
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

