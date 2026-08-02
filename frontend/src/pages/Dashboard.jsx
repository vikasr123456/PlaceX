import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import RecruiterDashboard from '../components/RecruiterDashboard';
import AdminDashboard from '../components/AdminDashboard';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.role]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const role = user?.role || 'student';
      
      if (role === 'student') {
        const [jobsRes, applicationsRes] = await Promise.all([
          api.get('/jobs/'),
          api.get('/applications/'),
        ]);

        setStats({
          jobsApplied: applicationsRes.data.count || 0,
          interviews: applicationsRes.data.results?.filter(app => app.status === 'interview_scheduled').length || 0,
          pending: applicationsRes.data.results?.filter(app => app.status === 'pending').length || 0,
          profileScore: 85,
        });
      } else if (role === 'recruiter') {
        const [jobsRes, applicationsRes] = await Promise.all([
          api.get('/jobs/'),
          api.get('/applications/'),
        ]);

        setStats({
          activeJobs: jobsRes.data.results?.filter(job => job.is_active).length || 0,
          totalApplications: applicationsRes.data.count || 0,
          interviews: applicationsRes.data.results?.filter(app => app.status === 'interview_scheduled').length || 0,
          hired: applicationsRes.data.results?.filter(app => app.status === 'accepted').length || 0,
        });
      } else if (role === 'admin') {
        const [statsRes, companiesRes, jobsRes] = await Promise.all([
          api.get('/user-profiles/stats/'),
          api.get('/companies/'),
          api.get('/jobs/'),
        ]);

        setStats({
          totalStudents: statsRes.data.totalStudents || 0,
          companies: Array.isArray(companiesRes.data) ? companiesRes.data.length : (companiesRes.data.count || 0),
          jobPostings: Array.isArray(jobsRes.data) ? jobsRes.data.length : (jobsRes.data.count || 0),
          activeSessions: 45,
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const role = user?.role || 'student';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome back, {user?.first_name || user?.username}!</h1>
      {role === 'student' && <StudentDashboard stats={stats} />}
      {role === 'recruiter' && <RecruiterDashboard stats={stats} />}
      {role === 'admin' && <AdminDashboard stats={stats} />}
    </div>
  );
};

export default Dashboard;
