import React, { useState, useMemo } from 'react';
import { buildPlanPdf } from '../pdf/plan';

type Category = "FTF" | "RemoteTriage" | "Parts" | "ETA" | "Playbooks" | "Predictive";

interface ResultsCaptureProps {
  company?: string;
  totalScore: number;
  categoryScores: Record<Category, number>;
  onBackToLanding: () => void;
}

// Thresholds for "strong enough" categories
const THRESHOLDS: Record<Category, number> = {
  FTF: 86,
  RemoteTriage: 75,
  Parts: 91,
  ETA: 80,
  Playbooks: 80,
  Predictive: 80,
};

const BASIC_ACTIONS: Record<Category, string[]> = {
  FTF: [
    "Add a mandatory pre-dispatch checklist to lift First-Time-Fix.",
    "Coach the 3 lowest-FTF techs using shadowing + 'golden fixes'.",
    "Publish a weekly wallboard for FTF, MTTR, repeat-visit rate.",
  ],
  RemoteTriage: [
    "Require photo/video + 5 checks before dispatch (remote triage).",
    "Resolve simple config issues remotely; log 'remote saves'.",
    "Add error-code quick guides to your field app.",
  ],
  Parts: [
    "Create 5 service kits for your top failure modes.",
    "Tag top 100 SKUs by criticality; raise fill-rate on criticals.",
    "Align van stock to golden fixes to reduce repeat visits.",
  ],
  ETA: [
    "Stand up ETA SLAs: T+2h initial; T+24h confirmed.",
    "Auto-notify customers on any ETA change.",
    "Expose ETA status on a simple customer-facing page.",
  ],
  Playbooks: [
    "Document the top 10 'golden fixes' step-by-step.",
    "Capture serial/model data on >95% of service events.",
    "Add in-app checklists and short fix videos for techs.",
  ],
  Predictive: [
    "Run a 12-week predictive pilot on one critical subsystem.",
    "Instrument thresholds/alerts; track avoided downtime.",
    "Review pilot ROI; scale only what moved MTTR/FTF.",
  ],
};

const ADVANCED_ACTIONS: Record<Category, string[]> = {
  FTF: [
    "Push 88→92% via Pareto & targeted training.",
    "Implement skill-based routing.",
    "Expand kit coverage >60%.",
  ],
  RemoteTriage: [
    "Target 25%+ remote saves.",
    "Enable device log uploads.",
    "QA triage quality; coach high false-negatives.",
  ],
  Parts: [
    "Push critical fill-rate >98%.",
    "Measure kit uptake.",
    "Publish supplier OTIF and remediate laggards.",
  ],
  ETA: [
    "Promise windows with confidence bands.",
    "Live customer portal.",
    "SLA credits for misses.",
  ],
  Playbooks: [
    "Instrument usage analytics.",
    "Auto-surface by error code.",
    "Quarterly retire stale guides.",
  ],
  Predictive: [
    "Alert precision >70%.",
    "Expand to all critical subsystems.",
    "Auto-create work orders.",
  ],
};

const MAINTAIN_CHECKLIST = [
  "Weekly review of all category scores.",
  "Monthly team calibration on thresholds.",
  "Quarterly refresh of action plans.",
  "Annual review of category weights.",
];

function persona(score: number) {
  if (score >= 85) return { name: "Predictor", blurb: "Leading edge: predictive operations in place. Focus on scaling continuous coaching and analytics." };
  if (score >= 70) return { name: "Optimizer", blurb: "Optimising: strong foundation with room to improve. Push first-time-fix above 85% and expand kit coverage." };
  if (score >= 40) return { name: "Stabiliser", blurb: "Stabilising: basics in place, but gaps remain. Unlock remote triage and enforce ETA discipline to reduce churn." };
  return { name: "Responder", blurb: "Reactive mode: stuck in callbacks, relying on triage and kits. Focus on building triage discipline + basic playbooks." };
}

function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

