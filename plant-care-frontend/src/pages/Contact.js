import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PublicPageLayout from '../components/layout/PublicPageLayout';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2500);
  };

  return (
    <>
      <Helmet>
        <title>Contact - PlantCare AI</title>
        <meta
          name="description"
          content="Contact PlantCare AI for feedback, support requests, or feature suggestions."
        />
        <link rel="canonical" href="https://plant-care-ai-nine.vercel.app/contact" />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <PublicPageLayout
        title="Contact"
        subtitle="Send feedback, report issues, or request support."
        icon="💬"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Send a Message</h2>

            {submitted && (
              <div className="mb-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-700">
                Message captured successfully.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none"
                >
                  <option value="">Choose a topic</option>
                  <option value="support">Technical support</option>
                  <option value="feedback">Product feedback</option>
                  <option value="feature">Feature request</option>
                  <option value="bug">Bug report</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none resize-none"
                  placeholder="Describe your question or issue."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors"
              >
                Submit
              </button>
            </form>
          </section>

          <section className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Support Scope</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Use this form for account issues, notification problems, plant-care workflow issues, and feature feedback.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h3 className="font-bold text-gray-900 mb-2">Response Expectations</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Response times vary by request volume and severity. Critical defects are prioritized over general feedback.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <h3 className="font-bold text-amber-900 mb-2">Health and Safety Note</h3>
              <p className="text-amber-900 text-sm leading-relaxed">
                Guidance provided in the app is informational. For severe plant disease or agricultural risk, verify with a local expert.
              </p>
            </div>
          </section>
        </div>
      </PublicPageLayout>
    </>
  );
};

export default Contact;
