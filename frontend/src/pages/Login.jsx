import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      <div className="max-w-md w-full animate-slide-up-3d">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm mx-auto icon-3d">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 rounded-2xl blur-xl opacity-50"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Welcome back</h2>
          <p className="text-slate-400 mt-2">Sign in to your PlaceX account</p>
        </div>

        <div className="card-3d rounded-2xl p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4 flex items-center space-x-3 card-hover">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300">{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-slate-300 mb-2">
                Username or Email
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
 value={formData.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                placeholder="Enter your username or email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
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
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-slate-400 cursor-pointer">
              <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-accent-blue-500 focus:ring-accent-blue-500" />
              <span>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-accent-blue-400 hover:text-accent-blue-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 hover:from-accent-blue-500 hover:to-accent-emerald-500 rounded-xl font-medium text-white shadow-3d-sm transition-all btn-3d flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogIn className="h-5 w-5" />
            <span>{loading ? 'Signing in...' : 'Sign in'}</span>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-dark-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-dark-900 text-slate-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl hover:bg-dark-700/50 transition-all btn-3d">
              <span className="text-white font-medium">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center space-x-2 px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl hover:bg-dark-700/50 transition-all btn-3d">
              <span className="text-white font-medium">GitHub</span>
            </button>
          </div>

          </form>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent-blue-400 hover:text-accent-blue-300 font-medium inline-flex items-center space-x-1 transition-colors">
            <span>Sign up</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