function labelCat(c: Category) {
  switch (c) {
    case "FTF":
      return "First-Time-Fix";
    case "RemoteTriage":
      return "Remote triage";
    case "Parts":
      return "Parts availability";
    case "ETA":
      return "ETA discipline";
    case "Playbooks":
      return "Playbooks & enablement";
    case "Predictive":
      return "Predictive monitoring";
  }
}

const ResultsCapture: React.FC<ResultsCaptureProps> = ({ 
  company, 
  totalScore, 
  categoryScores,
  onBackToLanding
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const catsSortedWeakToStrong = useMemo(() => {
    const entries = Object.entries(categoryScores) as [Category, number][];
    return entries.sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0));
  }, [categoryScores]);

  // Determine recommendation state
  const recommendationState = useMemo(() => {
    const weakCategories = Object.entries(categoryScores).filter(([cat, score]) => 
      score < THRESHOLDS[cat as Category]
    ) as [Category, number][];
    
    if (weakCategories.length > 0) {
      return 'quick-wins';
    }
    
    const hasHeadroom = Object.entries(categoryScores).some(([cat, score]) => 
      score < 95 // 5 pts headroom to 100
    );
    
    if (hasHeadroom) {
      return 'next-horizon';
    }
    
    return 'maintain';
  }, [categoryScores]);

  const top3Weak = catsSortedWeakToStrong.slice(0, 3).map(([c]) => c);
  const personaInfo = useMemo(() => persona(totalScore), [totalScore]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Generate the PDF
      const pdfData = buildPlanPdf({
        company,
        totalScore,
        personaName: personaInfo.name,
        categoryScores,
        top3Weak,
        recommendationState
      });

      if (!pdfData) {
        throw new Error('PDF generation failed - no data returned');
      }

      // Convert PDF to base64 for transmission
      const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfData)));

      // Send to our Netlify function
      const response = await fetch('/.netlify/functions/send-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company,
          totalScore,
          personaName: personaInfo.name,
          pdfData: pdfBase64
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}. Check console for details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBackToLanding}
              className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
            >
              ← Back to start
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-500">Assessment Complete</div>
              <div className="text-lg font-semibold" style={{ color: '#111827' }}>
                {company ? company : "Your Results"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Results Header */}
        <div className="mb-12">
          {/* Main Score Section with Green Background */}
          <div className="bg-green-400 p-16 mb-8">
            <div className="text-center">
              <div className="text-green-800 text-lg font-medium mb-8">
                Assessment Complete
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-12" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
                Your after sales score is
              </h1>
              <div className="inline-block bg-green-800 px-12 py-8 rounded-full">
                <span className="text-6xl md:text-7xl font-bold text-green-400">{formatPct(totalScore)}</span>
              </div>
            </div>
          </div>

          {/* Persona Section */}
          <div className="text-center">
            <div className="text-gray-500 text-sm mb-2">Persona</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500, color: '#111827' }}>
              {personaInfo.name}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {personaInfo.blurb}
            </p>
          </div>
        </div>

        {/* Score Breakdown - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-6 mb-12 max-w-2xl mx-auto">
          {Object.entries(categoryScores).slice(0, 4).map(([cat, val]) => {
            const score = Number.isFinite(val) ? val : 0;
            return (
              <div key={cat} className="bg-white rounded-2xl p-6 border border-gray-200">
                <div className="text-xs uppercase tracking-wide text-gray-600 mb-2 font-medium">
                  {labelCat(cat as Category).toUpperCase()}
                </div>
                <div className="text-2xl md:text-3xl font-bold mb-3" style={{ color: '#111827' }}>
                  {formatPct(score)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-800 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="bg-gray-50 p-8 mb-12">
          {recommendationState === 'quick-wins' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Your top 3 quick wins</h3>
                  <p className="text-gray-600">Chosen by your weakest categories</p>
                </div>
              </div>
              
              <div className="space-y-8">
                {top3Weak.map((cat, idx) => {
                  const ideas = BASIC_ACTIONS[cat].slice(0, 1);
                  return (
                    <div key={cat} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                          {idx + 1}
                        </div>
                        <h4 className="text-xl font-semibold mb-3" style={{ color: '#111827' }}>{labelCat(cat)}</h4>
                        <p className="text-gray-600 text-base max-w-2xl mx-auto">{ideas[0]}</p>
                      </div>
                      
                      <details className="group">
                        <summary className="cursor-pointer text-center text-gray-600 hover:text-gray-800 transition-colors text-base font-medium mb-4">
                          <span className="group-open:hidden">Expand</span>
                          <span className="hidden group-open:inline">Hide</span>
                        </summary>
                        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-6 max-w-4xl mx-auto">
                          <ul className="space-y-4">
                            {BASIC_ACTIONS[cat].map((action, i) => (
                              <li key={i} className="flex items-start gap-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-base text-gray-700">{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </details>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {recommendationState === 'next-horizon' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Next-horizon plays</h3>
                  <p className="text-gray-600">Advanced actions to push strong categories higher</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(categoryScores).map(([cat, score]) => {
                  if (score >= 95) return null;
                  return (
                    <div key={cat} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <p className="mb-4 text-sm font-semibold text-gray-700">{labelCat(cat as Category)}</p>
                      <ul className="space-y-3">
                        {ADVANCED_ACTIONS[cat as Category].slice(0, 2).map((action, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {recommendationState === 'maintain' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold" style={{ color: '#111827' }}>Maintain & monitor</h3>
                  <p className="text-gray-600">All categories are strong. Focus on sustaining performance</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl p-6 border border-gray-200">
                <ul className="space-y-4">
                  {MAINTAIN_CHECKLIST.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Email Capture */}
        {!isSubmitted ? (
          <div className="p-8" style={{ backgroundColor: '#F1E3FF' }}>
            <div className="text-center mb-8">
              <h3 className="font-bold mb-4" style={{ fontFamily: 'serif', fontSize: '40px', color: '#111827' }}>Get your action plan</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Enter your email to receive the complete report with benchmarks, detailed checklist, and next steps.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="text-left">
                <label className="block text-sm font-medium text-gray-700 mb-2">Enter your work email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  required
                  className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-lg"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
                >
                  {isSubmitting ? 'Sending...' : 'Send me my plan'}
                </button>
              </div>
              <p className="text-sm text-gray-600 text-center">
                No spam. You are not subscribing to anything.
              </p>
            </form>

            {/* Or Separator */}
            <div className="relative flex items-center justify-center my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative px-4" style={{ backgroundColor: '#F1E3FF' }}>
                <span className="text-gray-500 font-medium">Or</span>
              </div>
            </div>
            
            {/* Download Section - Part of same purple background */}
            <div className="text-center">
              <h4 className="text-xl font-bold mb-2" style={{ color: '#254E29' }}>Download quick summary (PDF)</h4>
              <p className="text-gray-600 mb-6">Get a basic PDF without providing your email</p>
              <button
                onClick={handlePrint}
                className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              >
                Download
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center" style={{ backgroundColor: '#F1E3FF' }}>
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Action Plan Sent! 📧</h3>
            <p className="text-green-700">
              Your personalized action plan has been sent to your email with a PDF attached.
            </p>
          </div>
        )}

        {/* Book a 15-min walkthrough */}
        <div className="mt-8">
          <div className="p-8 text-center bg-white">
            <h3 className="font-bold mb-4" style={{ fontFamily: 'serif', fontSize: '40px', color: '#111827' }}>Book a 15-min walkthrough</h3>
            <p className="text-gray-600 text-lg mb-8">Get personalized guidance on your results</p>
            <a
              href="https://calendly.com/your-calendly/15min"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg"
              style={{ 
                backgroundColor: '#79FC86',
                color: '#000000'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#6BFC73';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#79FC86';
              }}
            >
              Book now
            </a>
          </div>
        </div>
        </div>

        <style>{`
        @media print {
          a,
          button,
          input,
          summary,
          .print\\:hidden {
            display: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:py-0 {
            padding-top: 0 !important;
            padding-bottom: 0 !important;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsCapture;