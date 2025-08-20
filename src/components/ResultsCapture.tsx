import React, { useState } from 'react';

interface ResultsCaptureProps {
  company?: string;
  totalScore: number;
  personaName: string;
}

const ResultsCapture: React.FC<ResultsCaptureProps> = ({ company, totalScore, personaName }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Submit to Netlify Forms
      const formData = new FormData();
      formData.append('email', email);
      formData.append('company', company || '');
      formData.append('totalScore', totalScore.toString());
      formData.append('persona', personaName);
      formData.append('timestamp', new Date().toISOString());

      // Netlify will automatically detect and process this form
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      // Fallback: just show success state
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-900">Thanks! We'll be in touch</h3>
            <p className="text-green-700">
              We'll send you the detailed action plan and benchmark data within 24 hours.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Get your detailed action plan
        </h3>
        <p className="text-blue-700 text-sm">
          Enter your email to receive the complete checklist, benchmark data, and next steps.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your work email"
          required
          className="flex-1 px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Sending...' : 'Get Plan'}
        </button>
      </form>
      
      <p className="text-xs text-blue-600 mt-3 text-center">
        No spam • Unsubscribe anytime • We respect your privacy
      </p>
    </div>
  );
};

export default ResultsCapture;
