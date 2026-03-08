import React from 'react';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/layout/PublicPageLayout';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - PlantCare AI</title>
        <meta
          name="description"
          content="Read the PlantCare AI privacy policy, including what data is collected, why it is used, and what controls users have."
        />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <PublicPageLayout
        title="Privacy Policy"
        subtitle="How PlantCare AI handles your information."
        icon="🔒"
      >
        <div className="space-y-7 text-gray-700 leading-relaxed">
          <p className="text-sm text-gray-500">Last updated: March 8, 2026</p>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">1. Information We Collect</h2>
            <p>We collect information needed to provide core product features.</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Account data such as name, email, and profile preferences.</li>
              <li>Plant records you create, care logs, reminders, and uploaded images.</li>
              <li>Technical data such as device/browser metadata and error logs.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">2. How We Use Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To run account features, reminders, and plant-care workflows.</li>
              <li>To generate AI-based guidance and improve feature quality.</li>
              <li>To secure the service and troubleshoot failures.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">3. Data Sharing</h2>
            <p>We do not sell personal data. Data may be processed by service providers used to operate the app.</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Cloud hosting and database providers.</li>
              <li>Image hosting or processing providers.</li>
              <li>AI inference providers for analysis features.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">4. Notifications</h2>
            <p>
              Push notifications are optional. You can manage browser permission and app reminder settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">5. Data Retention and Controls</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>You can update profile data in your account.</li>
              <li>You can request account deletion from account settings.</li>
              <li>Some records may be retained where required for legal/security reasons.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">6. Security</h2>
            <p>
              We use reasonable administrative and technical safeguards. No system can guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">7. Changes to This Policy</h2>
            <p>
              We may revise this policy over time. Updates are published on this page with a revised date.
            </p>
          </section>
        </div>
      </PublicPageLayout>
    </>
  );
};

export default Privacy;
