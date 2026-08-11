import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle, FileText, Trash2, Mail, Users, Info, Settings } from 'lucide-react';

export default function Privacy() {
  useEffect(() => {
    document.title = 'Privacy Policy — IndianTools';
  }, []);

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400">
          <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-charcoal-800 font-bold">Privacy Policy</span>
        </nav>

        {/* Hero Header (Desktop splits, Mobile stacks) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-4">
          <div className="space-y-4 text-center lg:text-left lg:max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">Privacy Policy</h1>
            <p className="text-base sm:text-lg text-gray-600 font-bold">Your privacy is our priority.</p>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-medium">
              At IndianTools, we believe in complete transparency. This policy explains what information we collect (very little), how we use it, and why your files never leave your device.
            </p>
            <p className="text-xs text-gray-400 font-semibold">Last updated: May 10, 2025</p>
          </div>

          {/* Right side check lock badge card */}
          <div className="w-full sm:w-auto bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6 text-center space-y-3 flex-shrink-0 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border-2 border-indicGreen/30 relative">
              <Lock className="w-7 h-7" />
              <div className="absolute -bottom-1 -right-1 bg-indicGreen text-white p-0.5 rounded-full border-2 border-white">
                <CheckCircle className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-indicGreen">100% Private. Always.</h3>
            <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
              All conversions happen in your browser. No uploads. No servers. No worries.
            </p>
          </div>
        </div>

        {/* Four Privacy Principles Section */}
        <section className="space-y-8 pt-10 border-t border-gray-100">
          <div className="text-center space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">Our Privacy Principles</h2>
            <div className="w-12 h-1 bg-saffron mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border border-emerald-100">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Nothing is Uploaded</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                Your files never leave your device. All conversions happen entirely in your browser.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100/80 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron flex items-center justify-center border border-saffron-100">
                <Lock className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">We Collect Very Little</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                We only collect minimal analytics data to improve our tools and understand what users find helpful.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100/80 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Users className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Your Choice</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                You can use all tools without creating an account. Account is optional and completely up to you.
              </p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100/80 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Shield className="w-5.5 h-5.5" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">Privacy First</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed font-semibold">
                We design every feature with your privacy in mind. It's not an add-on, it's our foundation.
              </p>
            </div>
          </div>
        </section>

        {/* Content sections grid split (Left details, Right sidebar box) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8 border-t border-gray-100 items-start">
          
          {/* Left Column (Sections 1-6) */}
          <div className="lg:col-span-8 space-y-8 font-semibold">
            
            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">1. Information We Collect</h3>
                <p className="text-xs text-gray-500 font-medium">We collect only the information necessary to provide and improve IndianTools.</p>
                <ul className="list-disc list-inside text-xs text-gray-500 space-y-1 pl-1 font-medium">
                  <li>Tool usage analytics (e.g., which tools are used, number of conversions)</li>
                  <li>Anonymous usage data (e.g., browser type, device type, country)</li>
                  <li>Account information (only if you create an account): name, email address</li>
                  <li className="text-saffron font-bold">We never collect, store, or transmit your files or file contents.</li>
                </ul>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <Settings className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">2. How We Use Information</h3>
                <ul className="list-disc list-inside text-xs text-gray-500 space-y-1 pl-1 font-medium">
                  <li>To operate and maintain the website and tools</li>
                  <li>To understand tool usage and improve user experience</li>
                  <li>To troubleshoot issues and ensure website security</li>
                  <li>To communicate with you (only if you're a registered user)</li>
                </ul>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <Shield className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">3. Data Storage & Security</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  We use industry-standard security practices to protect your information. Since your files never leave your device, there is no risk of file data exposure from our side.
                </p>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">4. Third-Party Services</h3>
                <p className="text-xs text-gray-500 font-medium">We use the following third-party services that may collect limited data:</p>
                <ul className="list-disc list-inside text-xs text-gray-500 space-y-1 pl-1 font-medium">
                  <li>Google Analytics – to understand website traffic and usage (anonymized)</li>
                  <li>Google AdSense – to display ads. They may use cookies to personalize ads</li>
                </ul>
                <p className="text-[10px] text-gray-400 font-medium">These services have their own privacy policies.</p>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">5. Data Retention</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  We retain analytics data in aggregate form for up to 26 months. If you create an account, your data remains until you delete your account.
                </p>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-2.5 bg-gray-100 rounded-xl text-charcoal-800 flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-black text-charcoal-900">6. Contact Us</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  If you have any questions about this Privacy Policy, feel free to contact us at{' '}
                  <a href="mailto:privacy@indiantools.in" className="text-saffron underline font-bold">privacy@indiantools.in</a>
                </p>
              </div>
            </section>

          </div>

          {/* Right Column (Cookies & Advertising Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-charcoal-900">Cookies & Advertising</h3>
              
              <div className="space-y-4 font-semibold text-xs text-charcoal-800">
                <div className="space-y-1">
                  <p className="flex items-center space-x-1.5 text-charcoal-900 font-bold">
                    <span>🍪 Cookies</span>
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    We use cookies to enhance your experience and analyze website traffic. You can control cookies through your browser settings.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="flex items-center space-x-1.5 text-charcoal-900 font-bold">
                    <span>Ads Google AdSense</span>
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    We use Google AdSense to display ads on our website. Google may use cookies and similar technologies to serve ads based on your prior visits.
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    You can learn more or opt out by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-saffron underline">Ad Settings</a>.
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="flex items-center space-x-1.5 text-charcoal-900 font-bold">
                    <span>👤 Your Rights</span>
                  </p>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    You have the right to access, update, or delete your personal information. You can do this anytime from your account settings or by contacting us.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl text-emerald-800 text-[11px] font-semibold flex items-center space-x-1.5">
                <CheckCircle className="w-4 h-4 text-indicGreen flex-shrink-0" />
                <span>IndianTools will always be free, private, and user-first. That's a promise.</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
