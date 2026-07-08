import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [status, setStatus] = useState('checking'); // checking | online | offline
  const [apiData, setApiData] = useState(null);
  const [lastChecked, setLastChecked] = useState('');

  const fetchWelcomeData = async () => {
    setStatus('checking');
    try {
      // Fetching from Django backend container/server running on port 8000
      const response = await fetch('http://localhost:8000/api/welcome/');
      if (response.ok) {
        const data = await response.json();
        setApiData(data);
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('Error fetching welcome endpoint:', error);
      setStatus('offline');
    } finally {
      const now = new Date();
      setLastChecked(now.toLocaleTimeString());
    }
  };

  useEffect(() => {
    fetchWelcomeData();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <span className="brand-logo">PX</span>
          <span className="brand-name">PlaceX Portal</span>
        </div>
        <div className="status-indicator">
          <span className={`pulsar ${status}`}></span>
          <span>
            API Status: {status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Info Panel */}
        <section className="info-panel">
          <div className="badge">Development Stack Ready</div>
          <h1 className="title">
            Analyze Resume Data <span>Intelligently</span>.
          </h1>
          <p className="description">
            Welcome to the PlaceX Portal. This full-stack system is designed to parse unstructured resume documents using a hybrid architecture of PostgreSQL, MongoDB, Celery, and Redis, integrated with Django REST Framework and a React frontend.
          </p>
          <div className="action-buttons">
            <a 
              href="http://localhost:8000/admin/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              Open Django Admin
              <span className="arrow">→</span>
            </a>
            <button 
              onClick={fetchWelcomeData} 
              className="btn btn-secondary"
            >
              Test Connection
            </button>
          </div>
        </section>

        {/* Connection Status Panel (Right Card) */}
        <section className="status-card">
          <div className="status-header">
            <h3>API Connection Monitor</h3>
            <p className="description" style={{ fontSize: '0.85rem' }}>
              Verifies communication between React and Django REST backend.
            </p>
          </div>

          {status === 'checking' && (
            <div className="api-message" style={{ borderLeftColor: 'var(--text-secondary)' }}>
              Connecting to Django backend at <strong>localhost:8000/api/welcome/</strong>...
            </div>
          )}

          {status === 'online' && apiData && (
            <>
              <div className="api-message">
                <strong>Backend Response:</strong> "{apiData.message}"
              </div>
              <div className="features-list">
                <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                  Backend Configured Capabilities:
                </p>
                {apiData.features_available && apiData.features_available.map((feat, idx) => (
                  <div className="feature-item" key={idx}>
                    <span className="feature-icon">✓</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {status === 'offline' && (
            <div className="api-message" style={{ borderLeftColor: 'var(--error-color)', color: 'var(--error-color)' }}>
              <strong>Connection Failed!</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                Could not connect to Django server at <code>http://localhost:8000</code>. Ensure Docker container is running and healthy.
              </p>
            </div>
          )}

          <div className="retry-container" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Last checked: {lastChecked || 'Never'}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} PlaceX Portal. Created with Django REST & React.</p>
      </footer>
    </div>
  );
}

export default App;
