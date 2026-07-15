import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Shield, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          Welcome to PlaceX Portal
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Your comprehensive placement management system with intelligent resume parsing, 
          job matching, and application tracking.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium flex items-center space-x-2"
          >
            <span>Get Started</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
          >
            Login
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Briefcase className="h-12 w-12 text-primary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Job Management</h3>
          <p className="text-gray-400">
            Browse and apply to jobs from top companies with intelligent matching.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Users className="h-12 w-12 text-secondary-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Application Tracking</h3>
          <p className="text-gray-400">
            Track your applications in real-time with status updates and notifications.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <TrendingUp className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Resume Parsing</h3>
          <p className="text-gray-400">
            AI-powered resume analysis to match you with the best opportunities.
          </p>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <Shield className="h-12 w-12 text-purple-500 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Authentication</h3>
          <p className="text-gray-400">
            JWT-based authentication with secure token management.
          </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center">Technology Stack</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="text-lg font-semibold text-primary-400 mb-2">Backend</h3>
            <ul className="text-gray-400 space-y-1">
              <li>Django REST Framework</li>
              <li>PostgreSQL</li>
              <li>MongoDB</li>
              <li>Celery & Redis</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-400 mb-2">Frontend</h3>
            <ul className="text-gray-400 space-y-1">
              <li>React 18</li>
              <li>Tailwind CSS</li>
              <li>React Router</li>
              <li>Axios</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Infrastructure</h3>
            <ul className="text-gray-400 space-y-1">
              <li>Kubernetes</li>
              <li>Docker</li>
              <li>Load Balancing</li>
              <li>Auto-scaling</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
