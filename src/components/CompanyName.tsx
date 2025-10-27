import React from 'react';

interface CompanyNameProps {
  company: string;
  setCompany: (company: string) => void;
  onContinue: () => void;
  onExit: () => void;
}

const CompanyName: React.FC<CompanyNameProps> = ({ company, setCompany, onContinue, onExit }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (company.trim()) {
      onContinue();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Exit Link */}
      <div className="flex justify-center pt-8">
        <button
          onClick={onExit}
          className="text-gray-900 hover:text-gray-600 transition-colors font-medium"
        >
          Exit
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md text-center">
          {/* Question */}
          <h1 className="text-3xl md:text-4xl font-bold mb-8" style={{ color: '#111827' }}>
            What's your company name?
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Write your company name here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              autoFocus
            />

            <button
              type="submit"
              disabled={!company.trim()}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-black font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to questions
            </button>
          </form>

          {/* Instruction */}
          <p className="text-gray-600 mt-6 text-lg leading-relaxed">
            All the following questions should be answered according to your last 30 days performance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyName;
