import React, { useMemo, useState } from "react";

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
    text: "First-Time-Fix (FTF) last 30 days?",
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
    text: "% of jobs with remote triage BEFORE dispatch?",
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
    text: "Repeat-visit rate (jobs needing 2+ visits)?",
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
    text: "Parts fill rate for CRITICAL SKUs?",
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
    text: "Initial ETA sent within 2 hours of ticket?",
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
    text: "Confirmed ETA sent within 24 hours?",
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
    text: "Top 10 'golden fixes' documented step-by-step?",
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
    text: "Predictive/condition monitoring deployed?",
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
    text: "% jobs using pre-bundled service kits?",
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
    text: "Median MTTR (open → resolved)?",
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
    text: "% inbound issues resolved WITHOUT a truck roll?",
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
    text: "Serial/model captured on >95% of service events?",
    category: "Playbooks",
    options: [
      { label: "No", value: 0 },
      { label: "Partly", value: 50 },
      { label: "Yes", value: 100 },
    ],
  },
];

const ACTIONS: Record<Category, string[]> = {
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

function persona(score: number) {
  if (score >= 85) return { name: "Predictor", blurb: "Strong ops; scale predictive + continuous coaching." };
  if (score >= 70) return { name: "Optimizer", blurb: "Solid foundation; push FTF >85% and kit coverage." };
  if (score >= 40) return { name: "Stabiliser", blurb: "Basics in place; unlock remote triage + ETA SLAs." };
  return { name: "Firefighter", blurb: "Living in callbacks; stop the bleeding with triage + kits." };
}

function formatPct(n: number) {
  return `${Math.round(n)}%`;
}

export default function AfterSalesQuiz() {
  const [company, setCompany] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

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

  const allAnswered = QUESTIONS.every((q) => typeof answers[q.id] === "number");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 print:py-0">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">How good is your After Sales... really?</h1>
        <p className="mt-2 text-sm text-gray-600">
          Built by a <span className="italic">Scotsman in Göteborg</span>. We've helped large Swedish OEMs with all things After Sales related. This quiz
          turns those learnings into a quick, practical check for teams like yours.
        </p>
      </header>

      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Company (optional)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 p-3 outline-none focus:ring-2 focus:ring-gray-800"
                placeholder="e.g., Skrotfrag"
              />
            </div>
          </div>

          {QUESTIONS.map((q, idx) => (
            <fieldset key={q.id} className="rounded-2xl border border-gray-200 p-4">
              <legend className="px-1 text-sm font-semibold text-gray-800">
                {idx + 1}. {q.text}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {q.options.map((opt) => {
                  const id = `${q.id}-${opt.value}`;
                  return (
                    <label
                      key={id}
                      htmlFor={id}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                        answers[q.id] === opt.value ? "border-gray-900" : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input
                        id={id}
                        type="radio"
                        name={q.id}
                        value={opt.value}
                        checked={answers[q.id] === opt.value}
                        onChange={() => handleSelect(q.id, opt.value)}
                        className="h-4 w-4"
                      />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">Takes ~3–4 minutes. Zero fluff.</p>
            <button
              type="submit"
              disabled={!allAnswered}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              See my score
            </button>
          </div>
        </form>
      )}

      {submitted && (
        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-200 p-6 print:border-0">
            <h2 className="text-2xl font-semibold">
              {company ? `${company}: ` : ""}Your after-sales score is{" "}
              <span className="tabular-nums">{formatPct(byCategory.total)}</span>
            </h2>
            <p className="mt-2 text-gray-700">
              Persona: <span className="font-medium">{personaInfo.name}</span> — {personaInfo.blurb}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(byCategory.avg).map(([cat, val]) => (
                <div key={cat} className="rounded-xl border border-gray-200 p-4">
                  <p className="text-xs uppercase text-gray-500">{cat}</p>
                  <p className="text-lg font-semibold">{Number.isFinite(val) ? formatPct(val) : "—"}</p>
                  <div className="mt-2 h-2 w-full rounded bg-gray-200">
                    <div
                      className="h-2 rounded bg-black"
                      style={{ width: `${Math.max(0, Math.min(100, val || 0))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 p-6 print:border-0">
            <h3 className="text-xl font-semibold">Your top 3 quick wins</h3>
            <p className="mt-1 text-sm text-gray-600">Chosen by your weakest categories.</p>
            <ul className="mt-4 list-disc space-y-3 pl-6">
              {top3Weak.map((cat) => {
                const ideas = ACTIONS[cat].slice(0, 1); // show 1 primary action per weak cat
                return (
                  <li key={cat}>
                    <span className="font-semibold">{labelCat(cat)}:</span>{" "}
                    <span>{ideas[0]}</span>
                  </li>
                );
              })}
            </ul>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm text-gray-600">See more suggested actions</summary>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {top3Weak.map((cat) => (
                  <div key={cat} className="rounded-xl border border-gray-200 p-4">
                    <p className="mb-2 text-xs uppercase text-gray-500">{labelCat(cat)}</p>
                    <ul className="list-disc space-y-2 pl-5 text-sm">
                      {ACTIONS[cat].map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </details>
          </div>

          <div className="flex flex-wrap gap-3 print:hidden">
            <button
              onClick={handlePrint}
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium hover:border-gray-800"
            >
              Download as PDF (print)
            </button>
            <a
              href={`mailto:hello@humblebee.se?subject=After-Sales%20Quiz%20Result%20${encodeURIComponent(
                company || ""
              )}&body=${encodeURIComponent(
                `Hi — here is our quiz result for ${company || "our company"}:\n\nTotal score: ${formatPct(
                  byCategory.total
                )}\nPersona: ${personaInfo.name}\n\nCategory scores:\n${Object.entries(byCategory.avg)
                  .map(([c, v]) => `${labelCat(c as Category)}: ${formatPct(v || 0)}`)
                  .join("\n")}\n\nTop 3 quick wins:\n${top3Weak
                  .map((c) => `• ${labelCat(c)} — ${ACTIONS[c][0]}`)
                  .join("\n")}\n\nCould we get the 1-page checklist + blank benchmark?`
              )}`}
              className="rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Email me the 1-page plan
            </a>
            <a
              href="https://calendly.com/your-calendly/15min" // TODO: replace
              target="_blank"
              rel="noreferrer"
              className="rounded-2xl border border-gray-300 px-4 py-2 text-sm font-medium hover:border-gray-800"
            >
              Book 15-min Scotsman walkthrough
            </a>
          </div>

          <p className="mt-2 text-xs text-gray-500 print:hidden">
            Add something in the footer here later.
          </p>
        </section>
      )}

      <style jsx global>{`
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
