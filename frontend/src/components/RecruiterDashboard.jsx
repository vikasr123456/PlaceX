import { useEffect, useState } from 'react';
import { Building2, Users, FileText, Calendar, TrendingUp, Plus, ArrowRight, CheckCircle, Check } from 'lucide-react';
import api from '../api/axios';

const RecruiterDashboard = ({ stats }) => {
  const [profile, setProfile] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', website: '', industry: '', description: '' });
  const [selectedCompany, setSelectedCompany] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [profileRes, companiesRes] = await Promise.all([
        api.get('/user-profiles/me/'),
        api.get('/companies/'),
      ]);
      setProfile(profileRes.data);
      setCompanies(companiesRes.data);
    } catch (err) {
      console.error('Error loading company data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const registerCompany = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/companies/', {
        name: form.name,
        website: form.website,
        industry: form.industry,
        description: form.description,
      });
      await api.put('/user-profiles/me/', { company: res.data.id });
      setForm({ name: '', website: '', industry: '', description: '' });
      setMessage(`Company "${res.data.name}" registered and linked to your account.`);
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to register company.');
    }
  };

  const selectCompany = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!selectedCompany) {
      setError('Please select a company.');
      return;
    }
    try {
      await api.put('/user-profiles/me/', { company: selectedCompany });
      setMessage('Company linked to your account.');
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to link company.');
    }
  };

  return (
    <div className="space-y-8 animate-slide-up-3d">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Recruiter Dashboard</h2>
          <p className="text-slate-400 mt-1">Manage your job postings and applications</p>
        </div>
      </div>

      {/* Company Setup */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Building2 className="h-5 w-5 mr-2 text-accent-blue-400" />
          <span className="gradient-text">Your Company</span>
        </h3>

        {profile?.company ? (
          <div className="flex items-center justify-between p-4 rounded-xl bg-accent-emerald-900/20 border border-accent-emerald-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent-emerald-500/20 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-accent-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium">{profile.company_name}</p>
                <p className="text-slate-400 text-sm">Linked to your recruiter account</p>
              </div>
            </div>
            <span className="flex items-center text-accent-emerald-400 text-sm">
              <Check className="h-4 w-4 mr-1" /> Linked
            </span>
          </div>
        ) : (
          <p className="text-slate-400 mb-4">You are not linked to a company yet. Register your company or select an existing one.</p>
        )}

        {message && <p className="mt-3 text-sm text-accent-emerald-400">{message}</p>}
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <form onSubmit={registerCompany} className="space-y-3">
            <h4 className="font-medium text-white">Register a new company</h4>
            <input
              type="text"
              required
              placeholder="Company name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue-500"
            />
            <input
              type="url"
              placeholder="Website (optional)"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue-500"
            />
            <input
              type="text"
              placeholder="Industry (optional)"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows="2"
              className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue-500"
            />
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-accent-blue-600 to-accent-blue-700 hover:from-accent-blue-500 hover:to-accent-blue-600 rounded-xl py-3 transition-all btn-3d shadow-3d-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Register Company</span>
            </button>
          </form>

          <form onSubmit={selectCompany} className="space-y-3">
            <h4 className="font-medium text-white">Select an existing company</h4>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-dark-800/60 border border-dark-700 text-white placeholder-slate-500 focus:outline-none focus:border-accent-blue-500"
            >
              <option value="">-- Choose a company --</option>
              {companies
                .filter((c) => c.id !== profile?.company)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-dark-800/50 hover:bg-dark-800 border border-dark-700 rounded-xl py-3 transition-all btn-3d"
            >
              <CheckCircle className="h-5 w-5 text-accent-emerald-400" />
              <span className="font-medium">Link to Company</span>
            </button>
          </form>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.activeJobs || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3 new this week
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-blue-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Building2 className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.totalApplications || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                15 new today
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-emerald-500 to-accent-emerald-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Interviews Scheduled</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.interviews || 0}</p>
              <p className="text-xs text-yellow-400 mt-1">5 this week</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Hired</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.hired || 0}</p>
              <p className="text-xs text-accent-blue-400 mt-1">This month</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm icon-3d">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <span className="gradient-text">Quick Actions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group flex items-center justify-between bg-gradient-to-r from-accent-blue-600 to-accent-blue-700 hover:from-accent-blue-500 hover:to-accent-blue-600 rounded-xl p-5 transition-all btn-3d shadow-3d-sm">
            <div className="flex items-center space-x-3">
              <Plus className="h-6 w-6" />
              <span className="font-medium">Post New Job</span>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-accent-blue-400" />
              <span className="font-medium">Review Applications</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <Calendar className="h-6 w-6 text-accent-emerald-400" />
              <span className="font-medium">Schedule Interviews</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 gradient-text">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-emerald-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New application for Senior Developer position</p>
              <p className="text-slate-400 text-sm">From Jane Smith at Stanford</p>
            </div>
            <span className="text-slate-500 text-sm">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-blue-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-accent-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Interview completed with John Doe</p>
              <p className="text-slate-400 text-sm">Technical round - Passed</p>
            </div>
            <span className="text-slate-500 text-sm">3 days ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Plus className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Posted new job: Product Manager</p>
              <p className="text-slate-400 text-sm">Remote position at TechCorp</p>
            </div>
            <span className="text-slate-500 text-sm">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
