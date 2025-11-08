import React from 'react';
import PolicyPage from '../components/PolicyPage';

const TermsOfUse: React.FC = () => {
  return (
    <PolicyPage title="Terms of Use" lastUpdated="November 8, 2025">
      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Acceptance of Terms
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By accessing and using the Humblebee After Sales Diagnostic tool, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
        </p>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Use of Service
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The After Sales Diagnostic tool is provided for informational and assessment purposes only. You agree to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Provide accurate and truthful information when completing the assessment</li>
          <li>Use the tool only for lawful purposes</li>
          <li>Not attempt to interfere with or disrupt the service</li>
          <li>Not use automated means to access or interact with the service</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Intellectual Property
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All content, features, and functionality of the diagnostic tool, including but not limited to text, graphics, logos, and software, are owned by Humblebee and are protected by international copyright, trademark, and other intellectual property laws.
        </p>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Disclaimer of Warranties
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The diagnostic tool and results are provided "as is" without warranties of any kind, either express or implied. Humblebee does not guarantee the accuracy, completeness, or usefulness of any information provided through the tool.
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          The assessment results are meant to be indicative and should not be considered professional advice. We recommend consulting with qualified professionals before making business decisions based on the results.
        </p>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Limitation of Liability
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Humblebee shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the diagnostic tool.
        </p>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Changes to Terms
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting. Your continued use of the service after changes constitutes acceptance of the modified terms.
        </p>
      </section>

      <section className="mb-8">
        <h2 
          className="text-2xl mb-4" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Contact Information
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          For questions about these Terms of Use, please contact us at:
        </p>
        <p className="text-gray-700 leading-relaxed">
          Email: <a href="mailto:hello@humblebee.se" className="text-green-600 hover:text-green-700 underline">hello@humblebee.se</a><br />
          Website: <a href="https://www.humblebee.se" className="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">www.humblebee.se</a>
        </p>
      </section>
    </PolicyPage>
  );
};

export default TermsOfUse;

