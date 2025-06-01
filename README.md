# Legal Document Management System

A full-stack web application for managing legal documents with authentication, file upload, and monitoring capabilities.

## 🚀 Features

- **Document Management**: Create, read, update, delete legal documents
- **User Authentication**: JWT-based secure authentication
- **File Upload**: Support for document file uploads
- **Real-time Monitoring**: Prometheus metrics and Grafana dashboards
- **Responsive UI**: Modern React frontend
- **API Testing**: Comprehensive test suite
- **CI/CD Pipeline**: Automated testing with GitHub Actions
- **Containerization**: Docker support for easy deployment

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication
- **Multer** - File upload handling
- **Prometheus** - Metrics collection
- **Jest & Supertest** - Testing

### Frontend
- **React** - UI library
- **CSS3** - Styling
- **Fetch API** - HTTP requests

### DevOps & Monitoring
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboards
- **GitHub Actions** - CI/CD pipeline

## 📁 Project Structure

legal-docs-project/
├── src/
│ ├── app.js # Main server file
│ └── routes/
│ ├── documents.js # Document CRUD operations
│ └── auth.js # Authentication routes
├── frontend/
│ ├── src/
│ │ ├── App.js # Main React component
│ │ └── App.css # Styling
│ └── package.json # Frontend dependencies
├── tests/
│ └── app.test.js # API tests
├── uploads/ # File upload directory
├── docker-compose.yml # Multi-service setup
├── prometheus.yml # Monitoring configuration
├── Dockerfile # Container configuration
└── package.json # Backend dependencies
