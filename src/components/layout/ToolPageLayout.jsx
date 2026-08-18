import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Shield, Zap, Lock, ArrowRight, HelpCircle, Info, FileText } from 'lucide-react';
import AdSlot from '../ads/AdSlot';
import { GET_RELATED_TOOLS } from '../../data/tools';

export default function ToolPageLayout({ tool, children }) {
  const relatedTools = GET_RELATED_TOOLS(tool.slug).slice(0, 5);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    operatingSystem: 'Any',
    applicationCategory: tool.category === 'pdf' ? 'PDFApplication' : 'ImageApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: tool.seoDescription,
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Dynamic SEO JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-gray-400">
          <Link to="/" className="hover:text-saffron transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="capitalize hover:text-saffron transition-colors">{tool.category} Tools</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <span className="text-charcoal-800 font-bold truncate">{tool.name}</span>
        </nav>

        {/* Page Header (Desktop splits, Mobile stacks) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-4">
          <div className="space-y-4 text-center lg:text-left lg:max-w-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-charcoal-900 tracking-tight leading-tight">
              {tool.name} Converter
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed font-medium">
              {tool.description} Your files never leave your device.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-saffron-50 border border-saffron-100 text-saffron text-xs font-bold rounded-full">
                <Zap className="w-3.5 h-3.5" />
                <span>100% Free</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-saffron-50 border border-saffron-100 text-saffron text-xs font-bold rounded-full">
                <Shield className="w-3.5 h-3.5" />
                <span>No Uploads</span>
              </span>
              <span className="inline-flex items-center space-x-1 px-3 py-1 bg-saffron-50 border border-saffron-100 text-saffron text-xs font-bold rounded-full">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
              </span>
            </div>
          </div>

          {/* Right side page header 3D icon */}
          <div className="flex-shrink-0 flex justify-center">
            <img src="/pdf-icon-3d.svg" alt="PDF Icon Page Header" className="w-36 h-auto drop-shadow-xl" />
          </div>
        </div>

        {/* Tool Widget Container (Passed down from children) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-8 shadow-xs">
          {children}
        </div>

        {/* Ad Slot #1 */}
        <div className="pt-2">
          <AdSlot id={`ad-tool-top-${tool.slug}`} />
        </div>

        {/* Split Section: How It Works vs FAQ (Side-by-side on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-4">
          
          {/* How It Works (Left column) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-extrabold text-charcoal-900 tracking-tight">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-saffron text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                  Upload your files using the upload box above.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-saffron text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                  Choose your preferred options, quality, and output format.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-saffron text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                  Click the convert button and wait for client-side processing.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-saffron text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </div>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-semibold">
                  Download your output files instantly. All done!
                </p>
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion (Right column) */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-extrabold text-charcoal-900 tracking-tight">Frequently Asked Questions</h2>
            
            <div className="space-y-3">
              {tool.faqs && tool.faqs.map((faq, index) => (
                <details key={index} className="group bg-white border border-gray-200/80 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between cursor-pointer focus:outline-none">
                    <span className="text-xs sm:text-sm font-bold text-charcoal-800 leading-snug">{faq.question}</span>
                    <span className="ml-1.5 flex-shrink-0 transition-transform group-open:-rotate-180">
                      <ChevronRight className="w-4 h-4 text-gray-500 rotate-90" />
                    </span>
                  </summary>
                  <p className="text-xs text-gray-500 mt-2.5 leading-relaxed font-medium">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

        </div>

        {/* Related Tools Section (5 white cards) */}
        {relatedTools.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-charcoal-900">Related Tools</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {relatedTools.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/tools/${rel.slug}`}
                  className="group bg-white p-4 rounded-xl border border-gray-200/80 hover:border-saffron/50 hover:shadow-xs transition-all flex flex-col items-center text-center space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-saffron-50 text-saffron flex items-center justify-center group-hover:bg-saffron group-hover:text-white transition-colors">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-xs font-bold text-charcoal-800 group-hover:text-saffron transition-colors truncate w-full">
                    {rel.name}
                  </h3>
                </Link>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-indicGreen hover:underline">
                <span>View all PDF tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Ad Slot #2 */}
        <AdSlot id={`ad-tool-bottom-${tool.slug}`} />

      </div>
    </div>
  );
}
