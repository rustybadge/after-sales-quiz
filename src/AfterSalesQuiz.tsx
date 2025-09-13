import React, { useMemo, useState } from "react";
import { buildPlanPdf } from "./pdf/plan";

/** ---------------------------
 *  AFTER-SALES QUIZ (1 file)
 *  - No external libs
 *  - Category-weighted scoring
 *  - Persona mapping
 *  - Top 3 tailored actions
 *  - Print-to-PDF & mailto
 *  --------------------------*/

type Category =
  | "FTF"
  | "RemoteTriage"
  | "Parts"
  | "ETA"
  | "Playbooks"
  | "Predictive";

type Option = { label: string; value: number }; // value normalized to 0..100
type Question = {
  id: string;
  text: string;
  category: Category;
  options: Option[];
};

const WEIGHTS: Record<Category, number> = {
  FTF: 0.25,
  RemoteTriage: 0.20,
  Parts: 0.20,
  ETA: 0.15,
  Playbooks: 0.10,
  Predictive: 0.10,
};

const QUESTIONS: Question[] = [
  {
    id: "q1",
    text: "Solved on the first visit (First-Time-Fix, FTF) in the last 30 days?",
    category: "FTF",
    options: [
      { label: "≤70%", value: 20 },
      { label: "71–80%", value: 50 },
      { label: "81–85%", value: 70 },
      { label: "86–90%", value: 90 },
      { label: ">90%", value: 100 },
    ],
  },
  {
    id: "q2",
    text: "% of jobs with a pre-dispatch diagnosis before sending a technician (remote triage)?",
    category: "RemoteTriage",
    options: [
      { label: "0%", value: 0 },
      { label: "1–25%", value: 35 },
      { label: "26–50%", value: 55 },
      { label: "51–75%", value: 75 },
      { label: "76–100%", value: 95 },
    ],
  },
  {
    id: "q3",
    text: "% of jobs that needed a second visit (repeat-visit rate)?",
    category: "FTF",
    options: [
      { label: ">30%", value: 10 },
      { label: "21–30%", value: 35 },
      { label: "11–20%", value: 60 },
      { label: "6–10%", value: 80 },
      { label: "≤5%", value: 100 },
    ],
  },
  {
    id: "q4",
    text: "Critical spare parts available immediately (line fill rate)?",
    category: "Parts",
    options: [
      { label: "≤70%", value: 20 },
      { label: "71–80%", value: 45 },
      { label: "81–90%", value: 70 },
      { label: "91–96%", value: 85 },
      { label: ">96%", value: 100 },
    ],
  },
  {
    id: "q5",
    text: "Was an initial estimate given within 2 hours of ticket creation (ETA)?",
    category: "ETA",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 40 },
      { label: "About half", value: 60 },
      { label: "Usually", value: 80 },
      { label: "Always", value: 100 },
    ],
  },
  {
    id: "q6",
    text: "Was a confirmed estimate sent within 24 hours (ETA)?",
    category: "ETA",
    options: [
      { label: "Never", value: 0 },
      { label: "Sometimes", value: 40 },
      { label: "About half", value: 60 },
      { label: "Usually", value: 80 },
      { label: "Always", value: 100 },
    ],
  },
  {
    id: "q7",
    text: "Are step-by-step work instructions & checklists in place for your top 10 fixes (playbooks)?",
    category: "Playbooks",
    options: [
      { label: "0 of 10", value: 0 },
      { label: "1–3 of 10", value: 35 },
      { label: "4–6 of 10", value: 60 },
      { label: "7–9 of 10", value: 80 },
      { label: "10 of 10", value: 100 },
    ],
  },
  {
    id: "q8",
    text: "Do you use predictive monitoring on critical subsystems (condition-based maintenance, CBM)?",
    category: "Predictive",
    options: [
      { label: "No", value: 0 },
      { label: "Pilot", value: 40 },
      { label: "1–2 critical assets", value: 60 },
      { label: "3–5 critical assets", value: 80 },
      { label: "Fleet-wide criticals", value: 100 },
    ],
  },
  {
    id: "q9",
    text: "% of jobs using pre-bundled service kits (parts kits)?",
    category: "Parts",
    options: [
      { label: "0%", value: 0 },
      { label: "1–10%", value: 30 },
      { label: "11–30%", value: 55 },
      { label: "31–60%", value: 80 },
      { label: ">60%", value: 100 },
    ],
  },
  {
    id: "q10",
    text: "Median time to resolve from open to complete (MTTR)?",
    category: "FTF",
    options: [
      { label: ">14 days", value: 10 },
      { label: "8–14 days", value: 35 },
      { label: "3–7 days", value: 65 },
      { label: "1–2 days", value: 85 },
      { label: "<1 day", value: 100 },
    ],
  },
  {
    id: "q11",
    text: "% of inbound issues resolved without a technician visit (remote saves)?",
    category: "RemoteTriage",
    options: [
      { label: "0%", value: 0 },
      { label: "1–10%", value: 30 },
      { label: "11–25%", value: 55 },
      { label: "26–40%", value: 80 },
      { label: ">40%", value: 100 },
    ],
  },
  {
    id: "q12",
    text: "Is serial number/model captured on more than 95% of service tickets?",
    category: "Playbooks",
    options: [
      { label: "No", value: 0 },
      { label: "Partly", value: 50 },
      { label: "Yes", value: 100 },
    ],
  },
];

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

