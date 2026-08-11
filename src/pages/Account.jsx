import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { TOOLS } from '../data/tools';
import { User, LogOut, Clock, Star, Settings, ShieldAlert, ArrowRight, ShieldCheck, Check, FileText } from 'lucide-react';

export default function Account() {
  const [user, setUser] = useState(null);
  const [conversions, setConversions] = useState([]);
  const [stats, setStats] = useState({ total: 0, monthly: 0, favorite: 'None', favoriteCount: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser(session.user);
      await fetchRealConversions(session.user.id);
      setLoading(false);
    }

    loadUserData();
  }, [navigate]);

  const fetchRealConversions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_conversions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        setConversions([]);
        return;
      }

      let monthly = 0;
      const toolCounts = {};
      const now = new Date();
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();

      const formattedConversions = data.map(item => {
        const d = new Date(item.created_at);
        if (d.getMonth() === thisMonth && d.getFullYear() === thisYear) {
          monthly++;
        }
        toolCounts[item.tool_slug] = (toolCounts[item.tool_slug] || 0) + 1;

        return {
          filename: `Converted_File_${d.getTime().toString().slice(-4)}`,
          size: '--',
          tool: TOOLS.find(t => t.slug === item.tool_slug)?.name || item.tool_slug,
          slug: item.tool_slug,
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
      });

      let favorite = 'None';
      let maxCount = 0;
      Object.keys(toolCounts).forEach(slug => {
        if (toolCounts[slug] > maxCount) {
          maxCount = toolCounts[slug];
          favorite = TOOLS.find(t => t.slug === slug)?.name || slug;
        }
      });

      setStats({
        total: data.length,
        monthly: monthly,
        favorite: favorite,
        favoriteCount: maxCount
      });

      setConversions(formattedConversions);
    } catch (err) {
      console.error(err);
      setConversions([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs sm:text-sm font-semibold text-gray-500">
        Loading Account Dashboard...
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden bg-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1.5 text-xs font-semibold text-gray-400">
          <Link to="/" className="hover:text-saffron transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="hover:text-saffron transition-colors">Account</span>
          <span>&gt;</span>
          <span className="text-charcoal-800 font-bold">My Conversions</span>
        </nav>

        {/* Dashboard Header Title */}
        <div className="space-y-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">My Account</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Manage your conversions and preferences</p>
        </div>

        {/* KPI Stats cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron flex items-center justify-center border border-saffron-100 flex-shrink-0">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Conversions</p>
              <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{stats.total}</h3>
              <p className="text-[9px] text-gray-400 font-semibold">All time</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border border-emerald-100 flex-shrink-0">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">This Month</p>
              <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{stats.monthly}</h3>
              <p className="text-[9px] text-gray-400 font-semibold">Conversions</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
              <Clock className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Storage Saved</p>
              <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">-- GB</h3>
              <p className="text-[9px] text-gray-400 font-semibold">Across all files</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 flex-shrink-0">
              <FileText className="w-5.5 h-5.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Favorite Tool</p>
              <h3 className="text-sm sm:text-base font-black text-charcoal-900 leading-tight truncate max-w-[120px]">{stats.favorite}</h3>
              <p className="text-[9px] text-gray-400 font-semibold">Used {stats.favoriteCount} times</p>
            </div>
          </div>
        </div>

        {/* 3-Column Split Dashboard Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Column 1: Left Menu Sidebar (3 span) */}
          <div className="lg:col-span-3 bg-white border border-gray-200 rounded-3xl p-5 space-y-4 shadow-3xs">
            <nav className="space-y-1 text-xs font-bold text-charcoal-700">
              <Link to="/account" className="flex items-center space-x-3 p-3 rounded-xl bg-saffron-50/50 text-saffron border border-saffron-100">
                <Clock className="w-4 h-4" />
                <span>My Conversions</span>
              </Link>
              <a href="#favorites" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Star className="w-4 h-4 text-gray-400" />
                <span>Favorites</span>
              </a>
              <a href="#profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <User className="w-4 h-4 text-gray-400" />
                <span>Profile</span>
              </a>
              <a href="#preferences" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Preferences</span>
              </a>
              <a href="#security" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <ShieldAlert className="w-4 h-4 text-gray-400" />
                <span>Security</span>
              </a>
              
              <div className="border-t border-gray-100 my-2 pt-2"></div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Logout</span>
              </button>
            </nav>
          </div>

          {/* Column 2: Center Table (6 span) */}
          <div className="lg:col-span-6 bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-base sm:text-lg font-black text-charcoal-900">Recent Conversions</h2>
              <a href="#all" className="text-xs font-bold text-saffron hover:underline">View all</a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="py-2.5 font-bold uppercase tracking-wider">File Name</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider hidden sm:table-cell">Tool Used</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider">Date & Time</th>
                    <th className="py-2.5 font-bold uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-charcoal-800 font-semibold">
                  {conversions.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-500 font-medium text-xs">
                        No conversions yet. Go try some tools!
                      </td>
                    </tr>
                  )}
                  {conversions.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50">
                      <td className="py-3 pr-2 flex items-center space-x-2 truncate max-w-[150px]">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${item.filename.endsWith('pdf') ? 'bg-saffron-50 text-saffron' : 'bg-emerald-50 text-indicGreen'}`}>
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate">
                          <p className="truncate text-xs font-bold">{item.filename}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{item.size}</p>
                        </div>
                      </td>
                      <td className="py-3 hidden sm:table-cell">
                        <span className="inline-flex items-center space-x-1 text-xs text-gray-500 font-bold">
                          <span>{item.tool}</span>
                        </span>
                      </td>
                      <td className="py-3 text-gray-500 text-[10px] sm:text-xs">
                        <p>{item.date}</p>
                        <p className="text-[10px] text-gray-400">{item.time}</p>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          to={`/tools/${item.slug}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 hover:border-saffron hover:bg-saffron hover:text-white rounded-xl text-[10px] font-extrabold text-charcoal-700 transition-all"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-center pt-3 border-t border-gray-100">
              <Link to="/" className="inline-flex items-center space-x-1 text-xs font-bold text-saffron hover:underline">
                <span>View all conversions</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Column 3: Right Sidebar Feature Box (3 span) */}
          <div className="lg:col-span-3 bg-saffron-50/30 border border-saffron-100 rounded-3xl p-6 shadow-3xs space-y-6 flex flex-col items-center text-center">
            {/* Graphic Representation */}
            <div className="w-28 h-28 bg-white border border-saffron-100 rounded-full flex items-center justify-center shadow-xs relative">
              <div className="w-20 h-20 bg-saffron-50 rounded-full flex items-center justify-center">
                <FileText className="w-10 h-10 text-saffron" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 leading-tight">All your conversions. Always with you.</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                Sign in to keep your history, access your files anywhere, and never lose your conversions again.
              </p>
            </div>

            <ul className="text-left text-xs font-bold text-charcoal-800 space-y-2 w-full pl-2">
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indicGreen flex-shrink-0" />
                <span>Access from any device</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indicGreen flex-shrink-0" />
                <span>View conversion history</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indicGreen flex-shrink-0" />
                <span>Save your favorite tools</span>
              </li>
              <li className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-indicGreen flex-shrink-0" />
                <span>100% private and secure</span>
              </li>
            </ul>

            <Link
              to="/"
              className="w-full py-3 bg-saffron hover:bg-saffron-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors"
            >
              Explore Tools
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
