import React from 'react';

interface CompanyNameProps {
  onContinue: () => void;
  onExit: () => void;
}

const CompanyName: React.FC<CompanyNameProps> = ({ onContinue, onExit }) => {
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
          {/* Main Headline */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#111827' }}>
            OK! Let's get started
          </h1>

          {/* Instruction */}
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            The following questions should be answered according to your last 30 days performance.
          </p>

          {/* Continue Button */}
          <button
            onClick={onContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyName;
