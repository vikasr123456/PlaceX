import { Users, Building2, FileText, Shield, TrendingUp, Settings, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const AdminDashboard = ({ stats }) => {
  return (
    <div className="space-y-8 animate-slide-up-3d">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Admin Dashboard</h2>
          <p className="text-slate-400 mt-1">System overview and management</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.totalUsers || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +24 this week
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-blue-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Companies</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.companies || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                2 pending approval
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-emerald-500 to-accent-emerald-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Building2 className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Job Postings</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.jobPostings || 0}</p>
              <p className="text-xs text-yellow-400 mt-1">12 active</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Active Sessions</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.activeSessions || 0}</p>
              <p className="text-xs text-accent-blue-400 mt-1">Current users</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm icon-3d">
              <Shield className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 flex items-center">
          <span className="gradient-text">Admin Actions</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="group flex items-center justify-between bg-gradient-to-r from-accent-blue-600 to-accent-blue-700 hover:from-accent-blue-500 hover:to-accent-blue-600 rounded-xl p-5 transition-all btn-3d shadow-3d-sm">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6" />
              <span className="font-medium">Manage Users</span>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <Building2 className="h-6 w-6 text-accent-blue-400" />
              <span className="font-medium">Manage Companies</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <Settings className="h-6 w-6 text-accent-emerald-400" />
              <span className="font-medium">System Settings</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 gradient-text">System Alerts</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-red-900/20 border border-red-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Database backup scheduled</p>
              <p className="text-slate-400 text-sm">Scheduled for tonight at 2:00 AM</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-yellow-900/20 border border-yellow-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Pending company verifications</p>
              <p className="text-slate-400 text-sm">3 companies awaiting approval</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-accent-emerald-900/20 border border-accent-emerald-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-accent-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">System performance optimal</p>
              <p className="text-slate-400 text-sm">All systems running normally</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 gradient-text">System Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-emerald-500/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-accent-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">New user registration: student123</p>
              <p className="text-slate-400 text-sm">From Stanford University</p>
            </div>
            <span className="text-slate-500 text-sm">5 min ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-blue-500/20 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-accent-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Company profile approved: TechCorp</p>
              <p className="text-slate-400 text-sm">Verified by admin</p>
            </div>
            <span className="text-slate-500 text-sm">1 hour ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Job posting flagged for review</p>
              <p className="text-slate-400 text-sm">Potential policy violation</p>
            </div>
            <span className="text-slate-500 text-sm">2 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
