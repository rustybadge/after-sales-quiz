import React, { useState } from 'react';
import { buildPlanPdf } from '../pdf/plan';

interface ResultsCaptureProps {
  company?: string;
  totalScore: number;
  personaName: string;
  categoryScores: {
    FTF: number;
    RemoteTriage: number;
    Parts: number;
    ETA: number;
    Playbooks: number;
    Predictive: number;
  };
  top3Weak: string[];
  recommendationState: 'quick-wins' | 'next-horizon' | 'maintain';
}

const ResultsCapture: React.FC<ResultsCaptureProps> = ({ 
  company, 
  totalScore, 
  personaName, 
  categoryScores, 
  top3Weak, 
  recommendationState 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
      // Generate the PDF
      console.log('Generating PDF with data:', {
        company,
        totalScore,
        personaName,
        categoryScores,
        top3Weak,
        recommendationState
      });
      
      const pdfData = buildPlanPdf({
        company,
        totalScore,
        personaName,
        categoryScores,
        top3Weak,
        recommendationState
      });

      console.log('PDF data generated:', pdfData ? `Length: ${pdfData.length}` : 'undefined');

      if (!pdfData) {
        throw new Error('PDF generation failed - no data returned');
      }

      // Convert PDF to base64 for transmission
      const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfData)));
      console.log('PDF converted to base64, length:', pdfBase64.length);

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
          personaName,
          pdfData: pdfBase64
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Email sent successfully:', result);
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error('Function error:', errorData);
        throw new Error(errorData.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}. Check console for details.`);
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
            <h3 className="text-lg font-semibold text-green-900">Action Plan Sent! 📧</h3>
            <p className="text-green-700">
              Your personalized action plan has been sent to your email with a PDF attached.
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
        No spam • You are not subscribing to anything • We respect your privacy
      </p>
    </div>
  );
};

export default ResultsCapture;
