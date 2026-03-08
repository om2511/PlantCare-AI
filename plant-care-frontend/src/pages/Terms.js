import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PublicPageLayout from '../components/layout/PublicPageLayout';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - PlantCare AI</title>
        <meta
          name="description"
          content="Read the terms for using PlantCare AI, including account use, acceptable conduct, and limitations."
        />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/terms" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <PublicPageLayout
        title="Terms of Service"
        subtitle="Rules and conditions for using PlantCare AI."
        icon="📜"
      >
        <div className="space-y-7 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Last updated: March 8, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Acceptance</h2>
            <p>
              By accessing or using PlantCare AI, you agree to these Terms. If you do not agree, do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. Service Scope</h2>
            <p>
              PlantCare AI provides digital tools for plant tracking, reminders, and AI-assisted guidance. The service can change over time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You are responsible for your account credentials and activity.</li>
              <li>Use accurate information when creating and updating your account.</li>
              <li>Accounts may be suspended for abuse, fraud, or policy violations.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Acceptable Use</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Do not misuse, disrupt, or attempt unauthorized access.</li>
              <li>Do not upload illegal or harmful content.</li>
              <li>Do not scrape or automate usage in a way that harms service stability.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. AI Guidance Disclaimer</h2>
            <p>
              Recommendations and disease analysis are informational and may be imperfect. For high-impact plant health decisions, confirm with qualified experts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Intellectual Property</h2>
            <p>
              Application code, branding, and product content are protected. You may use the service for personal use only unless explicitly allowed otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Privacy</h2>
            <p>
              Data handling is governed by the <Link to="/privacy" className="text-green-700 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">8. Availability and Liability</h2>
            <p>
              The service is provided on an “as available” basis. We do not guarantee uninterrupted operation or error-free outputs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">9. Termination</h2>
            <p>
              You may stop using the service at any time. We may suspend or terminate access for violations or security reasons.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">10. Changes to Terms</h2>
            <p>
              We may update these Terms. Continued use after updates means you accept the revised Terms.
            </p>
          </section>
        </div>
      </PublicPageLayout>
    </>
  );
};

export default Terms;
