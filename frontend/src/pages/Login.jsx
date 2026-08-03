import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, AlertCircle, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login with:', formData.identifier);
      const response = await login(formData.identifier, formData.password);
      console.log('Login successful:', response);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error message:', err.response?.data?.detail || err.message);
      setError(err.response?.data?.detail || err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mx-auto">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-50"></div>
          </div>
          <h2 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>Welcome back</h2>
          <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Sign in to your PlaceX account</p>
        </div>

        <div className={`rounded-2xl p-8 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className={`rounded-xl p-4 flex items-center space-x-3 ${
              isDark ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-100 border border-red-200'
            }`}>
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span className={isDark ? 'text-red-300' : 'text-red-700'}>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="identifier" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                value={formData.identifier}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                    isDark ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-600'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className={`flex items-center space-x-2 text-sm cursor-pointer ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
              <input type="checkbox" className={`rounded focus:ring-blue-500 ${
                isDark ? 'border-slate-600 bg-slate-700' : 'border-gray-300 bg-white'
              }`} />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className={`text-sm hover:underline transition-colors ${
              isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
            }`}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium text-white shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="h-5 w-5" />
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isDark ? 'border-slate-700' : 'border-gray-300'}`}></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className={`px-4 ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-600'}`}>Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all border ${
              isDark ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>Google</span>
            </button>
            <button type="button" className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl transition-all border ${
              isDark ? 'bg-slate-700/50 border-slate-600 hover:bg-slate-700' : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
            }`}>
              <span className={isDark ? 'text-white' : 'text-gray-900'}>GitHub</span>
            </button>
          </div>

          </form>
        </div>

        <p className={`text-center mt-6 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link to="/register" className={`hover:underline font-medium inline-flex items-center space-x-1 transition-colors ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}>
            <span>Sign up</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
