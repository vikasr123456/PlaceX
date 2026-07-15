import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, AlertCircle, Eye, EyeOff, UserPlus, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
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

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full animate-slide-up-3d">
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm mx-auto icon-3d">
              <Briefcase className="h-10 w-10 text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 rounded-2xl blur-xl opacity-50"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text">Create your account</h2>
          <p className="text-slate-400 mt-2">Join PlaceX to start your career journey</p>
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-slate-300 mb-2">
                  First Name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="John"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-slate-300 mb-2">
                  Last Name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                placeholder="johndoe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-800/50 border border-dark-700 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                placeholder="john@example.com"
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
                  placeholder="••••••••"
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

            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-slate-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 hover:from-accent-blue-500 hover:to-accent-emerald-500 rounded-xl font-medium text-white shadow-3d-sm transition-all btn-3d flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="h-5 w-5" />
            <span>{loading ? 'Creating account...' : 'Create account'}</span>
          </button>

          </form>
        </div>

        <p className="text-center text-slate-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-accent-blue-400 hover:text-accent-blue-300 font-medium inline-flex items-center space-x-1 transition-colors">
            <span>Sign in</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
