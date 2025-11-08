import React from 'react';
import PolicyPage from '../components/PolicyPage';

const TermsOfUse: React.FC = () => {
  return (
    <PolicyPage title="Terms of Use – After Sales Quiz" lastUpdated="November 10, 2025">
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
          1. Acceptance of terms
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          By using this site and submitting your email address, you agree to these Terms and our Privacy Policy. If you do not agree, please do not use the site.
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
          2. Purpose of service
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          After Sales Quiz provides a free self-assessment tool to help users benchmark their after-sales processes. It is for informational purposes only and is not a professional consulting service.
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
          3. Intellectual property
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          All text, graphics, logos, and software are the property of Humblebee AB and may not be reproduced without permission.
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
          4. User responsibility
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          You agree to provide accurate information and not to misuse the site (e.g., introduce malware, attempt unauthorised access, or scrape data).
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
          5. Disclaimer of warranties
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          The After Sales Quiz is provided "as is". We make no guarantees of accuracy or fitness for a particular purpose. Use is at your own risk.
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
          6. Limitation of liability
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          To the maximum extent permitted by law, Humblebee AB and its employees shall not be liable for any indirect, incidental, or consequential damages arising from your use of the site or from unauthorised access to stored data.
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
          7. External links
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          This site may contain links to third-party websites. We are not responsible for their content or privacy practices.
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
          8. Changes to terms
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          We may revise these terms from time to time. Continued use after changes indicates acceptance of the updated terms.
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
          9. Governing law
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          These Terms are governed by the laws of Sweden and any dispute shall be handled by Swedish courts.
        </p>
      </section>
    </PolicyPage>
  );
};

export default TermsOfUse;

