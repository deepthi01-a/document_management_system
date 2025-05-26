const express = require('express');
const cors = require('cors');
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;
const { router: authRouter } = require('./routes/auth');
const documentsRouter = require('./routes/documents');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Prometheus metrics endpoint
collectDefaultMetrics();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Auth routes
app.use('/api/auth', authRouter);

// Document routes (GET, POST, PUT, DELETE, SEARCH)
app.use('/api/documents', documentsRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Legal Document Management System API!');
});

// Start server (only if not in test)
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;
