import React from 'react';
import './LandingPage.css';

function LandingPage({ onGetStarted }) {
  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'JWT-based secure login system with role-based access control'
    },
    {
      icon: '📄',
      title: 'Document Management',
      description: 'Create, edit, delete and organize legal documents efficiently'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Monitor document metrics with Prometheus and Grafana dashboards'
    },
    {
      icon: '🚀',
      title: 'Modern Tech Stack',
      description: 'Built with React, Node.js, Express, and containerized with Docker'
    },
    {
      icon: '🔍',
      title: 'Smart Search',
      description: 'Quickly find documents with advanced search and filtering'
    },
    {
      icon: '☁️',
      title: 'Cloud Ready',
      description: 'Scalable architecture with CI/CD pipeline and cloud deployment'
    }
  ];

  const techStack = [
    { name: 'React', color: '#61DAFB' },
    { name: 'Node.js', color: '#339933' },
    { name: 'Express', color: '#000000' },
    { name: 'Docker', color: '#2496ED' },
    { name: 'Prometheus', color: '#E6522C' },
    { name: 'Grafana', color: '#F46800' }
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Legal Document Management System</h1>
            <p className="hero-subtitle">
              Streamline your legal document workflow with our modern, secure, and scalable platform
            </p>
            <div className="hero-features">
              <span>✨ Modern UI</span>
              <span>🔒 Secure</span>
              <span>📊 Analytics</span>
              <span>🚀 Fast</span>
            </div>
            <div className="hero-buttons">
              <button className="cta-button" onClick={onGetStarted}>
                Get Started
              </button>
              <button className="demo-button" onClick={onGetStarted}>
                View Demo
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span className="preview-title">Legal DMS Dashboard</span>
              </div>
              <div className="preview-content">
                <div className="preview-stats">
                  <div className="stat-box">📄 24 Docs</div>
                  <div className="stat-box">🆕 5 Recent</div>
                  <div className="stat-box">📁 8 Categories</div>
                </div>
                <div className="preview-documents">
                  <div className="doc-item">Contract Agreement.pdf</div>
                  <div className="doc-item">Legal Brief.docx</div>
                  <div className="doc-item">Case Study.pdf</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Powerful Features</h2>
          <p className="section-subtitle">Everything you need for professional document management</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-stack">
        <div className="container">
          <h2>Built with Modern Technologies</h2>
          <p className="section-subtitle">Leveraging the best tools for performance and scalability</p>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <div key={index} className="tech-item" style={{ borderColor: tech.color }}>
                <span style={{ color: tech.color }}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>100%</h3>
              <p>Secure</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Monitoring</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime</p>
            </div>
            <div className="stat-item">
              <h3>Fast</h3>
              <p>Performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of legal professionals who trust our platform</p>
          <button className="cta-button large" onClick={onGetStarted}>
            Start Managing Documents Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Legal DMS</h4>
              <p>Modern document management for legal professionals</p>
            </div>
            <div className="footer-section">
              <h4>Features</h4>
              <ul>
                <li>Document Management</li>
                <li>Secure Authentication</li>
                <li>Real-time Analytics</li>
                <li>Cloud Deployment</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Technology</h4>
              <ul>
                <li>React Frontend</li>
                <li>Node.js Backend</li>
                <li>Docker Containers</li>
                <li>CI/CD Pipeline</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Demo</h4>
              <p>Username: demo</p>
              <p>Password: demo123</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Legal Document Management System. Built for demonstration purposes.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
