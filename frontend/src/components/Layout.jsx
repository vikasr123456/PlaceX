import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, User, LogOut, Home, FileText, Building2, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
  ];

  if (isAuthenticated) {
    navLinks.push(
      { path: '/dashboard', label: 'Dashboard', icon: Briefcase },
      { path: '/jobs', label: 'Jobs', icon: Building2 },
      { path: '/applications', label: 'Applications', icon: FileText },
      { path: '/profile', label: 'Profile', icon: User }
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white relative overflow-hidden">
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
      <nav className="glass sticky top-0 z-50 border-b border-dark-700/50 shadow-3d-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative icon-3d">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm group-hover:shadow-glow-blue transition-all">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                </div>
                <span className="text-xl font-bold gradient-text">PlaceX</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 btn-3d ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 text-white shadow-3d-sm'
                      : 'text-slate-300 hover:text-white hover:bg-dark-800/50'
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
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-dark-800/50 border border-dark-700 card-3d">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center icon-3d">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{user?.first_name || user?.username}</span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-dark-800/50 transition-all glow-hover"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-dark-800/50 transition-all btn-3d"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 hover:from-accent-blue-500 hover:to-accent-emerald-500 text-white shadow-3d-sm transition-all btn-3d"
                  >
                    Register
                  </Link>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden glass border-t border-dark-700/50 animate-slide-down stagger-in">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all btn-3d ${
                    isActive(link.path)
                      ? 'bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 text-white shadow-3d-sm'
                      : 'text-slate-300 hover:text-white hover:bg-dark-800/50'
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
      <footer className="glass border-t border-dark-700/50 mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center icon-3d">
                  <Briefcase className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold gradient-text">PlaceX</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your gateway to career opportunities. Connect with top employers and find your dream job.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/" className="hover:text-accent-blue-400 transition-colors">Home</Link></li>
                <li><Link to="/jobs" className="hover:text-accent-blue-400 transition-colors">Browse Jobs</Link></li>
                <li><Link to="/register" className="hover:text-accent-blue-400 transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>support@placex.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-dark-700/50">
            <p className="text-center text-slate-400 text-sm">
              &copy; {new Date().getFullYear()} PlaceX Portal. Built with Django REST & React.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
