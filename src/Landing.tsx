import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Content Section */}
      <div className="mx-auto px-6 py-16" style={{ maxWidth: '1280px' }}>
        <div className="text-center mb-16 mx-auto" style={{ maxWidth: '800px' }}>
          {/* Orange Pill Tag */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            After Sales Diagnostic
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#111827' }}>
            Benchmark Your After Sales in 2 Minutes.
          </h1>
          
          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Find out where your after sales is strong and where it's costing you uptime, fixes, and revenue.
          </p>
          
          {/* Primary CTA Button */}
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Start your assessment
          </button>
        </div>
      </div>

      {/* Preview Image Box - Full Width - Hidden on mobile */}
      <div className="hidden md:block w-full px-6" style={{ maxWidth: '1280px', margin: '0 auto -30px auto' }}>
        <div className="bg-gray-100 p-8 flex items-center justify-center" style={{ height: '600px' }}>
          <img 
            src="/dashboard-preview.png" 
            alt="Diagnostic preview" 
            className="w-full" 
            style={{ maxWidth: '70%', display: 'block' }}
          />
        </div>
      </div>

      {/* Rest of Content */}
      <div className="mx-auto px-6 pt-24 pb-16" style={{ maxWidth: '1280px' }}>
        
        {/* Free After Sales Diagnostics Report */}
        <div className="mb-24" style={{ maxWidth: '853px' }}>
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#111827' }}>Free After Sales Diagnostics Report</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            This is a free diagnostics tool to measure how effective your after sales processes are. It's only 12 questions and then you receive your diagnostics report.
          </p>
        </div>
        
        {/* Component 1: Who this quiz is for - Text Left, Image Right */}
        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          {/* Left Column - Text */}
          <div>
            <h2 className="text-2xl md:text-3xl mb-6" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#111827' }}>Who should take this assessment?</h2>
            <p className="text-gray-700 mb-6 leading-relaxed md:pr-8" style={{ fontSize: '14px' }}>
              This after sales analysis is mainly for organisations that service or maintain physical equipment, with field or depot work and a parts pipeline.
            </p>
            
            <div className="mb-4">
              <ul className="space-y-2 text-gray-700 md:pr-8" style={{ fontSize: '14px' }}>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Industrial OEMs (and dealers) in construction, recycling, aggregates/mining, material handling, forestry, HVAC/MEP, packaging and food processing.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mid-sized service providers with 5–200 technicians.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Companies with some system of record (FSM/CMMS/ERP), even if the data is a bit messy.</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Column - Image in Grey Box */}
          <div>
            <div className="bg-gray-100 p-8">
              <img src="/questions.jpeg" alt="After sales assessment" className="w-full" />
            </div>
          </div>
        </div>

        {/* Component 2: How does this diagnostics tool work - Image Left, Text Right */}
        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          {/* Left Column - Image in Grey Box */}
          <div>
            <div className="bg-gray-100 p-8">
              <img src="/dimensions.jpeg" alt="Assessment dimensions" className="w-full" />
            </div>
          </div>
          
          {/* Right Column - Text */}
          <div>
            <h2 className="text-2xl md:text-3xl mb-6 md:pl-8" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#111827' }}>How is your report calculated?</h2>
            <div className="max-w-lg md:pl-8">
              <p className="text-gray-700 mb-4 leading-relaxed" style={{ fontSize: '14px' }}>
                The assessment evaluates your after-sales performance across six core dimensions: First-Time-Fix rates, Remote Triage capabilities, Parts availability, ETA management, Playbook maturity, and Predictive maintenance readiness.
              </p>
              <p className="text-gray-700 leading-relaxed" style={{ fontSize: '14px' }}>
                Each dimension is weighted based on industry benchmarks and impact on overall service performance. Scores are calculated from your answers to 12 targeted questions, revealing both your strengths and critical improvement areas.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-16">
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Start your assessment
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;