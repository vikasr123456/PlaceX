import { Briefcase, FileText, Calendar, TrendingUp, Building2, Users, ArrowRight, CheckCircle } from 'lucide-react';

const StudentDashboard = ({ stats }) => {
  return (
    <div className="space-y-8 animate-slide-up-3d">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Student Dashboard</h2>
          <p className="text-slate-400 mt-1">Track your job search progress</p>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-in">
        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Jobs Applied</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.jobsApplied || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue-500 to-accent-blue-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Briefcase className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Interviews</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.interviews || 0}</p>
              <p className="text-xs text-accent-emerald-400 mt-1 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                2 upcoming
              </p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-emerald-500 to-accent-emerald-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <Calendar className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Pending</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.pending || 0}</p>
              <p className="text-xs text-yellow-400 mt-1">Awaiting response</p>
            </div>
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center shadow-3d-sm icon-3d">
              <FileText className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>

        <div className="card-3d rounded-2xl p-6 card-hover">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm font-medium">Profile Score</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.profileScore || 85}%</p>
              <p className="text-xs text-accent-blue-400 mt-1">Excellent</p>
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
              <Briefcase className="h-6 w-6" />
              <span className="font-medium">Browse Jobs</span>
            </div>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-accent-blue-400" />
              <span className="font-medium">Upload Resume</span>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group flex items-center justify-between bg-dark-800/50 hover:bg-dark-800 rounded-xl p-5 transition-all border border-dark-700 btn-3d">
            <div className="flex items-center space-x-3">
              <Users className="h-6 w-6 text-accent-emerald-400" />
              <span className="font-medium">My Applications</span>
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
              <CheckCircle className="h-5 w-5 text-accent-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Applied to Software Engineer at Google</p>
              <p className="text-slate-400 text-sm">Application submitted successfully</p>
            </div>
            <span className="text-slate-500 text-sm">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Interview scheduled for Amazon</p>
              <p className="text-slate-400 text-sm">Technical round on Friday</p>
            </div>
            <span className="text-slate-500 text-sm">1 day ago</span>
          </div>
          <div className="flex items-center space-x-4 p-4 rounded-xl bg-dark-800/50 border border-dark-700/50 card-hover">
            <div className="w-10 h-10 rounded-full bg-accent-blue-500/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-accent-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Updated profile information</p>
              <p className="text-slate-400 text-sm">Skills and experience updated</p>
            </div>
            <span className="text-slate-500 text-sm">3 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
