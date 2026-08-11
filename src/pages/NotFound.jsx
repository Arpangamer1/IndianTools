import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home, Search, FileText, Image as ImageIcon, Info, Mail, PhoneCall } from 'lucide-react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404 Page Not Found — IndianTools';
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
        
        {/* Large 404 Roadsign graphic in center */}
        <div className="relative flex flex-col items-center justify-center space-y-2">
          <p className="text-8xl sm:text-9xl font-black text-gray-100 tracking-widest leading-none select-none">404</p>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-gray-300 rounded-xl px-5 py-2.5 shadow-sm font-black text-xs uppercase tracking-wider text-charcoal-800">
            Page Not Found
          </div>
        </div>

        {/* Headings */}
        <div className="space-y-2 max-w-md mx-auto">
          <h1 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">
            Oops! This page seems to be lost.
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-semibold">
            The page you're looking for doesn't exist or has been moved. Don't worry, let's get you back on track.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 bg-saffron hover:bg-saffron-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all"
          >
            <Home className="w-4 h-4 fill-current" />
            <span>Go to Homepage</span>
          </Link>
        </div>

        {/* or separator line */}
        <div className="flex items-center justify-center space-x-3 text-xs font-bold text-gray-400">
          <div className="w-10 h-px bg-gray-200"></div>
          <span>or</span>
          <div className="w-10 h-px bg-gray-200"></div>
        </div>

        {/* Search Bar */}
        <div className="max-w-lg mx-auto relative">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for tools (e.g. PDF to JPG, Merge PDF...)"
              className="w-full pl-12 pr-28 py-3.5 bg-white border border-gray-300 rounded-xl shadow-xs text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-saffron/10 focus:border-saffron"
            />
            <button className="absolute right-2 px-4 py-2 bg-saffron-50 border border-saffron-100 hover:bg-saffron hover:text-white rounded-lg text-xs font-bold text-saffron transition-all">
              Search
            </button>
          </div>
        </div>

        {/* Popular Links grid of 5 columns */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Popular Links</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <Link to="/" className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron flex items-center justify-center">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors">All Tools</h3>
            </Link>

            <Link to="/tools/pdf-to-jpg" className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron flex items-center justify-center">
                <FileText className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors">PDF Tools</h3>
            </Link>

            <Link to="/tools/jpg-to-png" className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-indicGreen flex items-center justify-center">
                <ImageIcon className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors">Image Tools</h3>
            </Link>

            <Link to="/about" className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Info className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors">About Us</h3>
            </Link>

            <a href="#contact" className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors">Contact Us</h3>
            </a>
          </div>
        </div>

        {/* Need Help container block at the bottom */}
        <div className="bg-saffron-50/20 border border-saffron-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left mt-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 bg-white border border-saffron-100 rounded-2xl flex items-center justify-center shadow-xs flex-shrink-0">
              <FileQuestion className="w-8 h-8 text-saffron" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 leading-tight">Need Help?</h3>
              <p className="text-xs text-gray-500 font-medium">If you think something is broken, please let us know.</p>
            </div>
          </div>

          <a
            href="#support"
            className="w-full sm:w-auto px-5 py-2.5 bg-white border border-gray-300 hover:border-saffron rounded-xl text-xs font-extrabold text-charcoal-700 flex items-center justify-center space-x-1.5 transition-all shadow-3xs"
          >
            <PhoneCall className="w-4 h-4 text-saffron" />
            <span>Contact Support</span>
          </a>
        </div>

      </div>
    </div>
  );
}
