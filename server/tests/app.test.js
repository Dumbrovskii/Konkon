const request = require('supertest');
const { app } = require('../src/app');

describe('POST /api/create-call', () => {
  it('responds with a roomId', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
  });
});

describe('Invalid requests', () => {
  it('returns 404 for unknown route', async () => {
    const res = await request(app).get('/unknown');
    expect(res.statusCode).toBe(404);
  });

  it('returns 404 for wrong method', async () => {
    const res = await request(app).get('/api/create-call');
    expect(res.statusCode).toBe(404);
  });
});

describe('Error handling', () => {
  // add a route that throws an error for testing
  app.get('/api/error-test', () => {
    throw new Error('test');
  });

  it('returns 500 and generic message for server errors', async () => {
    const res = await request(app).get('/api/error-test');
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal Server Error');
  });
});
