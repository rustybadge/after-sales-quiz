import React, { useState, useMemo } from 'react';
import CompanyName from './CompanyName';
import QuizQuestion from './QuizQuestion';
import ResultsCapture from './ResultsCapture';

// Import types and data from the original quiz
type Category =
  | "FTF"
  | "RemoteTriage"
  | "Parts"
  | "ETA"
  | "Playbooks"
  | "Predictive";

type Option = { label: string; value: number };
type Question = {
  id: string;
  text: string;
  category: Category;
  options: Option[];
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

const WEIGHTS: Record<Category, number> = {
  FTF: 0.25,
  RemoteTriage: 0.20,
  Parts: 0.20,
  ETA: 0.15,
  Playbooks: 0.10,
  Predictive: 0.10,
};

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

interface QuizFlowProps {
  onBackToLanding: () => void;
}

type QuizStep = 'company' | 'questions' | 'results';

const QuizFlow: React.FC<QuizFlowProps> = ({ onBackToLanding }) => {
  const [step, setStep] = useState<QuizStep>('company');
  const [company, setCompany] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUESTIONS.length;

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

  const handleCompanyContinue = () => {
    if (company.trim()) {
      setStep('questions');
    }
  };

  const handleQuestionAnswer = (value: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // All questions answered, show results
      setStep('results');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    } else {
      // Go back to company name
      setStep('company');
    }
  };

  const handleExit = () => {
    onBackToLanding();
  };

  if (step === 'company') {
    return (
      <CompanyName
        company={company}
        setCompany={setCompany}
        onContinue={handleCompanyContinue}
        onExit={handleExit}
      />
    );
  }

  if (step === 'questions') {
    return (
      <QuizQuestion
        question={currentQuestion.text}
        category={labelCat(currentQuestion.category)}
        options={currentQuestion.options}
        currentAnswer={answers[currentQuestion.id]}
        onSelect={handleQuestionAnswer}
        onNext={handleNextQuestion}
        onBack={handlePreviousQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        onExit={handleExit}
      />
    );
  }

  if (step === 'results') {
    return (
      <ResultsCapture
        company={company}
        totalScore={byCategory.total}
        categoryScores={byCategory.avg}
        onBackToLanding={onBackToLanding}
      />
    );
  }

  return null;
};

export default QuizFlow;
