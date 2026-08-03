import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FileText, Building2, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isRecruiterOrAdmin = user?.role === 'recruiter' || user?.role === 'admin';

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/`, { status: newStatus });
      fetchApplications();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleWithdraw = async (applicationId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await api.patch(`/applications/${applicationId}/`, { status: 'withdrawn' });
        alert('Application withdrawn successfully!');
        fetchApplications();
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert(error.response?.data?.error || 'Failed to withdraw application.');
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'offer_accepted':
      case 'selected':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
      case 'offer_rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'withdrawn':
        return <XCircle className="h-5 w-5 text-slate-500" />;
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'interview_completed':
        return <CheckCircle className="h-5 w-5 text-purple-500" />;
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'shortlisted':
        return <Clock className="h-5 w-5 text-pink-500" />;
      case 'offer_released':
        return <Calendar className="h-5 w-5 text-teal-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'offer_accepted':
      case 'selected':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
      case 'offer_rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'withdrawn':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'interview_completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'shortlisted':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'offer_released':
        return 'bg-teal-100 text-teal-700 border-teal-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isRecruiterOrAdmin ? 'All Applications' : 'My Applications'}
        </h1>
      </div>

      {applications.length === 0 ? (
        <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>{isRecruiterOrAdmin ? 'No applications received yet.' : 'You haven\'t applied to any jobs yet.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className={`rounded-xl p-6 transition-all ${
              isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{application.job_title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                      {application.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className={`flex items-center space-x-4 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{application.company_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                    {application.applicant_name && isRecruiterOrAdmin && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{application.applicant_name}</span>
                      </div>
                    )}
                  </div>

                  {application.cover_letter && (
                    <p className={`mt-3 text-sm line-clamp-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                      {application.cover_letter}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-2 ml-4">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status)}
                    {isRecruiterOrAdmin && (
                      <select
                        value={application.status}
                        onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          isDark ? 'bg-slate-700 border-slate-600 text-white font-medium' : 'bg-white border-gray-300 text-gray-900 font-medium'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="interview_completed">Interview Completed</option>
                        <option value="selected">Selected</option>
                        <option value="offer_released">Offer Released</option>
                        <option value="offer_accepted">Offer Accepted</option>
                        <option value="offer_rejected">Offer Rejected</option>
                        <option value="rejected">Rejected</option>
                        <option value="withdrawn">Withdrawn</option>
                      </select>
                    )}
                  </div>

                  {/* Student offer acceptance actions */}
                  {!isRecruiterOrAdmin && application.status === 'offer_released' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'offer_accepted')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-green-600 hover:bg-green-500 text-white shadow transition-all duration-200"
                      >
                        Accept Offer
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(application.id, 'offer_rejected')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-500 text-white shadow transition-all duration-200"
                      >
                        Reject Offer
                      </button>
                    </div>
                  )}

                  {/* Student withdrawal trigger */}
                  {!isRecruiterOrAdmin && ['pending', 'under_review', 'shortlisted'].includes(application.status) && (
                    <button
                      onClick={() => handleWithdraw(application.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        isDark 
                          ? 'bg-red-950/20 hover:bg-red-900/40 border-red-900 text-red-400' 
                          : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                      }`}
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
