import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Briefcase, MapPin, DollarSign, Clock, Building2 } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/');
      setJobs(response.data.results || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await api.post(`/jobs/${jobId}/apply/`, {
        cover_letter: 'I am interested in this position.'
      });
      alert('Application submitted successfully!');
      fetchJobs();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to apply');
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Available Jobs</h1>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-primary-500 transition">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <div className="flex items-center space-x-2 text-gray-400 mt-1">
                  <Building2 className="h-4 w-4" />
                  <span>{job.company_name}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                job.is_active ? 'bg-green-900 text-green-300' : 'bg-gray-700 text-gray-300'
              }`}>
                {job.is_active ? 'Active' : 'Closed'}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>
                  {job.salary_min && job.salary_max
                    ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}`
                    : 'Competitive'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{job.job_type.replace('_', ' ')}</span>
              </div>
            </div>

            <p className="mt-4 text-gray-300 text-sm line-clamp-2">
              {job.description}
            </p>

            <button
              onClick={() => handleApply(job.id)}
              disabled={!job.is_active}
              className="w-full mt-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              {job.is_active ? 'Apply Now' : 'Closed'}
            </button>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No jobs found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Jobs;