export default function AfterSalesQuiz() {
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const byCategory = useMemo(() => {
    const map: Record<Category, number[]> = {
      FTF: [],
      RemoteTriage: [],
      Parts: [],
      ETA: [],
      Playbooks: [],
      Predictive: [],
    };
    QUESTIONS.forEach((q) => {
      const v = answers[q.id];
      if (typeof v === "number") map[q.category].push(v);
    });
    const avg: Record<Category, number> = {
      FTF: avgArr(map.FTF),
      RemoteTriage: avgArr(map.RemoteTriage),
      Parts: avgArr(map.Parts),
      ETA: avgArr(map.ETA),
      Playbooks: avgArr(map.Playbooks),
      Predictive: avgArr(map.Predictive),
    };
    const total =
      (avg.FTF || 0) * WEIGHTS.FTF +
      (avg.RemoteTriage || 0) * WEIGHTS.RemoteTriage +
      (avg.Parts || 0) * WEIGHTS.Parts +
      (avg.ETA || 0) * WEIGHTS.ETA +
      (avg.Playbooks || 0) * WEIGHTS.Playbooks +
      (avg.Predictive || 0) * WEIGHTS.Predictive;
    return { map, avg, total };
  }, [answers]);

  const catsSortedWeakToStrong = useMemo(() => {
    const entries = Object.entries(byCategory.avg) as [Category, number][];
    return entries.sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0));
  }, [byCategory]);

  // Determine recommendation state
  const recommendationState = useMemo(() => {
    const weakCategories = Object.entries(byCategory.avg).filter(([cat, score]) => 
      score < THRESHOLDS[cat as Category]
    ) as [Category, number][];
    
    if (weakCategories.length > 0) {
      return 'quick-wins';
    }
    
    const hasHeadroom = Object.entries(byCategory.avg).some(([cat, score]) => 
      score < 95 // 5 pts headroom to 100
    );
    
    if (hasHeadroom) {
      return 'next-horizon';
    }
    
    return 'maintain';
  }, [byCategory.avg]);

  const top3Weak = catsSortedWeakToStrong.slice(0, 3).map(([c]) => c);

  const personaInfo = useMemo(() => persona(byCategory.total), [byCategory.total]);

  function handleSelect(qid: string, value: number) {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handlePrint() {
    window.print();
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Generate the PDF
      const pdfData = buildPlanPdf({
        company,
        totalScore: byCategory.total,
        personaName: personaInfo.name,
        categoryScores: byCategory.avg,
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
          totalScore: byCategory.total,
          personaName: personaInfo.name,
          pdfData: pdfBase64
        }),
      });

      if (response.ok) {
        setEmailSent(true);
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

  const allAnswered = QUESTIONS.every((q) => typeof answers[q.id] === "number");

  return (
    <main className="min-h-screen bg-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-purple-900">After-Sales Diagnostic</h1>
              <p className="text-sm text-gray-600 mt-1">
                Assess your current after sales state
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-lg font-semibold text-purple-900">
                {Object.keys(answers).length} / {QUESTIONS.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {!submitted && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Quiz Area */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Input */}
                <div className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm">
                  <label className="block text-sm font-semibold text-purple-900 mb-3">Your Company Name</label>
                  <input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-2xl border border-gray-300 p-4 text-lg outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Skrotfrag"
                  />
                </div>

                {/* Questions */}
                {QUESTIONS.map((q, idx) => (
                  <div key={q.id} className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-600">{idx + 1}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-900 mb-2">{q.text}</h3>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">{labelCat(q.category)}</div>
                      </div>
                    </div>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      {q.options.map((opt) => {
                        const id = `${q.id}-${opt.value}`;
                        const isSelected = answers[q.id] === opt.value;
                        return (
                          <label
                            key={id}
                            htmlFor={id}
                            className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all ${
                              isSelected 
                                ? "border-purple-500 bg-purple-50 shadow-sm" 
                                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <input
                              id={id}
                              type="radio"
                              name={q.id}
                              value={opt.value}
                              checked={isSelected}
                              onChange={() => handleSelect(q.id, opt.value)}
                              className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-900">{opt.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Submit Button */}
                <div className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Takes ~3–4 minutes • Zero fluff</p>
                      <p className="text-xs text-gray-400 mt-1">All questions answered: {allAnswered ? '✓' : '○'}</p>
                    </div>
                    <button
                      type="submit"
                      disabled={!allAnswered}
                      className="bg-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold disabled:cursor-not-allowed disabled:opacity-30 hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      See my score
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Progress Card */}
                <div className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Questions completed</span>
                        <span>{Object.keys(answers).length} / {QUESTIONS.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-purple-500 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-900">
                        {Math.round((Object.keys(answers).length / QUESTIONS.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>

                {/* Categories Overview */}
                <div className="bg-white rounded-3xl border border-purple-200 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-purple-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    {Object.entries(byCategory.avg).map(([cat, val]) => {
                      const categoryQuestions = QUESTIONS.filter(q => q.category === cat);
                      const answered = categoryQuestions.filter(q => typeof answers[q.id] === 'number').length;
                      const total = categoryQuestions.length;
                      const isComplete = answered === total;
                      
                      return (
                        <div key={cat} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${isComplete ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                            <span className="text-sm font-medium text-gray-700">{labelCat(cat as Category)}</span>
                          </div>
                          <span className="text-xs text-gray-500">{answered}/{total}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Help Card */}
                <div className="bg-purple-50 rounded-3xl border border-purple-200 p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2">Need help?</h3>
                  <p className="text-sm text-purple-700 mb-4">
                    Answer based on your team's current performance over the last 30 days.
                  </p>
                  <a 
                    href="mailto:hello@humblebee.se" 
                    className="text-sm text-purple-600 font-medium hover:text-purple-700"
                  >
                    Contact support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitted && (
          <div className="space-y-8">
            {/* Results Header */}
            <div className="bg-white rounded-3xl border border-purple-200 p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Assessment Complete
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  {company ? `${company}: ` : ""}Your after-sales score is{" "}
                  <span className="tabular-nums text-purple-600">{formatPct(byCategory.total)}</span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Persona: <span className="font-semibold text-gray-900">{personaInfo.name}</span> — {personaInfo.blurb}
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(byCategory.avg).map(([cat, val]) => {
                  const score = Number.isFinite(val) ? val : 0;
                  const isStrong = score >= THRESHOLDS[cat as Category];
                  return (
                    <div key={cat} className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-gray-700">{labelCat(cat as Category)}</p>
                        <div className={`w-3 h-3 rounded-full ${isStrong ? 'bg-purple-500' : 'bg-purple-400'}`}></div>
                      </div>
                      <p className="text-3xl font-bold text-gray-900 mb-3">{formatPct(score)}</p>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isStrong ? 'bg-purple-500' : 'bg-purple-400'
                          }`}
                          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {isStrong ? 'Strong performance' : 'Needs improvement'}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl border border-purple-200 p-8 shadow-sm">
              {recommendationState === 'quick-wins' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        <div key={cat} className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-xl flex items-center justify-center text-sm font-bold">
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
                    <summary className="cursor-pointer w-full bg-purple-50 border border-purple-200 rounded-2xl p-4 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 flex items-center justify-center gap-3 group-open:bg-purple-100 group-open:border-purple-300">
                      <span className="text-purple-700 font-semibold text-base">Expand to see detailed recommendations</span>
                      <svg className="w-5 h-5 text-purple-600 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </summary>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {top3Weak.map((cat) => (
                        <div key={cat} className="bg-gray-50 rounded-2xl p-6">
                          <p className="mb-4 text-sm font-semibold text-gray-700">{labelCat(cat)}</p>
                          <ul className="space-y-3">
                            {BASIC_ACTIONS[cat].map((action, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
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
                    <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Next-horizon plays</h3>
                      <p className="text-gray-600">Advanced actions to push strong categories higher</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {Object.entries(byCategory.avg).map(([cat, score]) => {
                      if (score >= 95) return null;
                      return (
                        <div key={cat} className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                          <p className="mb-4 text-sm font-semibold text-gray-700">{labelCat(cat as Category)}</p>
                          <ul className="space-y-3">
                            {ADVANCED_ACTIONS[cat as Category].slice(0, 2).map((action, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
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
                    <div className="w-10 h-10 bg-purple-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Maintain & monitor</h3>
                      <p className="text-gray-600">All categories are strong. Focus on sustaining performance</p>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                    <ul className="space-y-4">
                      {MAINTAIN_CHECKLIST.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>

          {/* Unified CTA Block */}
          <div className="bg-white rounded-3xl border border-purple-200 p-8 shadow-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Get your action plan</h3>
              <p className="text-gray-600">Choose how you'd like to receive your personalized results and recommendations</p>
            </div>

            <div className="space-y-6">
              {/* Email Success Message */}
              {emailSent && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">Action Plan Sent! 📧</h3>
                      <p className="text-green-700">
                        Your personalized action plan has been sent to your email with a PDF attached.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Primary Action - Email */}
              {!emailSent && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-xl flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Email me my plan</h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">Get the complete report with benchmarks, detailed checklist, and next steps delivered to your inbox.</p>
                
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email.trim()}
                    className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Email me my plan'}
                  </button>
                  <p className="text-xs text-purple-600 text-center">
                    No spam • Unsubscribe anytime
                  </p>
                </form>
                </div>
              )}

              {/* Secondary Action - PDF Download */}
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

              {/* Tertiary Action - Walkthrough */}
              <div className="flex items-center justify-between p-4 border border-purple-200 rounded-2xl hover:border-purple-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-sm font-bold">
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
                  className="px-4 py-2 border border-purple-300 text-purple-700 rounded-xl font-medium hover:border-purple-400 hover:bg-purple-50 transition-colors"
                >
                  Book now
                </a>
              </div>
            </div>
          </div>
          </div>
        )}
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
    </main>
  );
}

// Helpers
function avgArr(a: number[]) {
  if (!a.length) return 0;
  return a.reduce((s, v) => s + v, 0) / a.length;
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
