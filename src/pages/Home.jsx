import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TOOLS } from '../data/tools';
import AdSlot from '../components/ads/AdSlot';
import { Search, Shield, Zap, Lock, Globe, Heart, FileText, Image as ImageIcon, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    document.title = "IndianTools — India's Own File Toolkit | 100% Free & Private";
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const query = searchQuery.toLowerCase();
    return TOOLS.filter(
      (t) => t.name.toLowerCase().includes(query) || t.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const pdfTools = useMemo(() => filteredTools.filter((t) => t.category === 'pdf'), [filteredTools]);
  const imageTools = useMemo(() => filteredTools.filter((t) => t.category === 'image'), [filteredTools]);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white">
      
      {/* 1. HERO SECTION (Desktop splits, Mobile stacks) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-16 pb-12 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Copy & Input */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-tight sm:leading-none">
                Built in <span className="text-saffron">India</span>.<br className="hidden sm:inline" />
                Free for everyone.
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Your all-in-one toolkit for PDF and image conversions. 100% free, secure, and runs right in your browser.
              </p>
            </div>

            {/* Badges Inline Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Shield className="w-3.5 h-3.5 text-saffron" />
                <span>Nothing is uploaded</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Zap className="w-3.5 h-3.5 text-saffron" />
                <span>24 tools</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                <Lock className="w-3.5 h-3.5 text-saffron" />
                <span>100% private</span>
              </span>
            </div>

            {/* Search Input Box */}
            <div className="max-w-md sm:max-w-xl mx-auto lg:mx-0 relative pt-2">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search tools (e.g., PDF to JPG)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-300 rounded-xl shadow-xs focus:border-saffron focus:ring-2 focus:ring-saffron/10 text-xs sm:text-sm font-semibold transition-all"
                />
              </div>
            </div>

            {/* Micro details */}
            <div className="space-y-1.5 pt-1 text-xs text-gray-500 font-medium">
              <p className="flex items-center justify-center lg:justify-start space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-gray-400" />
                <span>Convert anything. Nothing ever leaves your device.</span>
              </p>
              <p lang="hi" className="font-semibold text-saffron text-center lg:text-left flex items-center justify-center lg:justify-start space-x-1">
                <span>भारत में बना, दुनिया के लिए</span>
                <Heart className="w-3.5 h-3.5 text-saffron fill-current" />
              </p>
            </div>
          </div>

          {/* Right Column: Giant 3D Icon Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <img
              src="/pdf-icon-3d.svg"
              alt="IndianTools PDF Icon"
              width={240}
              height={300}
              className="w-48 sm:w-60 lg:w-72 h-auto drop-shadow-2xl hover:scale-105 transition-transform duration-300"
            />
          </div>

        </div>
      </section>

      {/* 2. PDF TOOLS SECTION (6-column desktop cards) */}
      <section className="bg-gray-50/50 py-12 sm:py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">PDF Tools</h2>
            <div className="w-12 h-1 bg-saffron mx-auto rounded-full"></div>
          </div>

          {pdfTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pdfTools.map((tool) => {
                const IconComponent = Icons[tool.icon] || FileText;
                return (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="group bg-white border border-gray-200 hover:border-saffron/40 rounded-xl p-4 shadow-3xs hover:shadow-xs transition-all text-center flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-saffron-50 text-saffron flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-saffron transition-colors truncate w-full">
                      {tool.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400">No matching PDF tools found.</p>
          )}

          <div className="text-center pt-2">
            <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-saffron hover:underline">
              <span>View all 13 PDF tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Slot #1 — Styled Banner */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdSlot id="home-mid-slot" />
      </div>

      {/* 3. IMAGE TOOLS SECTION (6-column desktop cards) */}
      <section className="bg-gray-50/50 py-12 sm:py-16 border-t border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">Image Tools</h2>
            <div className="w-12 h-1 bg-indicGreen mx-auto rounded-full"></div>
          </div>

          {imageTools.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {imageTools.map((tool) => {
                const IconComponent = Icons[tool.icon] || ImageIcon;
                return (
                  <Link
                    key={tool.slug}
                    to={`/tools/${tool.slug}`}
                    className="group bg-white border border-gray-200 hover:border-indicGreen/40 rounded-xl p-4 shadow-3xs hover:shadow-xs transition-all text-center flex flex-col items-center space-y-3"
                  >
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-indicGreen flex items-center justify-center group-hover:bg-indicGreen group-hover:text-white transition-colors">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-charcoal-900 group-hover:text-indicGreen transition-colors truncate w-full">
                      {tool.name}
                    </h3>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-xs text-gray-400">No matching Image tools found.</p>
          )}

          <div className="text-center pt-2">
            <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-indicGreen hover:underline">
              <span>View all 11 image tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Ad Slot #2 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <AdSlot id="home-bottom-slot" />
      </div>

      {/* 4. WHY INDIANTOOLS SECTION */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-charcoal-900 tracking-tight">Why IndianTools?</h2>
          <div className="w-12 h-1 bg-indicGreen mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          <div className="space-y-3.5 text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-saffron-50 text-saffron flex items-center justify-center border border-saffron-100">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">Nothing is uploaded</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              All conversions happen in your browser. Your files stay on your device and are never sent anywhere.
            </p>
          </div>

          <div className="space-y-3.5 text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border border-emerald-100">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">Free, no limits</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              All 24 tools are completely free with no sign-up required. No watermarks, no restrictions, no hidden costs.
            </p>
          </div>

          <div className="space-y-3.5 text-center bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-saffron flex items-center justify-center border border-red-100">
              <Heart className="w-6 h-6 text-saffron fill-current" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal-900">Built in India</h3>
            <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
              Proudly built by a small team in India with a mission to create world-class, privacy-first tools for everyone.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
