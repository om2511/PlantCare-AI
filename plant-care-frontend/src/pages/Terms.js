import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service - PlantCare AI</title>
        <meta name="description" content="PlantCare AI Terms of Service - Read our terms and conditions for using the PlantCare AI plant care application and services." />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/terms" />
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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: March 6, 2026</p>

            <div className="prose prose-lg max-w-none space-y-6 text-gray-600">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p>
                  Welcome to PlantCare AI. By accessing or using our application, website, and services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
                </p>
                <p>
                  These Terms constitute a legally binding agreement between you ("User," "you," or "your") and PlantCare AI ("we," "us," or "our"). We reserve the right to modify these Terms at any time, and your continued use of the Service after changes are posted constitutes acceptance of the modified Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
                <p>
                  PlantCare AI is a free, AI-powered plant care application designed for Indian gardeners. The Service provides:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Personalized plant care schedules and reminders</li>
                  <li>AI-powered disease detection from plant photos</li>
                  <li>Seasonal gardening tips and recommendations</li>
                  <li>Water quality analysis for plants</li>
                  <li>Plant database and care guides</li>
                  <li>Growth tracking and analytics</li>
                </ul>
                <p className="mt-3">
                  The Service is provided "as is" and "as available" without warranties of any kind. We strive for accuracy but do not guarantee the completeness or reliability of any content or recommendations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
                <p>
                  To access certain features of the Service, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="mt-3">
                  You must be at least 13 years old to create an account. We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. User Content and Conduct</h2>
                <p>
                  You may upload photos, create plant records, and submit other content ("User Content"). By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content solely for providing and improving the Service.
                </p>
                <p className="mt-3">You agree not to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Upload content that is illegal, harmful, threatening, abusive, or offensive</li>
                  <li>Impersonate any person or entity or misrepresent your affiliation</li>
                  <li>Interfere with or disrupt the Service or servers</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Use the Service for any commercial purpose without our consent</li>
                  <li>Harvest or collect user information without permission</li>
                  <li>Use automated systems (bots, scrapers) to access the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Intellectual Property</h2>
                <p>
                  The Service, including all content, features, functionality, software, text, graphics, logos, and trademarks, is owned by PlantCare AI or its licensors and is protected by intellectual property laws.
                </p>
                <p className="mt-3">
                  You are granted a limited, non-exclusive, non-transferable license to access and use the Service for personal, non-commercial purposes. You may not:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Copy, modify, distribute, sell, or lease any part of the Service</li>
                  <li>Reverse engineer or attempt to extract source code</li>
                  <li>Remove or modify any proprietary notices or labels</li>
                  <li>Create derivative works based on the Service</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. AI-Generated Recommendations</h2>
                <p>
                  PlantCare AI uses artificial intelligence to provide plant care recommendations and disease detection. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>AI recommendations are for informational purposes only and should not replace professional horticultural advice</li>
                  <li>Disease detection results may not be 100% accurate and should be verified by experts when in doubt</li>
                  <li>We are not responsible for any damage to plants or property resulting from following our recommendations</li>
                  <li>You use the Service and act on recommendations at your own risk</li>
                </ul>
                <p className="mt-3">
                  For serious plant health issues or valuable plants, we recommend consulting with a local horticulturist or plant expert.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Privacy and Data</h2>
                <p>
                  Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms. Please review our <Link to="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link> to understand how we collect, use, and protect your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Free Service and Modifications</h2>
                <p>
                  PlantCare AI is currently provided free of charge. We reserve the right to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Modify, suspend, or discontinue any part of the Service at any time</li>
                  <li>Introduce paid features or subscription plans in the future</li>
                  <li>Change or update features, functionality, or content</li>
                  <li>Set limits on storage, number of plants, or other features</li>
                </ul>
                <p className="mt-3">
                  We will make reasonable efforts to notify users of significant changes, but we are not obligated to do so.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Disclaimer of Warranties</h2>
                <p>
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Warranties of merchantability or fitness for a particular purpose</li>
                  <li>Warranties regarding accuracy, reliability, or availability</li>
                  <li>Warranties that the Service will be uninterrupted or error-free</li>
                  <li>Warranties that defects will be corrected</li>
                </ul>
                <p className="mt-3">
                  We do not guarantee that the Service will meet your requirements or that results from using the Service will be accurate or reliable.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Limitation of Liability</h2>
                <p>
                  TO THE FULLEST EXTENT PERMITTED BY LAW, PLANTCARE AI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Loss of profits, data, or use</li>
                  <li>Cost of substitute services</li>
                  <li>Plant damage or loss</li>
                  <li>Personal injury or property damage</li>
                </ul>
                <p className="mt-3">
                  Our total liability for all claims related to the Service shall not exceed ₹1,000 (one thousand Indian Rupees) or the amount you paid us (if any), whichever is less.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless PlantCare AI and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, costs, or expenses (including attorneys' fees) arising from:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Your violation of these Terms</li>
                  <li>Your use or misuse of the Service</li>
                  <li>Your User Content</li>
                  <li>Your violation of any third-party rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Governing Law and Disputes</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with Indian Arbitration Act, or in the courts located in [Your City], India.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice, for any reason, including:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Violation of these Terms</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>At our sole discretion</li>
                </ul>
                <p className="mt-3">
                  You may terminate your account at any time through the settings page. Upon termination, your right to use the Service will immediately cease, and we may delete your data in accordance with our Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Miscellaneous</h2>
                <p>
                  <strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and PlantCare AI regarding the Service.
                </p>
                <p className="mt-2">
                  <strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
                </p>
                <p className="mt-2">
                  <strong>Waiver:</strong> Our failure to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
                </p>
                <p className="mt-2">
                  <strong>Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign these Terms at any time without notice.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">15. Contact Information</h2>
                <p>
                  If you have questions about these Terms, please contact us at:
                </p>
                <div className="bg-gray-50 rounded-xl p-4 mt-3">
                  <p className="font-semibold text-gray-900">PlantCare AI</p>
                  <p>Email: legal@plantcareai.com</p>
                  <p>Support: support@plantcareai.com</p>
                </div>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  By using PlantCare AI, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
