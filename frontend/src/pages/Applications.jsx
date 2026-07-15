import { useEffect, useState } from 'react';
import api from '../api/axios';
import { FileText, Building2, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data.results || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'interview_scheduled':
        return <Calendar className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-900 text-green-300';
      case 'rejected':
        return 'bg-red-900 text-red-300';
      case 'interview_scheduled':
        return 'bg-blue-900 text-blue-300';
      default:
        return 'bg-yellow-900 text-yellow-300';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>You haven't applied to any jobs yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <div key={application.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{application.job_title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{application.company_name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(application.applied_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <p className="mt-3 text-gray-300 text-sm line-clamp-2">
                      {application.cover_letter}
                    </p>
                  )}
                </div>

                <div className="ml-4">
                  {getStatusIcon(application.status)}
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
