import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, GraduationCap, Briefcase, Linkedin, Github, Upload, FileText, X, Save, Shield } from 'lucide-react';
import api from '../api/axios';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    phone: '',
    address: '',
    cgpa: '',
    graduation_year: '',
    department: '',
    skills: '',
    linkedin_url: '',
    github_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student-profiles/me/');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
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
    <div className="space-y-8 animate-slide-up-3d">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your personal information</p>
        </div>
      </div>

      {/* User Info Card */}
      <div className="card-3d rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent-blue-500 to-accent-emerald-500 flex items-center justify-center shadow-3d-sm icon-3d">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-accent-emerald-500 flex items-center justify-center border-4 border-dark-900">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-white">{user?.first_name} {user?.last_name}</h2>
            <p className="text-slate-400">@{user?.username}</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-accent-blue-400" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <Briefcase className="h-4 w-4 text-accent-emerald-400" />
                <span className="capitalize">{profile.role || 'student'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="mt-8 pt-6 border-t border-dark-700/50">
          <h3 className="text-lg font-semibold mb-4 gradient-text">Resume</h3>
          {profile.resume ? (
            <div className="flex items-center justify-between bg-dark-800/50 rounded-xl p-4 border border-dark-700/50 card-hover">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-accent-blue-500/20 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-accent-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">Resume uploaded</p>
                  <p className="text-slate-400 text-sm">Ready for applications</p>
                </div>
              </div>
              <button
                onClick={handleRemoveResume}
                disabled={uploading}
                className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all"
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
                className="flex flex-col items-center justify-center space-y-3 border-2 border-dashed border-dark-600 rounded-xl p-8 cursor-pointer hover:border-accent-blue-500 hover:bg-dark-800/50 transition-all group card-hover"
              >
                <div className="w-12 h-12 rounded-full bg-dark-700 group-hover:bg-accent-blue-500/20 flex items-center justify-center transition-all">
                  <Upload className="h-6 w-6 text-slate-400 group-hover:text-accent-blue-400 transition-colors" />
                </div>
                <div className="text-center">
                  <p className="text-white font-medium">
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </p>
                  <p className="text-slate-400 text-sm">PDF, DOC, DOCX (max 5MB)</p>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Profile Form */}
      <div className="card-3d rounded-2xl p-8">
        <h2 className="text-xl font-semibold mb-6 gradient-text">Edit Profile</h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center space-x-3 card-hover ${
            message.includes('success') ? 'bg-accent-emerald-900/20 border border-accent-emerald-700/50 text-accent-emerald-300' : 'bg-red-900/20 border border-red-700/50 text-red-300'
          }`}>
            {message.includes('success') ? (
              <Shield className="h-5 w-5" />
            ) : (
              <X className="h-5 w-5" />
            )}
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="phone"
                  type="text"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                CGPA
              </label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="cgpa"
                  type="number"
                  step="0.01"
                  max="10"
                  value={profile.cgpa}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="8.5"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Graduation Year
              </label>
              <input
                name="graduation_year"
                type="number"
                value={profile.graduation_year}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                placeholder="2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Department
              </label>
              <input
                name="department"
                type="text"
                value={profile.department}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                placeholder="Computer Science"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                name="address"
                value={profile.address}
                onChange={handleChange}
                rows={3}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all resize-none"
                placeholder="123 Main St, City, State 12345"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Skills (comma-separated)
            </label>
            <input
              name="skills"
              type="text"
              value={profile.skills}
              onChange={handleChange}
              placeholder="Python, JavaScript, React, Django"
              className="w-full px-4 py-3 bg-dark-900/80 border border-dark-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                LinkedIn URL
              </label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="linkedin_url"
                  type="url"
                  value={profile.linkedin_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                GitHub URL
              </label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  name="github_url"
                  type="url"
                  value={profile.github_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl focus:ring-2 focus:ring-accent-blue-500 focus:border-transparent text-white transition-all"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-accent-blue-600 to-accent-emerald-600 hover:from-accent-blue-500 hover:to-accent-emerald-500 rounded-xl font-medium text-white shadow-3d-sm transition-all btn-3d flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
