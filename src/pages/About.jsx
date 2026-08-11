import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Rocket, Globe, Heart, Check, Lock, Code } from 'lucide-react';

export default function About() {
  useEffect(() => {
    document.title = "About IndianTools — India's Own Privacy-First File Toolkit";
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400">
          <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-charcoal-800 font-bold">About</span>
        </nav>

        {/* Hero Section (Desktop splits, Mobile stacks) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Mission Description */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black text-charcoal-900 tracking-tight leading-tight">
                About <span className="text-saffron">IndianTools</span>
              </h1>
              <h2 className="text-lg sm:text-xl font-bold text-gray-700">
                Built in <span className="text-saffron">India</span>. Free for everyone.
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                IndianTools is a free, all-in-one toolkit for PDF and image conversions. Every tool runs directly in your browser — your files never leave your device. No uploads, no servers, no compromises on your privacy.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Our mission is simple: powerful tools, accessible to everyone, anywhere in the world.
              </p>
            </div>

            {/* Pills list */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2 text-xs font-bold text-gray-500">
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                <Check className="w-3.5 h-3.5 text-saffron" />
                <span>100% Free</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                <Lock className="w-3.5 h-3.5 text-saffron" />
                <span>100% Private</span>
              </span>
              <span className="flex items-center space-x-1.5 bg-gray-50 px-3.5 py-1.5 rounded-full border border-gray-100">
                <Zap className="w-3.5 h-3.5 text-saffron" />
                <span>100% Browser-Based</span>
              </span>
            </div>
          </div>

          {/* Right Column: Founder Card */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Founder Avatar Photo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
              <div className="w-full h-full bg-charcoal flex items-center justify-center text-white text-3xl font-black">AC</div>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Meet the Founder</p>
              <h3 className="text-lg sm:text-xl font-black text-charcoal-900 leading-none">Arpan Chakraborty</h3>
              <p className="text-[10px] font-extrabold text-saffron uppercase tracking-widest">Founder & Developer</p>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Hi, I'm Arpan Chakraborty, the founder of IndianTools. I built this platform with a simple goal — to create fast, free, and private tools that respect your data and make everyday tasks easier.
              </p>
              <p className="text-xs text-gray-500 font-semibold">Thank you for trusting IndianTools.</p>
              {/* Script font signature fallback */}
              <p className="font-serif italic text-base font-bold text-charcoal-800 tracking-wider">Arpan Chakraborty</p>
            </div>
          </div>

        </div>

        {/* 4-column Why IndianTools? section */}
        <section className="space-y-8 pt-10 border-t border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">Why IndianTools?</h2>
            <div className="w-12 h-1 bg-saffron mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border border-emerald-100">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Your Privacy Matters</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                All processing happens in your browser. Your files never leave your device.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron flex items-center justify-center border border-saffron-100">
                <Zap className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Free. No Limits.</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                All 24 tools are completely free with no hidden costs, sign-ups, or watermarks.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Rocket className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Fast & Easy</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                Built for speed and simplicity. Convert your files in just a few seconds.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Globe className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Made in India</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                Proudly built in India with a mission to create world-class tools for everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission split layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 border-t border-gray-100">
          {/* Left Column: Graphic browser representation */}
          <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-3xl p-6 relative min-h-[220px] flex items-center justify-center shadow-inner">
            <div className="w-full bg-white border border-gray-300 rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-1.5 pb-2 border-b border-gray-100">
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full"></div>
              </div>
              <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-xs text-gray-400 font-bold">
                Drop Zone Mockup
              </div>
            </div>
          </div>

          {/* Right Column: Mission Text */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900">Our Mission</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              We believe useful tools should be simple, fast, and accessible to everyone. Whether you're a student, a professional, or just someone who needs to get things done — **IndianTools** is here to help.
            </p>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
              No subscriptions. No data collection. Just tools that work — right in your browser.
            </p>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs sm:text-sm font-semibold flex items-center space-x-2">
              <Heart className="w-4 h-4 text-indicGreen flex-shrink-0" />
              <span>IndianTools will always be free, private, and user-first. That's a promise.</span>
            </div>
          </div>
        </section>

        {/* Technologies Grid */}
        <section className="space-y-6 pt-10 border-t border-gray-100 text-center">
          <h2 className="text-base sm:text-lg font-bold text-charcoal-900">Built With Modern Web Technologies</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-bold text-gray-500">
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-blue-400" />
              <span>React</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-purple-400" />
              <span>Vite</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-sky-400" />
              <span>Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-saffron" />
              <span>pdf-lib</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-saffron" />
              <span>pdf.js</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-green-500" />
              <span>JSZip</span>
            </div>
            <div className="flex flex-col items-center space-y-1">
              <Code className="w-6 h-6 text-blue-500" />
              <span>FileSaver.js</span>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 font-medium">All conversions happen 100% in your browser using powerful client-side libraries.</p>
        </section>

      </div>
    </div>
  );
}
