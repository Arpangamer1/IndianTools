import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Mail, User, Bookmark, FileText, CheckCircle2, AlertCircle, Lock, ArrowRight } from 'lucide-react';

export default function Contact() {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "Contact Support & Feedback — IndianTools";

    // Get active user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email,
          name: session.user.email.split('@')[0] // Fallback name from email prefix
        }));
      }
      setLoadingSession(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setFormData(prev => ({
          ...prev,
          email: session.user.email,
          name: session.user.email.split('@')[0]
        }));
      }
      setLoadingSession(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!session?.user) {
      setError('You must be logged in to send a message.');
      setLoading(false);
      return;
    }

    // Simple validation
    if (!formData.name.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('messages')
        .insert([{
          user_id: session.user.id,
          name: formData.name.trim(),
          email: session.user.email, // Lock to authenticated session email
          subject: formData.subject.trim(),
          message: formData.message.trim()
        }]);

      if (insertError) throw new Error(insertError.message);

      setSuccess(true);
      setFormData(prev => ({ ...prev, subject: '', message: '' }));
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-gray-400">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 animate-fade-in">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-saffron-50 text-saffron flex items-center justify-center mx-auto border border-saffron-100">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-charcoal-900 leading-tight">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-semibold max-w-sm mx-auto">
            {session ? 'Logged in as registered user. Leave your message below!' : 'Only registered and logged-in users can contact support.'}
          </p>
        </div>

        {!session ? (
          /* Locked guest state */
          <div className="text-center space-y-5 py-6 animate-scale-up">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-charcoal-900">Authentication Required</h2>
              <p className="text-xs text-gray-400 font-semibold max-w-xs mx-auto">
                Please log into your account to submit comments or contact support.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-saffron hover:bg-saffron-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Login to Account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : success ? (
          /* Success notification overlay */
          <div className="text-center space-y-4 py-8 animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center mx-auto border border-emerald-100">
              <CheckCircle2 className="w-10 h-10 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-charcoal-900">Message Sent!</h2>
              <p className="text-xs text-gray-500 font-semibold">
                Thank you for contacting us. We have received your message.
              </p>
            </div>
            <button
              onClick={() => setSuccess(false)}
              className="mt-4 px-6 py-2.5 bg-saffron hover:bg-saffron-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          /* Authenticated Form */
          <form onSubmit={handleSubmit} className="space-y-5 font-semibold text-xs text-charcoal-800">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl flex items-center space-x-2 border border-red-100 animate-fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span className="font-bold">{error}</span>
              </div>
            )}

            {/* Name Field */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="block text-charcoal-700">Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-saffron focus:border-saffron outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Field (Autofilled & Locked) */}
            <div className="space-y-1.5">
              <label className="block text-charcoal-700">Email Address (Locked)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  disabled
                  value={formData.email}
                  className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-400 cursor-not-allowed outline-none"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-1.5">
              <label htmlFor="subject" className="block text-charcoal-700">Subject</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Bookmark className="w-4 h-4" />
                </span>
                <input
                  id="subject"
                  type="text"
                  required
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-saffron focus:border-saffron outline-none transition-all"
                />
              </div>
            </div>

            {/* Message Field */}
            <div className="space-y-1.5">
              <label htmlFor="message" className="block text-charcoal-700">Your Message</label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-gray-400">
                  <FileText className="w-4 h-4" />
                </span>
                <textarea
                  id="message"
                  required
                  rows="4"
                  placeholder="Type your message details here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-saffron focus:border-saffron outline-none transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-saffron hover:bg-saffron-600 text-white font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:bg-saffron-300"
            >
              {loading ? (
                <span>Sending message...</span>
              ) : (
                <span>Send Message</span>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
