const request = require('supertest');
const app = require('../src/app'); // Adjust the path if your app.js is elsewhere

describe('API Endpoints', () => {
  it('should return healthy status on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('healthy');
  });

  it('should create a new document', async () => {
    const res = await request(app)
      .post('/api/documents')
      .send({
        title: "Test Document",
        content: "This is a test document.",
        category: "test"
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.document.title).toBe("Test Document");
  });
});
