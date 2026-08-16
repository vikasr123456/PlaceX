import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, User, LogOut, Home, FileText, Building2, Menu, X, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [college, setCollege] = useState(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const fetchCollegeInfo = async () => {
      try {
        const response = await api.get('/college-info/');
        const results = response.data.results || response.data || [];
        if (results.length > 0) {
          setCollege(results[0]);
        }
      } catch (error) {
        console.error('Error fetching college info:', error);
      }
    };
    fetchCollegeInfo();
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
  ];

  if (isAuthenticated) {
    navLinks.push(
      { path: '/dashboard', label: 'Dashboard', icon: Briefcase },
      { path: '/jobs', label: 'Jobs', icon: Building2 },
      { path: '/applications', label: 'Applications', icon: FileText }
    );
    
    // Only show profile link for non-admin users
    if (user?.role !== 'admin') {
      navLinks.push({ path: '/profile', label: 'Profile', icon: User });
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'}`}>
      {/* Particle Background */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 z-50 border-b backdrop-blur-lg ${isDark ? 'bg-slate-900/80 border-slate-700/50' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className={`text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  PlaceX - {college?.short_name || 'SKIT'}
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <link.icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg border ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.first_name || user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`md:hidden p-2 rounded-lg ${isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className={`md:hidden border-t animate-slide-down ${isDark ? 'bg-slate-900/95 border-slate-700/50' : 'bg-white/95 border-gray-200'}`}>
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : isDark ? 'text-slate-300 hover:text-white hover:bg-slate-700/50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up relative z-10">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className={`border-t mt-auto relative z-10 ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-white/50 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {college?.short_name || 'SKIT'}
                </span>
              </div>
              <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                {college?.description || 'Your gateway to career opportunities. Connect with top employers and find your dream job.'}
              </p>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                <li><Link to="/jobs" className="hover:text-blue-500 transition-colors">Browse Jobs</Link></li>
                <li><Link to="/register" className="hover:text-blue-500 transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h3>
              <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <li>{college?.email || 'support@placex.com'}</li>
                <li>{college?.phone || '+1 (555) 123-4567'}</li>
                {college?.address && <li>{college.address}, {college.city}</li>}
              </ul>
            </div>
          </div>
          <div className={`mt-8 pt-8 border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200'}`}>
            <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              &copy; {new Date().getFullYear()} {college?.name || 'Sri Krishna Institute of Technology'}. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
