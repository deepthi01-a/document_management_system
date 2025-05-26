// monitoring/metrics.js
const promClient = require('prom-client');

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const documentUploads = new promClient.Counter({
  name: 'document_uploads_total',
  help: 'Total number of document uploads'
});

const activeUsers = new promClient.Gauge({
  name: 'active_users',
  help: 'Number of active users'
});

module.exports = {
  httpRequestDuration,
  documentUploads,
  activeUsers,
  register: promClient.register
};
