import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StudentDashboard from '../components/StudentDashboard';
import RecruiterDashboard from '../components/RecruiterDashboard';
import AdminDashboard from '../components/AdminDashboard';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, [user?.role]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/dashboard/stats/');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
      </div>
    );
  }

  const role = user?.role || 'student';

  return (
    <div>
      <h1 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Welcome back, {user?.first_name || user?.username}!
      </h1>
      {role === 'student' && <StudentDashboard stats={stats} />}
      {role === 'recruiter' && <RecruiterDashboard stats={stats} />}
      {role === 'admin' && <AdminDashboard stats={stats} />}
    </div>
  );
};

export default Dashboard;
