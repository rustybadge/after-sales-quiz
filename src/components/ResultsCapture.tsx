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
              <div className="text-lg font-semibold text-gray-900">
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif', fontWeight: 500 }}>
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
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
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
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          {recommendationState === 'quick-wins' && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Your top 3 quick wins</h3>
                  <p className="text-gray-600">Chosen by your weakest categories</p>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                {top3Weak.map((cat, idx) => {
                  const ideas = BASIC_ACTIONS[cat].slice(0, 1);
                  return (
                    <div key={cat} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="font-semibold text-gray-900">{labelCat(cat)}</span>
                      </div>
                      <p className="text-sm text-gray-700">{ideas[0]}</p>
                    </div>
                  );
                })}
              </div>

              <details className="group">
                <summary className="cursor-pointer w-full bg-white border border-gray-200 rounded-2xl p-4 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-3 group-open:bg-gray-50 group-open:border-gray-300">
                  <span className="text-gray-700 font-semibold text-base">Expand to see detailed recommendations</span>
                  <svg className="w-5 h-5 text-gray-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {top3Weak.map((cat) => (
                    <div key={cat} className="bg-white rounded-2xl p-6 border border-gray-200">
                      <p className="mb-4 text-sm font-semibold text-gray-700">{labelCat(cat)}</p>
                      <ul className="space-y-3">
                        {BASIC_ACTIONS[cat].map((action, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-sm text-gray-700">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
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
                  <h3 className="text-2xl font-bold text-gray-900">Next-horizon plays</h3>
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
                  <h3 className="text-2xl font-bold text-gray-900">Maintain & monitor</h3>
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
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get your action plan</h3>
              <p className="text-gray-600">Enter your email to receive the complete report with benchmarks, detailed checklist, and next steps.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your work email"
                required
                className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {isSubmitting ? 'Sending...' : 'Email me my plan'}
              </button>
              <p className="text-xs text-green-600 text-center">
                No spam • You are not subscribing to anything
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
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

        {/* Alternative Actions */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Download quick summary (PDF)</h4>
                <p className="text-sm text-gray-600">Get a basic PDF without providing your email</p>
              </div>
            </div>
            <button
              onClick={handlePrint}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              Download
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-green-200 rounded-2xl hover:border-green-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Book a 15-min walkthrough</h4>
                <p className="text-sm text-gray-600">Get personalized guidance on your results</p>
              </div>
            </div>
            <a
              href="https://calendly.com/your-calendly/15min"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-green-300 text-green-700 rounded-xl font-medium hover:border-green-400 hover:bg-green-50 transition-colors"
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