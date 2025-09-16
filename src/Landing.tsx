import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* Orange Pill Tag */}
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            After Sales Diagnostic
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-gray-900 mb-6 leading-tight" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
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
            Start the diagnostic
          </button>
        </div>

        {/* Simulated Diagnostic Result Card */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-gray-600 mb-4">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              Assessment Complete
            </div>
            <p className="text-gray-700 mb-6">Your after sales score is</p>
            
            {/* Score Display */}
            <div className="relative inline-block mb-6">
              <div className="text-7xl md:text-8xl font-bold text-green-500 mb-2">72%</div>
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-xl opacity-30 -z-10"></div>
            </div>
            
            {/* Category Result */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Stabiliser</h3>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stabilising: basics in place, but gaps remain. Unlock remote triage and enforce ETA discipline to reduce churn.
              </p>
            </div>
          </div>
          
          {/* Category Scores Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">First Time Fix</div>
              <div className="text-2xl font-bold text-gray-900">77%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remote Triage</div>
              <div className="text-2xl font-bold text-gray-900">68%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Field Productivity</div>
              <div className="text-2xl font-bold text-gray-900">38%</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Proactive Planning</div>
              <div className="text-2xl font-bold text-gray-900">54%</div>
            </div>
          </div>
        </div>

        {/* How it works section */}
        <div className="mb-16">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl text-gray-900" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
              How the diagnostic works
            </h2>
          </div>

          {/* Content Cards */}
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* First Card: Performance Overview + Quick Assessment */}
            <div className="bg-white p-8 border border-gray-200">
              {/* Performance Overview */}
              <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Overview</h3>
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">FIRST TIME FIX</div>
                  <div className="text-3xl font-bold text-gray-900 mb-3">87%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '87%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide mb-2 font-medium">REMOTE TRIAGE</div>
                  <div className="text-3xl font-bold text-gray-900 mb-3">25%</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>

              {/* Quick Assessment */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Assessment</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Answer 12 questions to pinpoint strengths and gaps across your service performance from first-time-fix to technician productivity.
                  </p>
                </div>
              </div>
            </div>

            {/* Second Card: Recommendations + Smart Insights */}
            <div className="bg-white p-8 border border-gray-200">
              {/* Recommendations */}
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Add pre-dispatch checklist</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Add pre-dispatch checklist</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Implement ETA SLAs</span>
                </div>
              </div>

              {/* Smart Insights */}
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Insights</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Get practical, prioritised actions matched to your results from quick wins to long-term improvements.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center py-16">
          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
          >
            Start the diagnostic
          </button>
        </div>
      </div>
    </main>
  );
};

export default Landing;