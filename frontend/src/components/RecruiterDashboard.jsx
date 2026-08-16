import { Building2, Users, FileText, Calendar, TrendingUp, Plus, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

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

import { useNavigate } from 'react-router-dom';

const RecruiterDashboard = ({ stats }) => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>Recruiter Dashboard</h2>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Manage your job postings and applications</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`rounded-2xl p-6 transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Active Jobs</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.activeJobs || 0}</p>
              <p className={`text-xs mt-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.activeJobsText || '0 new this week'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Total Applications</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalApplications || 0}</p>
              <p className={`text-xs mt-1 flex items-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {stats.totalApplicationsText || '0 new today'}
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <Users className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Interviews Scheduled</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.interviews || 0}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>{stats.interviewsText || '0 this week'}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-lg">
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className={`rounded-2xl p-6 transition-all hover:scale-105 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Hired</p>
              <p className={`text-3xl font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.hired || 0}</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{stats.hiredText || 'This month'}</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => navigate('/jobs')} className="group flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-xl p-5 transition-all shadow-lg">
            <div className="flex items-center space-x-3">
              <Plus className="h-6 w-6" />
              <span className="font-medium text-white">Post New Job</span>
            </div>
            <ArrowRight className="h-5 w-5 text-white group-hover:translate-x-1 transition-transform" />
          </button>
          <button onClick={() => navigate('/applications')} className={`group flex items-center justify-between rounded-xl p-5 transition-all border ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}>
            <div className="flex items-center space-x-3">
              <Users className={`h-6 w-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Review Applications</span>
            </div>
            <ArrowRight className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-600'} group-hover:translate-x-1 transition-transform`} />
          </button>
          <button onClick={() => navigate('/applications')} className={`group flex items-center justify-between rounded-xl p-5 transition-all border ${isDark ? 'bg-slate-700/50 hover:bg-slate-700 border-slate-600' : 'bg-gray-100 hover:bg-gray-200 border-gray-300'}`}>
            <div className="flex items-center space-x-3">
              <Calendar className={`h-6 w-6 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>Schedule Interviews</span>
            </div>
            <ArrowRight className={`h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-600'} group-hover:translate-x-1 transition-transform`} />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-2xl p-6 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
        <h3 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
        <div className="space-y-4">
          {stats.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => {
              let IconComponent = Users;
              let iconBgClass = "bg-green-500/20";
              let iconColorClass = "text-green-500";
              if (activity.icon === 'check_circle') {
                IconComponent = CheckCircle;
                iconBgClass = "bg-blue-500/20";
                iconColorClass = "text-blue-500";
              } else if (activity.icon === 'plus') {
                IconComponent = Plus;
                iconBgClass = "bg-yellow-500/20";
                iconColorClass = "text-yellow-500";
              }
              return (
                <div key={activity.id || index} className={`flex items-center space-x-4 p-4 rounded-xl ${isDark ? 'bg-slate-700/50 border border-slate-600/50' : 'bg-gray-100 border border-gray-200'}`}>
                  <div className={`w-10 h-10 rounded-full ${iconBgClass} flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${iconColorClass}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.title}</p>
                    <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>{activity.subtitle}</p>
                  </div>
                  <span className={`text-sm ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>{formatDistanceToNow(activity.timestamp)}</span>
                </div>
              );
            })
          ) : (
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
