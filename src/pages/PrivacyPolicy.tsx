import React from 'react';
import PolicyPage from '../components/PolicyPage';

const PrivacyPolicy: React.FC = () => {
  return (
    <PolicyPage title="Privacy Policy – After Sales Quiz" lastUpdated="November 10, 2025">
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
          1. Who we are
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This website ("After Sales Quiz") is operated by Humblebee AB, based in Sweden. We act as the data controller for any personal data collected through this site. Contact:{' '}
          <a href="mailto:hello@humblebee.se" className="text-green-600 hover:text-green-700 underline">hello@humblebee.se</a>
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
          2. What data we collect
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you complete the assessment form, we collect:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li><strong>Email address</strong> – to send you your diagnostics report and (optionally) follow-up information.</li>
          <li><strong>Quiz responses</strong> – used only to generate your report; they are not linked to any marketing profile.</li>
          <li><strong>'Usage' data</strong> – collected through Google Analytics (anonymised cookies and IP data).</li>
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
          3. How we use the data
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We process your data only to:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Generate and deliver your personalised diagnostics report.</li>
          <li>Maintain the technical operation and security of this site.</li>
          <li>Analyse aggregated traffic data to improve the service.</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          We do not sell, rent, or share your email address with any third party for marketing.
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
          4. Legal basis for processing
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Processing is based on your consent (Article 6 [1](a) GDPR) when you submit your email address and click submit. You may withdraw your consent at any time by emailing{' '}
          <a href="mailto:hello@humblebee.se" className="text-green-600 hover:text-green-700 underline">hello@humblebee.se</a>
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
          5. Data storage & processors
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We rely on trusted third-party processors who are GDPR-compliant:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li><strong>Netlify</strong> – Hosting and deployment (EU / EEA data centres)</li>
          <li><strong>Resend Inc.</strong> – Sending your diagnostics report emails (EU or EEA servers)</li>
          <li><strong>Google Analytics</strong> – Traffic analytics via cookies (anonymised IP, EU data-residency options)</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          Data is stored securely and access-restricted to authorised personnel only.
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
          6. Retention period
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Email addresses and quiz responses are retained for up to 12 months to allow follow-up evaluation, after which they are deleted or anonymised.
        </p>
      </section>
    </PolicyPage>
  );
};

export default PrivacyPolicy;

