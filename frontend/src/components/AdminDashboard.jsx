import { Users, Building2, FileText, Shield, TrendingUp, Settings, AlertCircle, ArrowRight, CheckCircle } from 'lucide-react';

const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api\/?$/, '');

const formatDistanceToNow = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

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
                {stats.totalUsersText || '0 this week'}
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
                {stats.companiesText || '0 pending approval'}
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
              <p className="text-xs text-yellow-400 mt-1">{stats.jobPostingsText || '0 active'}</p>
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
          <a href={`${BACKEND_URL}/admin/auth/user/`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between bg-gradient-to-r from-accent-blue-600 to-accent-blue-700 hover:from-accent-blue-500 hover:to-accent-blue-600 rounded-xl p-5 transition-all btn-3d shadow-3d-sm">
            <div className="flex items-center space-x-3 text-white">
              <Users className="h-6 w-6" />
              <span className="font-medium">Manage Users</span>
            </div>
            <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={`${BACKEND_URL}/admin/core/company/`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3 text-slate-200">
              <Building2 className="h-6 w-6 text-accent-blue-400" />
              <span className="font-medium">Manage Companies</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
          <a href={`${BACKEND_URL}/admin/`} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3 text-slate-200">
              <Settings className="h-6 w-6 text-accent-emerald-400" />
              <span className="font-medium">System Settings</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Alerts */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 gradient-text">System Alerts</h3>
        <div className="space-y-4">
          {stats.alerts && stats.alerts.length > 0 ? (
            stats.alerts.map((alert, index) => {
              let IconComponent = AlertCircle;
              let bgClass = "bg-red-900/20 border border-red-700/50";
              let iconBgClass = "bg-red-500/20";
              let iconColorClass = "text-red-400";
              if (alert.type === 'pending') {
                bgClass = "bg-yellow-900/20 border border-yellow-700/50";
                iconBgClass = "bg-yellow-500/20";
                iconColorClass = "text-yellow-400";
              } else if (alert.type === 'system') {
                IconComponent = TrendingUp;
                bgClass = "bg-accent-emerald-900/20 border border-accent-emerald-700/50";
                iconBgClass = "bg-accent-emerald-500/20";
                iconColorClass = "text-accent-emerald-400";
              }
              return (
                <div key={alert.id || index} className={`flex items-center space-x-4 p-4 rounded-xl ${bgClass} card-hover`}>
                  <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{alert.title}</p>
                    <p className="text-slate-400 text-sm">{alert.details}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400 text-sm">No active system alerts.</p>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-3d rounded-2xl p-6">
        <h3 className="text-xl font-semibold mb-6 gradient-text">System Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => {
              let IconComponent = Users;
              let iconBgClass = "bg-accent-emerald-500/20";
              let iconColorClass = "text-accent-emerald-400";
              if (activity.icon === 'check_circle') {
                IconComponent = CheckCircle;
                iconBgClass = "bg-accent-blue-500/20";
                iconColorClass = "text-accent-blue-400";
              } else if (activity.icon === 'alert_circle') {
                IconComponent = AlertCircle;
                iconBgClass = "bg-yellow-500/20";
                iconColorClass = "text-yellow-400";
              }
              return (
                <div key={activity.id || index} className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
                  <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{activity.title}</p>
                    <p className="text-slate-400 text-sm">{activity.subtitle}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{formatDistanceToNow(activity.timestamp)}</span>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400 text-sm">No recent system activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
