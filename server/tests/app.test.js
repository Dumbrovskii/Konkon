const request = require('supertest');
const { app } = require('../src/app');

describe('POST /api/create-call', () => {
  it('responds with a roomId', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
  });
});
