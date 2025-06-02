const express = require('express');
const path = require('path');
const cors = require('cors');
const client = require('prom-client');
const { iam } = require('./middleware/auth');

// Create a Registry and collect default metrics
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const { router: authRouter } = require('./routes/auth');
const documentsRouter = require('./routes/documents');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Vault secrets on startup
iam.initializeSecrets();  // ← ADD THIS LINE HERE

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  const metrics = await register.metrics();
  res.end(metrics);
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve static files from React build (production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Welcome to Legal Document Management System API! Frontend runs on port 3001 in development.');
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
