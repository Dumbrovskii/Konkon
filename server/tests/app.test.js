const request = require('supertest');
const fs = require('fs');
const path = require('path');

describe('POST /api/create-call', () => {
  const dbPath = path.join(__dirname, 'test-app.json');
  beforeEach(() => {
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    process.env.DB_FILE = dbPath;
    jest.resetModules();
  });

  it('responds with a roomId', async () => {
    const { app } = require('../src/app');
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
  });
});
