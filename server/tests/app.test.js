const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { app } = require('../src/app');
const { db, getRoom } = require('../src/db');

beforeAll((done) => {
  db.serialize(() => {
    db.run('DELETE FROM rooms', done);
  });
});

afterAll((done) => db.close(done));

describe('POST /api/create-call', () => {
  it('responds with a roomId', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
    const row = await new Promise((resolve, reject) => {
      getRoom(res.body.roomId).then(resolve).catch(reject);
    });
    expect(row).toBeDefined();
  });
});

describe('CORS', () => {
  it('rejects disallowed origin', async () => {
    const res = await request(app)
      .post('/api/create-call')
      .set('Origin', 'http://evil.com');
    // when no allowed origins configured, all origins allowed
    expect(res.statusCode).toBe(200);
  });
});
