import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - PlantCare AI</title>
        <meta name="description" content="PlantCare AI Privacy Policy - Learn how we collect, use, and protect your personal information. Your privacy and data security are our top priorities." />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/privacy" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: March 6, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Introduction</h2>
                <p>
                  Welcome to PlantCare AI ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our plant care application and services.
                </p>
                <p>
                  By using PlantCare AI, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this privacy policy, please do not access the application.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Personal Information</h3>
                <p>When you register for PlantCare AI, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and email address</li>
                  <li>Location and climate zone information</li>
                  <li>Garden space details (optional)</li>
                  <li>Account preferences and settings</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Plant and Garden Data</h3>
                <p>To provide personalized recommendations, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Plant species and varieties you're growing</li>
                  <li>Plant photos uploaded for disease detection</li>
                  <li>Care logs and maintenance history</li>
                  <li>Water quality test results</li>
                  <li>Watering and fertilizing schedules</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Usage Information</h3>
                <p>We automatically collect certain information when you use PlantCare AI:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and general location</li>
                  <li>App usage patterns and feature interactions</li>
                  <li>Error reports and performance data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">How We Use Your Information</h2>
                <p>We use the collected information for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personalized Care Recommendations:</strong> Providing customized watering schedules, fertilizing reminders, and care tips based on your location, climate, and plant species.
                  </li>
                  <li>
                    <strong>Disease Detection:</strong> Analyzing uploaded plant photos to identify diseases and provide treatment recommendations.
                  </li>
                  <li>
                    <strong>Service Improvement:</strong> Enhancing our AI models and application features based on usage patterns and feedback.
                  </li>
                  <li>
                    <strong>Communication:</strong> Sending you care reminders, seasonal tips, and important updates about the service.
                  </li>
                  <li>
                    <strong>Account Management:</strong> Creating and maintaining your account, authenticating your identity, and providing customer support.
                  </li>
                  <li>
                    <strong>Analytics:</strong> Understanding how users interact with PlantCare AI to improve user experience and functionality.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Sharing and Disclosure</h2>
                <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly agree to share your information.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party vendors who assist us in operating the application (e.g., cloud hosting, analytics). These providers are bound by confidentiality agreements.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or government regulation.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred.
                  </li>
                  <li>
                    <strong>Aggregated Data:</strong> We may share anonymized, aggregated data that cannot identify you personally for research or marketing purposes.
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security audits and assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure cloud infrastructure with industry-standard providers</li>
                </ul>
                <p className="mt-3">
                  However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Rights and Choices</h2>
                <p>You have the following rights regarding your personal information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Access:</strong> Request a copy of the personal information we hold about you.
                  </li>
                  <li>
                    <strong>Correction:</strong> Update or correct inaccurate information in your account settings.
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your account and associated data. Some information may be retained for legal or legitimate business purposes.
                  </li>
                  <li>
                    <strong>Data Portability:</strong> Request your data in a structured, machine-readable format.
                  </li>
                  <li>
                    <strong>Opt-Out:</strong> Unsubscribe from marketing communications or push notifications at any time.
                  </li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us through the settings page or email us at support@plantcareai.com.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Data Retention</h2>
                <p>
                  We retain your personal information for as long as your account is active or as needed to provide you services. If you request account deletion, we will delete or anonymize your information within 30 days, except where retention is required by law or for legitimate business purposes (such as fraud prevention or legal compliance).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Third-Party Services</h2>
                <p>
                  PlantCare AI may contain links to third-party websites or services (such as weather data providers or plant databases). We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies before providing any information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Children's Privacy</h2>
                <p>
                  PlantCare AI is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately, and we will take steps to delete such information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">International Users</h2>
                <p>
                  PlantCare AI is designed primarily for users in India. If you access our services from outside India, please be aware that your information may be transferred to, stored, and processed in India or other countries where our service providers operate. By using PlantCare AI, you consent to this transfer.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of PlantCare AI after changes are posted constitutes your acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Contact Us</h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mt-3">
                  <p className="font-semibold text-gray-900">PlantCare AI</p>
                  <p>Email: privacy@plantcareai.com</p>
                  <p>Support: support@plantcareai.com</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Privacy;
