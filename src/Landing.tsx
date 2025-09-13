import React from 'react';

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <main className="min-h-screen bg-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-left mb-16">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              After-Sales Diagnostic
            </div>
            <h1 className="text-5xl text-purple-900 mb-6 leading-tight" style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 500, letterSpacing: '-1px' }}>
              Benchmark Your After-Sales in 2 Minutes
            </h1>
            <p className="text-5xl text-gray-600 max-w-5xl leading-tight mb-8" style={{ fontFamily: 'Inter Tight, sans-serif', fontWeight: 500, letterSpacing: '-1px' }}>
              Find out where your after-sales is strong and where it's costing you uptime, fixes, and revenue. Get instant, tailored recommendations.
            </p>
            
            {/* Primary CTA */}
            <div className="mb-16">
              <button
                onClick={onStart}
                className="bg-purple-600 text-white px-12 py-4 rounded-xl text-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Start My Diagnostic
              </button>
              <p className="text-sm text-gray-500 mt-4">12 questions • 2 minutes • Instant results — no signup required</p>
            </div>
          </div>

          {/* Main Cards */}
          <h3 className="text-2xl font-semibold tracking-wide mb-6" style={{ color: '#4B5563', fontFamily: 'Inter Tight, sans-serif', fontWeight: 500, letterSpacing: '-1px' }}>
            How the assessment works
          </h3>
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Assessment Card */}
            <div className="bg-white rounded-3xl border border-purple-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">Quick Assessment</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Answer 12 questions to pinpoint strengths and gaps across your service performance — from first-time-fix to technician productivity.
                  </p>
                </div>
              </div>
              
              {/* Mini Dashboard Preview */}
              <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-purple-900">Performance Overview</h4>
                  <div className="text-sm text-gray-500">Sample Results</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">First-Time-Fix</div>
                    <div className="text-2xl font-bold text-purple-900">87%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Remote Triage</div>
                    <div className="text-2xl font-bold text-purple-900">72%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div className="bg-purple-400 h-2 rounded-full" style={{width: '72%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={onStart} className="text-purple-600 font-medium hover:text-purple-700">Start the assessment</button>
                <button onClick={onStart} className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-white rounded-3xl border border-purple-200 p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-purple-900 mb-2">Smart Insights</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Get practical, prioritized actions matched to your results — from quick wins to long-term improvements.
                  </p>
                </div>
              </div>
              
              {/* Mini Dashboard Preview */}
              <div className="bg-purple-50 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-purple-900">Recommendations</h4>
                  <div className="text-sm text-gray-500">Tailored Actions</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Add pre-dispatch checklist</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-700">Create service kits for top failures</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">Implement ETA SLAs</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button onClick={onStart} className="text-purple-600 font-medium hover:text-purple-700">Start the assessment</button>
                <button onClick={onStart} className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center hover:bg-purple-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>


        </div>
      </div>
    </main>
  );
};

export default Landing;
