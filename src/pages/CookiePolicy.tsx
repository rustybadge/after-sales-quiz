import React from 'react';
import PolicyPage from '../components/PolicyPage';

const CookiePolicy: React.FC = () => {
  return (
    <PolicyPage title="Cookie Policy – After Sales Quiz" lastUpdated="November 10, 2025">
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
          1. What are cookies?
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Cookies are small text files stored on your device when you visit a website. They help websites remember your preferences, improve user experience, and collect analytical data.
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
          2. How we use cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          After Sales Quiz uses a limited number of cookies to ensure the site works correctly and to gather anonymous analytical data. We do not use cookies for advertising or to track you across other websites.
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
          3. Types of cookies we use
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>**Essential cookies:**</strong> Required for the basic operation of the site (for example, saving quiz progress).
        </p>
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>**Analytics cookies:**</strong> Set by Google Analytics to help us understand how visitors use our site so we can improve it. Google Analytics collects information such as which pages visitors view and which pages are most popular.
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
          4. Third-party cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use Google Analytics, a web analytics service provided by Google LLC. Google Analytics cookies collect anonymous information and standard internet log data, such as IP address (truncated / anonymise). This information is transmitted to and stored by Google on servers located in the EU when possible. You can learn more about Google's data practices at:{' '}
          <a href="https://policies.google.com/privacy" className="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>.
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
          5. Managing cookies
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You can manage or delete cookies at any time through your browser settings. You can also opt out of Google Analytics tracking by installing the Google Analytics Opt-out Browser Add-on at:{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" className="text-green-600 hover:text-green-700 underline" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout</a>.
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
          6. Consent
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          When you first visit our site, a banner will appear asking you to consent to non-essential cookies. By clicking 'Accept all cookies', you agree to the use of analytics cookies. You can withdraw or change your consent at any time by adjusting your cookie settings in the banner or browser.
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
          7. Updates
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may update this Cookie Policy periodically to reflect changes in technology or legal requirements. Any updates will be posted on this page with a new effective date.
        </p>
      </section>
    </PolicyPage>
  );
};

export default CookiePolicy;

