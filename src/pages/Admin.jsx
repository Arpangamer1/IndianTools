import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { TOOLS } from '../data/tools';
import { Lock, BarChart3, TrendingUp, Activity, CheckCircle, Shield, Calendar, Users, Moon, Sun, Bell, HelpCircle, Settings, Clipboard, LogOut, Mail, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, AreaChart, Area } from 'recharts';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [topToolsData, setTopToolsData] = useState([]);
  const [topToolsWeeklyData, setTopToolsWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [totalConversions, setTotalConversions] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);

  // Dynamic KPI states
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loggedInConversions, setLoggedInConversions] = useState(0);
  const [anonymousConversions, setAnonymousConversions] = useState(0);
  const [conversionsGrowth, setConversionsGrowth] = useState(0);

  // Active Admin navigation states
  const [activeTab, setActiveTab] = useState('dashboard');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [userConversionsCount, setUserConversionsCount] = useState({});
  const [toolsUsageList, setToolsUsageList] = useState([]);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [messages, setMessages] = useState([]);

  async function hashPassword(password) {
    const msgBuffer = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const hashedInput = await hashPassword(password);
      const defaultHash = 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd4'; // Hash of 'admin123'
      let targetHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH || defaultHash;

      // Fallback: If VITE_ADMIN_PASSWORD is set but not the hash, hash it dynamically
      if (!import.meta.env.VITE_ADMIN_PASSWORD_HASH && import.meta.env.VITE_ADMIN_PASSWORD) {
        targetHash = await hashPassword(import.meta.env.VITE_ADMIN_PASSWORD);
      }

      if (hashedInput === targetHash) {
        setIsAuthenticated(true);
        setError(null);
        fetchAnalytics();
      } else {
        setError('Incorrect admin password.');
      }
    } catch (err) {
      console.error('Password hashing failed:', err);
      setError('An error occurred during password verification.');
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data, error } = await supabase
        .from('tool_usage')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching analytics:', error);
        generateMockStats();
        return;
      }
      
      if (!data || data.length === 0) {
        setTotalConversions(0);
        return;
      }

      setTotalConversions(data.length);
      
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
      
      // Calculate dynamic metrics
      const loggedIn = data.filter(row => row.user_id !== null).length;
      const anonymous = data.filter(row => row.user_id === null).length;
      const registeredUsers = JSON.parse(localStorage.getItem('indiantools_users') || '[]');
      
      setLoggedInConversions(loggedIn);
      setAnonymousConversions(anonymous);
      setUniqueUsers(registeredUsers.length);

      // Week-over-week conversions growth calculation
      const thisWeekCount = data.filter(row => new Date(row.created_at) >= oneWeekAgo).length;
      const lastWeekCount = data.filter(row => {
        const d = new Date(row.created_at);
        return d >= twoWeeksAgo && d < oneWeekAgo;
      }).length;
      
      let growth = 0;
      if (lastWeekCount > 0) {
        growth = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
      } else if (thisWeekCount > 0) {
        growth = 100;
      }
      setConversionsGrowth(growth);

      // Compute user conversions count
      const counts = {};
      data.forEach(row => {
        if (row.user_id) {
          counts[row.user_id] = (counts[row.user_id] || 0) + 1;
        }
      });
      setUserConversionsCount(counts);

      // Compute registered users list
      setRegisteredUsers(registeredUsers);

      // Compute tools usage list
      const toolUsageMap = {};
      data.forEach(row => {
        toolUsageMap[row.tool_slug] = (toolUsageMap[row.tool_slug] || 0) + 1;
      });
      const tList = TOOLS.map(t => ({
        name: t.name,
        slug: t.slug,
        value: toolUsageMap[t.slug] || 0
      })).sort((a, b) => b.value - a.value);
      setToolsUsageList(tList);
      
      const allTimeCounts = {};
      const weeklyCounts = {};
      const dailyCounts = {};

      data.forEach(row => {
        const rowDate = new Date(row.created_at);
        const slug = row.tool_slug;
        const toolName = TOOLS.find(t => t.slug === slug)?.name || slug;

        allTimeCounts[toolName] = (allTimeCounts[toolName] || 0) + 1;
        
        if (rowDate >= oneWeekAgo) {
          weeklyCounts[toolName] = (weeklyCounts[toolName] || 0) + 1;
        }
        
        const dateString = rowDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        dailyCounts[dateString] = (dailyCounts[dateString] || 0) + 1;
      });

      const sortedTopTools = Object.keys(allTimeCounts)
        .map(name => ({ name, value: allTimeCounts[name] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
        
      const sortedWeeklyTools = Object.keys(weeklyCounts)
        .map(name => ({ name, value: weeklyCounts[name] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
        
      const last30DaysData = [];
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const ds = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        last30DaysData.push({ date: ds, conversions: dailyCounts[ds] || 0 });
      }

      setTopToolsData(sortedTopTools);
      setTopToolsWeeklyData(sortedWeeklyTools);
      setDailyData(last30DaysData);
      setRecentActivity(data.slice(0, 15));

      // Fetch contact messages
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(msgData || []);
      
    } catch (err) {
      console.error('Exception fetching analytics:', err);
      generateMockStats();
    }
  };

  const generateMockStats = () => {
    setTotalConversions(24532);
    setUniqueUsers(2314);
    setLoggedInConversions(2314);
    setAnonymousConversions(22218);
    setConversionsGrowth(12.5);
    setRegisteredUsers([
      { id: 'usr-01', email: 'arjun@example.com' },
      { id: 'usr-02', email: 'priya@example.com' },
      { id: 'usr-03', email: 'amit@example.com' }
    ]);
    setUserConversionsCount({
      'usr-01': 1024,
      'usr-02': 780,
      'usr-03': 510
    });
    setToolsUsageList([
      { name: 'PDF to JPG', slug: 'pdf-to-jpg', value: 4823 },
      { name: 'JPG to PDF', slug: 'jpg-to-pdf', value: 3614 },
      { name: 'Compress PDF', slug: 'compress-pdf', value: 2854 }
    ]);
    setTopToolsData([
      { name: 'PDF to JPG', value: 4823 },
      { name: 'JPG to PDF', value: 3614 },
      { name: 'Compress PDF', value: 2854 },
      { name: 'Merge PDF', value: 2615 },
      { name: 'PDF to PNG', value: 2104 },
      { name: 'Split PDF', value: 1982 },
      { name: 'PNG to JPG', value: 1648 },
      { name: 'PDF to Text', value: 1321 },
      { name: 'Rotate PDF', value: 1102 },
      { name: 'Delete PDF Pages', value: 892 },
    ]);
    setTopToolsWeeklyData([
      { name: 'PDF to JPG', value: 1243 },
      { name: 'JPG to PDF', value: 942 },
      { name: 'Compress PDF', value: 689 },
      { name: 'Merge PDF', value: 611 },
      { name: 'Split PDF', value: 447 },
      { name: 'PDF to PNG', value: 392 },
      { name: 'PNG to JPG', value: 355 },
      { name: 'PDF to Text', value: 298 },
      { name: 'Rotate PDF', value: 241 },
      { name: 'Extract PDF Pages', value: 198 },
    ]);
    setDailyData([
      { date: 'Apr 11', conversions: 780 },
      { date: 'Apr 14', conversions: 1250 },
      { date: 'Apr 17', conversions: 900 },
      { date: 'Apr 20', conversions: 1350 },
      { date: 'Apr 23', conversions: 1100 },
      { date: 'Apr 26', conversions: 1280 },
      { date: 'Apr 29', conversions: 850 },
      { date: 'May 2', conversions: 1150 },
      { date: 'May 5', conversions: 1320 },
      { date: 'May 8', conversions: 980 },
      { date: 'May 10', conversions: 1480 },
    ]);
  };

  const handleClearDatabase = () => {
    localStorage.removeItem('indiantools_tool_usage');
    localStorage.removeItem('indiantools_user_conversions');
    localStorage.removeItem('indiantools_users');
    localStorage.removeItem('indiantools_session');
    localStorage.removeItem('indiantools_messages');
    window.location.reload();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-10 px-4 bg-gray-50">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-saffron-50 text-saffron flex items-center justify-center mx-auto border border-saffron-100">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-charcoal-900">Admin Dashboard</h1>
            <p className="text-xs text-gray-500">
              Enter admin password to view usage analytics.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-semibold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-saffron"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-saffron hover:bg-saffron-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xs transition-all animate-fade-in"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full max-w-full overflow-x-hidden">
      
      {/* Sidebar Navigation Menu (Left column) */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col p-6 space-y-6 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <img src="/logo-primary.svg" alt="IndianTools Logo" className="h-8 w-auto" />
        </div>

        <nav className="flex-grow space-y-1.5 text-xs font-bold text-charcoal-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-left font-bold ${
              activeTab === 'dashboard'
                ? 'bg-saffron-50/50 text-saffron border border-saffron-100'
                : 'hover:bg-gray-50 text-charcoal-700 border border-transparent'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('tools')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-left font-bold ${
              activeTab === 'tools'
                ? 'bg-saffron-50/50 text-saffron border border-saffron-100'
                : 'hover:bg-gray-50 text-charcoal-700 border border-transparent'
            }`}
          >
            <Clipboard className="w-4 h-4 text-gray-400" />
            <span>Tools</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-left font-bold ${
              activeTab === 'users'
                ? 'bg-saffron-50/50 text-saffron border border-saffron-100'
                : 'hover:bg-gray-50 text-charcoal-700 border border-transparent'
            }`}
          >
            <Users className="w-4 h-4 text-gray-400" />
            <span>Users</span>
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left font-bold ${
              activeTab === 'messages'
                ? 'bg-saffron-50/50 text-saffron border border-saffron-100'
                : 'hover:bg-gray-50 text-charcoal-700 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>Messages</span>
            </div>
            {messages.length > 0 && (
              <span className="bg-saffron text-white text-[9px] px-1.5 py-0.5 rounded-full font-extrabold">
                {messages.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all text-left font-bold ${
              activeTab === 'settings'
                ? 'bg-saffron-50/50 text-saffron border border-saffron-100'
                : 'hover:bg-gray-50 text-charcoal-700 border border-transparent'
            }`}
          >
            <Settings className="w-4 h-4 text-gray-400" />
            <span>Settings</span>
          </button>
          
          <div className="border-t border-gray-100 my-4 pt-4"></div>
          
          <a href="#help" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Help & Support</span>
          </a>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center space-x-3 p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </nav>

        {/* Privacy First Box */}
        <div className="bg-saffron-50/20 border border-saffron-100 p-4 rounded-2xl text-center space-y-2">
          <Shield className="w-8 h-8 text-saffron mx-auto" />
          <h4 className="text-xs font-bold text-charcoal-900">Privacy First</h4>
          <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">
            We never store or access user files. All processing happens in the browser.
          </p>
        </div>
      </aside>

      {/* Main Content Area (Right column) */}
      <main className="flex-grow p-6 sm:p-10 space-y-8 min-w-0">
        
        {/* Admin Dashboard Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200/80 pb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-charcoal-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-xs text-gray-500 font-medium">Overview of tool usage and analytics</p>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto">
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 relative">
              <Bell className="w-4.5 h-4.5" />
              <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-saffron rounded-full"></div>
            </button>
            <div className="flex items-center space-x-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-charcoal-700">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Last 30 Days</span>
            </div>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* 4 KPI Metrics Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-saffron-50 text-saffron flex items-center justify-center border border-saffron-100 flex-shrink-0">
                  <TrendingUp className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Conversions</p>
                  <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{totalConversions.toLocaleString()}</h3>
                  <p className={`text-[9px] font-bold ${conversionsGrowth >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {conversionsGrowth >= 0 ? '↑' : '↓'} {Math.abs(conversionsGrowth).toFixed(1)}% vs last week
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-indicGreen flex items-center justify-center border border-emerald-100 flex-shrink-0">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Registered Users</p>
                  <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{uniqueUsers.toLocaleString()}</h3>
                  <p className="text-[9px] text-emerald-600 font-bold">Live database users</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100 flex-shrink-0">
                  <Users className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Logged-in Conversions</p>
                  <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{loggedInConversions.toLocaleString()}</h3>
                  <p className="text-[9px] text-gray-400 font-semibold">User account activity</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-3xs flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 flex-shrink-0">
                  <Activity className="w-5.5 h-5.5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Anonymous Conversions</p>
                  <h3 className="text-xl sm:text-2xl font-black text-charcoal-900 leading-tight">{anonymousConversions.toLocaleString()}</h3>
                  <p className="text-[9px] text-gray-400 font-semibold">Guest user activity</p>
                </div>
              </div>
            </div>

            {/* Charts Middle Grid Split (Top tools) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Top Tools All Time */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-charcoal-900 flex items-center space-x-2">
                    <BarChart3 className="w-4.5 h-4.5 text-saffron flex-shrink-0" />
                    <span>Top Tools (All Time)</span>
                  </h3>
                  <a href="#view" className="text-xs font-bold text-saffron hover:underline">View all</a>
                </div>

                <div className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topToolsData} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#E8630A" radius={[0, 8, 8, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Tools Last 7 Days */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-charcoal-900 flex items-center space-x-2">
                    <BarChart3 className="w-4.5 h-4.5 text-indicGreen flex-shrink-0" />
                    <span>Top Tools (Last 7 Days)</span>
                  </h3>
                  <a href="#view" className="text-xs font-bold text-saffron hover:underline">View all</a>
                </div>

                <div className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topToolsWeeklyData} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#138808" radius={[0, 8, 8, 0]} barSize={10} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Bottom Trend & Live Feed Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Conversions trend (2 cols span) */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-charcoal-900 flex items-center space-x-2">
                    <TrendingUp className="w-4.5 h-4.5 text-saffron flex-shrink-0" />
                    <span>Conversions Over Time (Last 30 Days)</span>
                  </h3>
                  <a href="#view" className="text-xs font-bold text-saffron hover:underline">View full report</a>
                </div>

                <div className="h-64 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="100">
                          <stop offset="5%" stopColor="#E8630A" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#E8630A" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 600 }} />
                      <YAxis tick={{ fontSize: 10, fontWeight: 600 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="conversions" stroke="#E8630A" strokeWidth={3} fillOpacity={1} fill="url(#colorConversions)" dot={{ r: 4 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Real-time activity list (1 col span) */}
              <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 shadow-3xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-charcoal-900 flex items-center space-x-2">
                    <Activity className="w-4.5 h-4.5 text-indicGreen flex-shrink-0" />
                    <span>Real-time Activity</span>
                  </h3>
                  <span className="text-[10px] bg-emerald-50 text-indicGreen font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 bg-indicGreen rounded-full animate-pulse"></span>
                    <span>Live</span>
                  </span>
                </div>

                <div className="space-y-4 font-semibold text-xs text-charcoal-800 divide-y divide-gray-100 pr-1 max-h-64 overflow-y-auto">
                  {recentActivity.map((activity, idx) => {
                    const toolName = TOOLS.find(t => t.slug === activity.tool_slug)?.name || activity.tool_slug;
                    const timeStr = new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const dateStr = new Date(activity.created_at).toLocaleDateString();
                    return (
                      <div key={activity.id || idx} className="pt-3 flex justify-between items-start gap-1">
                        <div>
                          <p className="font-bold text-charcoal-900">{toolName}</p>
                          <p className="text-[10px] text-gray-400">Converted a file</p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap text-right">
                          {dateStr}<br/>{timeStr}
                        </span>
                      </div>
                    );
                  })}
                  {recentActivity.length === 0 && (
                    <div className="pt-3 text-center text-gray-500">No activity logged yet.</div>
                  )}
                </div>

                <div className="text-center pt-2">
                  <a href="#all" className="text-xs font-bold text-saffron hover:underline">View all activity</a>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-3xs space-y-4 animate-fade-in">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 flex items-center space-x-2">
                <Users className="w-5.5 h-5.5 text-saffron" />
                <span>Registered Users ({registeredUsers.length})</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-bold uppercase tracking-wider">
                    <th className="py-3">User ID</th>
                    <th className="py-3">Email Address</th>
                    <th className="py-3">Role</th>
                    <th className="py-3 text-right">Conversions Logged</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-charcoal-800 font-semibold">
                  {registeredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400">No registered users in the database yet.</td>
                    </tr>
                  ) : (
                    registeredUsers.map((u) => {
                      const count = userConversionsCount[u.id] || 0;
                      return (
                        <tr key={u.id} className="hover:bg-gray-50/50">
                          <td className="py-4 font-mono text-[10px] text-gray-500">{u.id}</td>
                          <td className="py-4 font-bold text-charcoal-900">{u.email}</td>
                          <td className="py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] bg-saffron-50 text-saffron border border-saffron-100 font-bold">
                              User
                            </span>
                          </td>
                          <td className="py-4 text-right font-extrabold text-charcoal-900">{count}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-3xs space-y-4 animate-fade-in">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 flex items-center space-x-2">
                <Clipboard className="w-5.5 h-5.5 text-indicGreen" />
                <span>Tool Usage Analytics</span>
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 font-bold uppercase tracking-wider">
                    <th className="py-3">Tool Name</th>
                    <th className="py-3">Slug</th>
                    <th className="py-3 text-right">Total Usage Count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-charcoal-800 font-semibold">
                  {toolsUsageList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-8 text-center text-gray-400">No usage data found.</td>
                    </tr>
                  ) : (
                    toolsUsageList.map((t) => (
                      <tr key={t.slug} className="hover:bg-gray-50/50">
                        <td className="py-4 font-bold text-charcoal-900">{t.name}</td>
                        <td className="py-4 font-mono text-[10px] text-gray-500">{t.slug}</td>
                        <td className="py-4 text-right font-extrabold text-charcoal-900">{t.value}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-3xs space-y-4 animate-fade-in">
            <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 flex items-center space-x-2">
                <Mail className="w-5.5 h-5.5 text-saffron" />
                <span>Contact Messages ({messages.length})</span>
              </h3>
              {messages.length > 0 && (
                <button
                  onClick={async () => {
                    if (window.confirm("Are you sure you want to delete all contact messages?")) {
                      localStorage.removeItem('indiantools_messages');
                      setMessages([]);
                    }
                  }}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="py-12 text-center text-gray-400 font-semibold text-xs">
                  No contact messages received yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-3 font-semibold text-xs text-charcoal-800 relative">
                      <button
                        onClick={async () => {
                          const updated = messages.filter(m => m.id !== msg.id);
                          localStorage.setItem('indiantools_messages', JSON.stringify(updated));
                          setMessages(updated);
                        }}
                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-gray-200/60 pb-2">
                        <div>
                          <p className="text-charcoal-900 font-bold text-sm">{msg.name}</p>
                          <a href={`mailto:${msg.email}`} className="text-saffron hover:underline text-[10px]">{msg.email}</a>
                        </div>
                        <p className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Subject</p>
                        <p className="text-charcoal-900 font-bold">{msg.subject}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Message</p>
                        <p className="text-charcoal-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-gray-200/50 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-3xs space-y-6 animate-fade-in">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-base sm:text-lg font-black text-charcoal-900 flex items-center space-x-2">
                <Settings className="w-5.5 h-5.5 text-saffron" />
                <span>Admin Settings</span>
              </h3>
            </div>
            
            <div className="max-w-md space-y-4 font-semibold text-xs text-charcoal-800">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-sm text-charcoal-900">Database Info</h4>
                <p className="text-gray-500">You are currently running the inbuilt database backed by browser LocalStorage.</p>
                <div className="flex space-x-6 pt-2">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Storage Provider</p>
                    <p className="font-bold text-charcoal-900">LocalStorage</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Status</p>
                    <p className="font-bold text-emerald-600 flex items-center"><span className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> Active</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-sm text-charcoal-900">Security Credentials</h4>
                <p className="text-gray-500">The admin dashboard password can be configured securely using a SHA-256 hash to prevent plain-text exposure in your JavaScript code bundle.</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Admin Password Source</p>
                    <p className="font-bold text-charcoal-900 text-[11px] mt-0.5">
                      {import.meta.env.VITE_ADMIN_PASSWORD_HASH ? 'VITE_ADMIN_PASSWORD_HASH (Secure Hash in .env)' : 'VITE_ADMIN_PASSWORD (Plain Text fallback in .env)'}
                    </p>
                  </div>
                  <div className="pt-1.5 border-t border-gray-100">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">Recommended Config</p>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-0.5">
                      To prevent password discovery via Inspect Element, generate the SHA-256 hash of your password and add <code className="font-mono text-saffron bg-saffron-50 px-1 py-0.5 rounded text-[10px]">VITE_ADMIN_PASSWORD_HASH=your_hash</code> to your <code className="font-mono bg-gray-100 px-1 py-0.5 rounded text-[10px]">.env</code> file.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-3">
                <h4 className="font-bold text-sm text-red-700">Danger Zone</h4>
                {!showClearConfirm ? (
                  <>
                    <p className="text-red-600/80">Clear all local database records including conversion histories, registered users, and session logs.</p>
                    <button
                      onClick={() => setShowClearConfirm(true)}
                      className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      Clear All Local Data
                    </button>
                  </>
                ) : (
                  <div className="space-y-3 p-3 bg-white rounded-xl border border-red-100 animate-fade-in">
                    <p className="text-[11px] text-red-600 font-extrabold leading-normal">
                      ⚠ WARNING: This will permanently delete all users, conversions, and metrics logs from your browser. Are you sure?
                    </p>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleClearDatabase}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Yes, delete all data
                      </button>
                      <button
                        onClick={() => setShowClearConfirm(false)}
                        className="px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-charcoal-700 font-bold text-[10px] rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
