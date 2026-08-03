import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { isDark } = useTheme();
  const [college, setCollege] = useState(null);

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

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
            Welcome to {college?.short_name || 'PlaceX'} Portal
          </h1>
          <p className={`text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
            Your comprehensive placement management system with intelligent resume parsing, 
            job matching, and application tracking.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-semibold text-white shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-lg'}`}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* College Info Section (Sri Krishna Institute of Technology) */}
      {college && (
        <section className="px-4">
          <div className={`rounded-2xl p-10 relative overflow-hidden border border-slate-700/50 bg-gradient-to-br from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-md ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
                  College Profile
                </span>
                <h2 className="text-3xl md:text-4xl font-bold mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {college.name} ({college.short_name})
                </h2>
                <p className={`mt-4 text-sm leading-relaxed max-w-2xl mx-auto ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                  {college.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-750' : 'bg-white border-gray-200 shadow-md'}`}>
                  <h3 className="text-lg font-bold text-blue-500 mb-3">Our Vision</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{college.vision}</p>
                </div>

                <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-800/30 border-slate-750' : 'bg-white border-gray-200 shadow-md'}`}>
                  <h3 className="text-lg font-bold text-purple-500 mb-3">Our Mission</h3>
                  <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{college.mission}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 text-left border-t border-slate-700/40 pt-8 mt-4">
                <div>
                  <h4 className="text-sm font-semibold opacity-70">Administration</h4>
                  <p className="text-base font-bold mt-1">{college.principal_name}</p>
                  <p className="text-xs opacity-60">Principal</p>
                  <p className="text-xs text-blue-400 mt-0.5">{college.principal_email}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold opacity-70">Placement Cell</h4>
                  <p className="text-base font-bold mt-1">{college.placement_officer_name}</p>
                  <p className="text-xs opacity-60">Placement & Training Officer</p>
                  <p className="text-xs text-purple-400 mt-0.5">{college.placement_officer_email}</p>
                  <p className="text-xs opacity-60 mt-0.5">Phone: {college.placement_officer_phone}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500/50' : 'bg-white border border-gray-200 hover:border-blue-500/50 shadow-lg'}`}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Job Management</h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Browse and apply to jobs from top companies with intelligent matching.
            </p>
          </div>
          
          <div className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-purple-500/50' : 'bg-white border border-gray-200 hover:border-purple-500/50 shadow-lg'}`}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Application Tracking</h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              Track your applications in real-time with status updates and notifications.
            </p>
          </div>
          
          <div className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-green-500/50' : 'bg-white border border-gray-200 hover:border-green-500/50 shadow-lg'}`}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Resume Parsing</h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              AI-powered resume analysis to match you with the best opportunities.
            </p>
          </div>
          
          <div className={`rounded-2xl p-8 transition-all duration-300 hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-pink-500/50' : 'bg-white border border-gray-200 hover:border-pink-500/50 shadow-lg'}`}>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Authentication</h3>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>
              JWT-based authentication with secure token management.
            </p>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Home;
