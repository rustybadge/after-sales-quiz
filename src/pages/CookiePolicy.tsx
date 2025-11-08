import React from 'react';
import PolicyPage from '../components/PolicyPage';

const CookiePolicy: React.FC = () => {
  return (
    <PolicyPage title="Cookie Policy" lastUpdated="November 8, 2025">
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
          What Are Cookies?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and understanding how you use our service.
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
          How We Use Cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use cookies for the following purposes:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li><strong>Essential Cookies:</strong> Required for the diagnostic tool to function properly</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our tool</li>
          <li><strong>Functional Cookies:</strong> Remember your preferences and choices</li>
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
          Types of Cookies We Use
        </h2>
        
        <h3 
          className="text-xl mb-3 mt-6" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Session Cookies
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          These are temporary cookies that expire when you close your browser. They help us maintain your session as you complete the diagnostic assessment.
        </p>

        <h3 
          className="text-xl mb-3 mt-6" 
          style={{ 
            fontFamily: 'Inter, sans-serif', 
            fontWeight: 600, 
            letterSpacing: '-0.03em', 
            color: '#111827' 
          }}
        >
          Persistent Cookies
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          These cookies remain on your device for a set period or until you delete them. They help us remember your preferences for future visits.
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
          Third-Party Cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may use third-party services that set cookies on your device. These may include:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Analytics providers (e.g., Google Analytics) to understand usage patterns</li>
          <li>Hosting services to deliver our content efficiently</li>
          <li>Email service providers to send your action plan</li>
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
          Managing Cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You can control and manage cookies in several ways:
        </p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
          <li>Most browsers allow you to refuse or accept cookies through their settings</li>
          <li>You can delete cookies that are already stored on your device</li>
          <li>You can set your browser to notify you when cookies are being sent</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mb-4">
          Please note that disabling certain cookies may affect the functionality of our diagnostic tool and limit your ability to use some features.
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
          Updates to This Policy
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, regulatory, or operational reasons. We encourage you to review this policy periodically.
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
          Contact Us
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          If you have questions about our use of cookies, please contact us at:
        </p>
        <p className="text-gray-700 leading-relaxed">
          Email: <a href="mailto:hello@humblebee.se" className="text-green-600 hover:text-green-700 underline">hello@humblebee.se</a><br />
          Website: <a href="https://www.humblebee.se" className="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">www.humblebee.se</a>
        </p>
      </section>
    </PolicyPage>
  );
};

export default CookiePolicy;

