import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('indiantools_cookie_consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptConsent = () => {
    localStorage.setItem('indiantools_cookie_consent', 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-charcoal text-white p-4 rounded-xl shadow-2xl border border-gray-700 flex flex-col space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2 text-saffron">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <h4 className="text-sm font-bold">Privacy & Cookies Notice</h4>
        </div>
        <button
          onClick={acceptConsent}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed">
        IndianTools processes all files 100% inside your browser. We use standard browser cookies for essential analytics and ad personalization per our privacy policy.
      </p>

      <div className="flex justify-end space-x-2 pt-1">
        <button
          onClick={acceptConsent}
          className="px-4 py-1.5 bg-saffron hover:bg-saffron-700 text-white font-semibold text-xs rounded-lg transition-colors"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
