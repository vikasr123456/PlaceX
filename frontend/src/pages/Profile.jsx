import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Linkedin, Github, Upload, FileText, X, Save, Shield, CheckCircle, Calendar, Building2 } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
    cgpa: '',
    graduation_year: '',
    department: '',
    skills: '',
    linkedin_url: '',
    github_url: '',
    is_placed: false,
  });
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchApplications();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student-profiles/me/');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await api.get('/applications/');
      setApplications(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await api.put('/student-profiles/me/', profile);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      await api.patch('/user-profiles/me/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('Resume uploaded successfully!');
      // Fetch user profile to update the resume display
      const userResponse = await api.get('/user-profiles/me/');
      setProfile(prev => ({ ...prev, resume: userResponse.data.resume }));
    } catch (error) {
      console.error('Error uploading resume:', error);
      setMessage('Failed to upload resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveResume = async () => {
    setUploading(true);
    setMessage('');

    try {
      await api.patch('/user-profiles/me/', { resume: null });
      setMessage('Resume removed successfully!');
      // Fetch user profile to update the resume display
      const userResponse = await api.get('/user-profiles/me/');
      setProfile(prev => ({ ...prev, resume: userResponse.data.resume }));
    } catch (error) {
      console.error('Error removing resume:', error);
      setMessage('Failed to remove resume. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
          <p className={`mt-1 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Manage your personal information</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className={`rounded-2xl p-8 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            {profile.is_placed && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-4 border-white dark:border-slate-900">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{user?.first_name} {user?.last_name}</h2>
            <p className={isDark ? 'text-slate-400' : 'text-gray-600'}>@{user?.username}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <Mail className="h-4 w-4 text-blue-500" />
                <span>{user?.email}</span>
              </div>
              <div className={`flex items-center space-x-2 text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                <Briefcase className="h-4 w-4 text-purple-500" />
                <span className="capitalize">{user?.role || 'student'}</span>
              </div>
              {profile.is_placed && (
                <div className="flex items-center space-x-2 text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle className="h-4 w-4" />
                  <span className="font-medium">Placed</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className={`mt-8 pt-6 border-t ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Resume</h3>
          {profile.resume ? (
            <div className={`flex items-center justify-between rounded-xl p-4 ${isDark ? 'bg-slate-700/50 border border-slate-600' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className={isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'}>Resume uploaded</p>
                  <p className={isDark ? 'text-slate-400 text-sm' : 'text-gray-600 text-sm'}>Ready for applications</p>
                </div>
              </div>
              <button
                onClick={handleRemoveResume}
                disabled={uploading}
                className="p-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="relative">
              <input
                type="file"
                id="resume-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="resume-upload"
                className={`flex flex-col items-center justify-center space-y-3 border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-blue-500 transition-all ${
                  isDark ? 'border-slate-600 hover:bg-slate-800/50' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <Upload className={`h-6 w-6 transition-colors ${isDark ? 'text-slate-400' : 'text-gray-600'}`} />
                </div>
                <div className="text-center">
                  <p className={isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'}>
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </p>
                  <p className={isDark ? 'text-slate-400 text-sm' : 'text-gray-600 text-sm'}>PDF, DOC, DOCX (max 5MB)</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Applications Status Card */}
      {applications.length > 0 && (
        <div className={`rounded-2xl p-8 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Application Status</h3>
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className={`rounded-lg p-4 ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{application.job_title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        application.status === 'interview_scheduled' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Form */}
      <div className={`rounded-2xl p-8 ${isDark ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-gray-200 shadow-lg'}`}>
        <h2 className={`text-xl font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Edit Profile</h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 ${
            message.includes('success') ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message.includes('success') ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Phone
              </label>
              <div className="relative">
                <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                <input
                  name="phone"
                  type="text"
                  value={profile.phone}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                CGPA
              </label>
              <div className="relative">
                <GraduationCap className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                <input
                  name="cgpa"
                  type="number"
                  step="0.01"
                  max="10"
                  value={profile.cgpa}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="8.5"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Graduation Year
              </label>
              <input
                name="graduation_year"
                type="number"
                value={profile.graduation_year}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="2024"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                Department
              </label>
              <input
                name="department"
                type="text"
                value={profile.department}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Address
            </label>
            <div className="relative">
              <MapPin className={`absolute left-3 top-3 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows={3}
                className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                  isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              Skills (comma-separated)
            </label>
            <input
              name="skills"
              type="text"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Python, JavaScript, React, Django"
              className={`w-full px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                <input
                  name="linkedin_url"
                  type="url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                GitHub URL
              </label>
              <div className="relative">
                <Github className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} />
                <input
                  name="github_url"
                  type="url"
                  value={profile.github_url}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-medium text-white shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
