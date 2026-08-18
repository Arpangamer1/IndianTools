import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { User, LogOut, Menu, X, ChevronDown, ShieldCheck, Sun, Moon, Home, Layers, Settings, FileText, HelpCircle, Phone, Info, Mail } from 'lucide-react';

export default function Header() {
  const [session, setSession] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setToolsDropdownOpen(false);
  }, [location]);

  // Click outside to close tools dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToolsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Wordmark */}
        <Link to="/" className="flex items-center">
          <img src="/logo-primary.svg" alt="IndianTools Logo" className="h-10 w-auto" />
        </Link>

        {/* Central / Right Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold text-charcoal-700">
          {/* Tools Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
              className="flex items-center space-x-1 hover:text-saffron transition-colors focus:outline-none"
              aria-label="Toggle Tools Dropdown"
              aria-haspopup="true"
              aria-expanded={toolsDropdownOpen}
            >
              <span>Tools</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {toolsDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl p-3 z-50 animate-fade-in">
                <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold px-3 py-1">Tool Categories</p>
                <Link to="/" className="block px-3 py-2 rounded-lg hover:bg-saffron-50 hover:text-saffron transition-colors">
                  All 24 Tools
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link to="/tools/pdf-to-jpg" className="block px-3 py-2 rounded-lg hover:bg-saffron-50 hover:text-saffron text-xs">
                  PDF Tools
                </Link>
                <Link to="/tools/jpg-to-png" className="block px-3 py-2 rounded-lg hover:bg-saffron-50 hover:text-saffron text-xs">
                  Image Tools
                </Link>
              </div>
            )}
          </div>

          <Link to="/about" className="hover:text-saffron transition-colors">
            About
          </Link>
          <Link to="/privacy" className="hover:text-saffron transition-colors">
            Privacy
          </Link>
          <Link to="/contact" className="hover:text-saffron transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop CTA / Auth Button */}
        <div className="hidden lg:flex items-center space-x-4">
          {session ? (
            <div className="flex items-center space-x-4">
              <Link to="/account" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-saffron text-white font-bold flex items-center justify-center text-xs">
                  {session.user.email[0].toUpperCase()}
                </div>
                <span className="text-xs font-bold text-charcoal-700">Hi, User</span>
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-gray-400 hover:text-red-500 transition-colors"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-charcoal-700 hover:text-saffron transition-colors">
                Login
              </Link>
              <Link
                to="/login"
                className="px-5 py-2.5 bg-saffron hover:bg-saffron-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all"
              >
                My Account
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger menu toggle button */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-charcoal-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Slide-over mobile sidebar drawer (Screen 11 mockup style) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop mask */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-full bg-white h-full shadow-2xl flex flex-col p-6 animate-slide-in overflow-y-auto">
            {/* Header with Close and Profile */}
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 rounded-full bg-saffron-100 text-saffron flex items-center justify-center font-bold text-sm">
                  {session ? session.user.email[0].toUpperCase() : 'G'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-charcoal-900">{session ? session.user.email : 'Guest User'}</p>
                  {session ? (
                    <Link to="/account" className="text-[10px] text-gray-400 font-semibold hover:underline">
                      View Account
                    </Link>
                  ) : (
                    <Link to="/login" className="text-[10px] text-saffron font-bold hover:underline">
                      Login / Register
                    </Link>
                  )}
                </div>
              </div>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-charcoal rounded-lg hover:bg-gray-50"
                aria-label="Close mobile navigation menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Links */}
            <nav className="flex-grow py-6 flex flex-col space-y-1.5 text-xs font-bold text-charcoal-800">
              <Link to="/" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <Home className="w-4 h-4 text-gray-400" />
                <span>Home</span>
              </Link>

              <Link to="/" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <Layers className="w-4 h-4 text-gray-400" />
                <span>All Tools</span>
              </Link>

              <Link to="/tools/pdf-to-jpg" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <FileText className="w-4 h-4 text-gray-400" />
                <span>PDF Tools</span>
              </Link>

              <Link to="/tools/jpg-to-png" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <Layers className="w-4 h-4 text-gray-400" />
                <span>Image Tools</span>
              </Link>

              <Link to="/about" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <Info className="w-4 h-4 text-gray-400" />
                <span>About</span>
              </Link>

              <Link to="/privacy" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <span>Privacy Policy</span>
              </Link>

              <Link to="/contact" className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 hover:text-saffron transition-all">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>Contact</span>
              </Link>

              {/* Theme Toggle option */}
              <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  {theme === 'light' ? <Sun className="w-4 h-4 text-gray-400" /> : <Moon className="w-4 h-4 text-gray-400" />}
                  <span>Theme</span>
                </div>
                <button
                  onClick={toggleTheme}
                  className="w-10 h-5 bg-gray-200 rounded-full p-0.5 transition-colors focus:outline-none"
                  aria-label="Toggle theme mode"
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {session ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 p-2.5 rounded-xl text-saffron hover:bg-saffron-50 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Login / Register</span>
                </Link>
              )}
            </nav>

            <div className="pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center font-semibold">
              🔒 In-Browser Execution
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
