import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-gray-300 pt-16 pb-8 border-t border-gray-800 w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <img src="/logo-dark-bg.svg" alt="IndianTools Logo" className="h-10 w-auto" />
            </Link>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              India's own privacy-first file toolkit. Convert, merge, split, and compress PDF documents, and resize, compress, or convert images 100% locally in your browser.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a href="#github" className="p-2 bg-gray-800 hover:bg-saffron hover:text-white rounded-lg text-gray-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 bg-gray-800 hover:bg-saffron hover:text-white rounded-lg text-gray-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#linkedin" className="p-2 bg-gray-800 hover:bg-saffron hover:text-white rounded-lg text-gray-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#mail" className="p-2 bg-gray-800 hover:bg-saffron hover:text-white rounded-lg text-gray-400 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Popular Tools */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Popular Tools</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li><Link to="/tools/pdf-to-jpg" className="hover:text-saffron transition-colors">PDF to JPG Converter</Link></li>
              <li><Link to="/tools/merge-pdf" className="hover:text-saffron transition-colors">Merge PDF Files</Link></li>
              <li><Link to="/tools/compress-pdf" className="hover:text-saffron transition-colors">Compress PDF Size</Link></li>
              <li><Link to="/tools/jpg-to-png" className="hover:text-saffron transition-colors">JPG to PNG Converter</Link></li>
              <li><Link to="/tools/image-compressor" className="hover:text-saffron transition-colors">Image Compressor</Link></li>
              <li><Link to="/tools/webp-to-jpg" className="hover:text-saffron transition-colors">WebP to JPG Converter</Link></li>
            </ul>
          </div>

          {/* Column 3: Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Country Highlight */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Legal</h4>
            <ul className="space-y-2 text-xs font-semibold text-gray-400">
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms of Use</a></li>
            </ul>

            <div className="pt-4 space-y-2">
              <p className="text-xs font-bold text-white">Made with ❤️ in India</p>
              <p className="text-[10px] text-gray-500">for the world.</p>
              {/* Tricolor accent bar */}
              <div className="flex items-center space-x-1 pt-1">
                <div className="w-8 h-1 bg-saffron rounded-full"></div>
                <div className="w-8 h-1 bg-gray-400 rounded-full"></div>
                <div className="w-8 h-1 bg-indicGreen rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar separator line */}
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-gray-500">
          <p className="flex items-center space-x-1.5 bg-gray-800/40 border border-gray-800 px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-indicGreen flex-shrink-0" />
            <span className="text-[11px] text-gray-400">All processing happens in your browser. Files are never uploaded.</span>
          </p>

          <p className="text-[11px] text-gray-500">
            © {new Date().getFullYear()} IndianTools. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
