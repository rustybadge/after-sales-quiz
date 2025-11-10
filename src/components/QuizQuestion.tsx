import React from 'react';

interface Option {
  label: string;
  value: number;
}

interface QuizQuestionProps {
  question: string;
  category: string;
  options: Option[];
  currentAnswer?: number;
  onSelect: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
  questionNumber: number;
  totalQuestions: number;
  onExit: () => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  category,
  options,
  currentAnswer,
  onSelect,
  onNext,
  onBack,
  questionNumber,
  totalQuestions,
  onExit
}) => {
  const handleNext = () => {
    if (currentAnswer !== undefined) {
      onNext();
    }
  };

  const canProceed = currentAnswer !== undefined;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 pt-8">
        <button
          onClick={onExit}
          className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
        >
          Exit
        </button>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{category}</span>
          <span className="text-sm font-medium text-gray-900">{questionNumber}/{totalQuestions}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {/* Question */}
          <h1 className="text-2xl md:text-3xl font-bold mb-12 text-center leading-relaxed" style={{ color: '#111827' }}>
            {question}
          </h1>

          {/* Options */}
          <div className="space-y-4 mb-12">
            {options.map((option, index) => {
              const isSelected = currentAnswer === option.value;
              return (
                <label
                  key={option.value}
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="answer"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => onSelect(option.value)}
                    className="w-5 h-5 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-lg font-medium text-gray-900">{option.label}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center px-6 pb-8">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold px-8 py-3 rounded-lg transition-colors"
          style={{ color: !canProceed ? '#9ca3af' : '#111827' }}
        >
          Next question
        </button>
      </div>
    </div>
  );
};

export default QuizQuestion;
