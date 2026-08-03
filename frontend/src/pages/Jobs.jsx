import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Briefcase, MapPin, DollarSign, Clock, Building2, Plus, Search, X, Edit, Trash2, PowerOff } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { isDark } = useTheme();
  const isRecruiterOrAdmin = user?.role === 'recruiter' || user?.role === 'admin';

  // Advanced Filters States
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState(user?.role === 'student' ? 'active' : 'all');
  const [filterLocation, setFilterLocation] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    job_type: 'full_time',
    salary_min: '',
    salary_max: '',
    description: '',
    requirements: '',
    company: '',
    is_active: true,
  });

  // Details Modal States
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
    if (user?.role === 'admin') {
      fetchCompanies();
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs/');
      setJobs(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies/');
      const companyList = response.data.results || response.data || [];
      setCompanies(companyList);
      if (companyList.length > 0) {
        setFormData(prev => ({ ...prev, company: companyList[0].id }));
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
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

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      location: '',
      job_type: 'full_time',
      salary_min: '',
      salary_max: '',
      description: '',
      requirements: '',
      company: companies[0]?.id || '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      location: job.location || '',
      job_type: job.job_type || 'full_time',
      salary_min: job.salary_min || '',
      salary_max: job.salary_max || '',
      description: job.description || '',
      requirements: job.requirements || '',
      company: job.company || '',
      is_active: job.is_active !== undefined ? job.is_active : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${jobId}/`);
        alert('Job deleted successfully!');
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const handleClose = async (jobId) => {
    if (window.confirm('Are you sure you want to close this job?')) {
      try {
        await api.patch(`/jobs/${jobId}/`, { is_active: false });
        alert('Job closed successfully!');
        fetchJobs();
      } catch (error) {
        console.error('Error closing job:', error);
        alert('Failed to close job');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        location: formData.location,
        job_type: formData.job_type,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        description: formData.description,
        requirements: formData.requirements,
        is_active: formData.is_active,
      };

      if (user?.role === 'admin') {
        payload.company = parseInt(formData.company);
      }

      if (editingJob) {
        await api.patch(`/jobs/${editingJob.id}/`, payload);
        alert('Job updated successfully!');
      } else {
        await api.post('/jobs/', payload);
        alert('Job created successfully!');
      }
      setIsModalOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      alert(error.response?.data?.detail || 'Failed to save job. Please fill all required fields.');
    }
  };

  // Perform advanced searching and filtering
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || job.job_type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                          (filterStatus === 'active' && job.is_active) || 
                          (filterStatus === 'closed' && !job.is_active);
    const matchesLocation = filterLocation === '' || job.location?.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesType && matchesStatus && matchesLocation;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {isRecruiterOrAdmin ? 'Manage Jobs' : 'Available Jobs'}
        </h1>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64 ${
                isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>
          {isRecruiterOrAdmin && (
            <button
              onClick={openAddModal}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 transition flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Job</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      <div className={`p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-end ${
        isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
      }`}>
        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-1 opacity-70">Job Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark ? 'bg-slate-800 border-slate-700 text-white font-medium' : 'bg-white border-gray-300 text-gray-900 font-medium'
            }`}
          >
            <option value="all">All Types</option>
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
            <option value="contract">Contract</option>
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-1 opacity-70">Location</label>
          <input
            type="text"
            placeholder="Filter by city/location..."
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-medium mb-1 opacity-70">Status</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDark ? 'bg-slate-800 border-slate-700 text-white font-medium' : 'bg-white border-gray-300 text-gray-900 font-medium'
            }`}
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="closed">Closed Only</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <div key={job.id} className={`rounded-xl p-6 flex flex-col justify-between transition-all hover:scale-105 ${
            isDark ? 'bg-slate-800/50 border border-slate-700 hover:border-blue-500/50' : 'bg-white border border-gray-200 hover:border-blue-500/50 shadow-lg'
          }`}>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <div className={`flex items-center space-x-2 mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                    <Building2 className="h-4 w-4" />
                    <span>{job.company_name}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  job.is_active 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {job.is_active ? 'Active' : 'Closed'}
                </span>
              </div>

              <div className={`space-y-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>
                    {job.salary_min && job.salary_max
                      ? `$${Number(job.salary_min).toLocaleString()} - $${Number(job.salary_max).toLocaleString()}`
                      : 'Competitive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="capitalize">{job.job_type?.replace('_', ' ')}</span>
                </div>
              </div>

              <p className={`mt-4 text-sm line-clamp-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                {job.description}
              </p>
            </div>

            {/* Student Actions: View Details, Apply */}
            {!isRecruiterOrAdmin && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    setSelectedJobForDetails(job);
                    setIsDetailsModalOpen(true);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition text-xs border ${
                    isDark
                      ? 'bg-slate-700/40 hover:bg-slate-700/85 border-slate-650 text-slate-300'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
                  }`}
                >
                  View Details
                </button>
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={!job.is_active}
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition text-xs ${
                    job.is_active 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {job.is_active ? 'Apply Now' : 'Closed'}
                </button>
              </div>
            )}

            {/* Recruiter / Admin Actions: Details, Edit, Close, Delete */}
            {isRecruiterOrAdmin && (
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-700/50">
                <button
                  onClick={() => {
                    setSelectedJobForDetails(job);
                    setIsDetailsModalOpen(true);
                  }}
                  className={`flex-1 py-2 px-2 rounded-lg font-medium transition text-[10px] border ${
                    isDark
                      ? 'bg-slate-700/40 hover:bg-slate-700/80 border-slate-600 text-slate-300'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-700'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => openEditModal(job)}
                  title="Edit Job"
                  className={`flex-1 py-2 px-2 rounded-lg font-medium transition flex items-center justify-center space-x-1 text-[10px] border ${
                    isDark
                      ? 'bg-slate-700/40 hover:bg-slate-700/80 border-slate-600 text-blue-400'
                      : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'
                  }`}
                >
                  <Edit className="h-3 w-3" />
                  <span>Edit</span>
                </button>
                {job.is_active && (
                  <button
                    onClick={() => handleClose(job.id)}
                    title="Close Job"
                    className={`flex-1 py-2 px-2 rounded-lg font-medium transition flex items-center justify-center space-x-1 text-[10px] border ${
                      isDark
                        ? 'bg-slate-700/40 hover:bg-slate-700/80 border-slate-600 text-amber-400'
                        : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700'
                    }`}
                  >
                    <PowerOff className="h-3 w-3" />
                    <span>Close</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(job.id)}
                  title="Delete Job"
                  className={`flex-1 py-2 px-2 rounded-lg font-medium transition flex items-center justify-center space-x-1 text-[10px] border ${
                    isDark
                      ? 'bg-slate-700/40 hover:bg-slate-700/80 border-slate-600 text-red-400'
                      : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-700'
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className={`text-center py-12 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
          <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No jobs found matching your search.</p>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col p-6 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-750 mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {editingJob ? 'Edit Job Posting' : 'Post New Job'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={`p-1.5 rounded-lg transition ${
                  isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Frontend Developer"
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="e.g. San Francisco, CA (Hybrid)"
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Job Type *</label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, job_type: e.target.value }))}
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white font-medium' : 'bg-white border-gray-300 text-gray-900 font-medium'
                    }`}
                  >
                    <option value="full_time" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>Full Time</option>
                    <option value="part_time" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>Part Time</option>
                    <option value="internship" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>Internship</option>
                    <option value="contract" className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Salary Min ($)</label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value }))}
                    placeholder="e.g. 80000"
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Salary Max ($)</label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value }))}
                    placeholder="e.g. 120000"
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                    }`}
                  />
                </div>
              </div>

              {/* Admin-only Company Selector */}
              {user?.role === 'admin' && (
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80">Company *</label>
                  <select
                    required
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id} className={isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-900'}>{c.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Job Description *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the job duties and responsibilities..."
                  className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 opacity-80">Requirements *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.requirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="e.g. React knowledge, 3+ years experience, CS degree"
                  className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300 bg-white"
                />
                <label htmlFor="is_active" className="text-sm font-medium opacity-80 cursor-pointer">
                  Make job active immediately
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-750 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-5 py-2.5 rounded-xl font-medium transition border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-500 hover:to-purple-500 transition shadow-lg"
                >
                  {editingJob ? 'Save Changes' : 'Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Job Details Modal */}
      {isDetailsModalOpen && selectedJobForDetails && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border flex flex-col p-6 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-750 mb-6">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {selectedJobForDetails.title}
                </h2>
                <p className={`text-sm mt-1 flex items-center gap-1.5 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  <Building2 className="h-4 w-4" />
                  <span>{selectedJobForDetails.company_name}</span>
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedJobForDetails(null);
                  setIsDetailsModalOpen(false);
                }}
                className={`p-1.5 rounded-lg transition ${
                  isDark ? 'hover:bg-slate-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'
                }`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Details Content */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                  isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs opacity-60">Location</p>
                    <p className="text-sm font-semibold">{selectedJobForDetails.location}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                  isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <DollarSign className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs opacity-60">Salary Range</p>
                    <p className="text-sm font-semibold">
                      {selectedJobForDetails.salary_min && selectedJobForDetails.salary_max
                        ? `$${Number(selectedJobForDetails.salary_min).toLocaleString()} - $${Number(selectedJobForDetails.salary_max).toLocaleString()}`
                        : 'Competitive'}
                    </p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                  isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Clock className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs opacity-60">Job Type</p>
                    <p className="text-sm font-semibold capitalize">{selectedJobForDetails.job_type?.replace('_', ' ')}</p>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center space-x-3 ${
                  isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  <Briefcase className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs opacity-60">Status</p>
                    <p className="text-sm font-semibold">{selectedJobForDetails.is_active ? 'Active' : 'Closed'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Job Description</h4>
                <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  {selectedJobForDetails.description}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Requirements</h4>
                <p className={`text-sm leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                  {selectedJobForDetails.requirements}
                </p>
              </div>

              {selectedJobForDetails.application_deadline && (
                <div className={`p-3 rounded-xl border text-sm flex items-center justify-between ${
                  isDark ? 'bg-slate-800/20 border-slate-700' : 'bg-red-50/50 border-red-100'
                }`}>
                  <span className="opacity-70">Application Deadline:</span>
                  <span className="font-semibold text-red-500">
                    {new Date(selectedJobForDetails.application_deadline).toLocaleDateString()}
                  </span>
                </div>
              )}

              {/* Action buttons inside details modal */}
              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-750">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedJobForDetails(null);
                    setIsDetailsModalOpen(false);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-medium transition border ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-800'
                  }`}
                >
                  Close
                </button>
                {!isRecruiterOrAdmin && (
                  <button
                    onClick={() => {
                      handleApply(selectedJobForDetails.id);
                      setSelectedJobForDetails(null);
                      setIsDetailsModalOpen(false);
                    }}
                    disabled={!selectedJobForDetails.is_active}
                    className={`px-5 py-2.5 rounded-xl font-medium transition ${
                      selectedJobForDetails.is_active
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {selectedJobForDetails.is_active ? 'Apply Now' : 'Closed'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Jobs;
