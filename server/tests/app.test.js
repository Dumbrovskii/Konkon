const request = require('supertest');
const { app } = require('../src/app');

describe('POST /api/create-call', () => {
  it('responds with a roomId', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
  });
});

describe('error handling', () => {
  it('returns JSON for not found', async () => {
    const res = await request(app).get('/nonexistent');
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ code: 404, message: 'Not Found' });
  });

  it('returns JSON for thrown errors', async () => {
    const res = await request(app).get('/api/error');
    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ code: 500, message: 'Test error' });
  });
});
