const request = require('supertest');
const { app } = require('../src/app');
const { getRoom, db } = require('../src/db');

beforeEach((done) => {
  db.run('DELETE FROM rooms', done);
});

afterAll((done) => {
  db.close(done);
});

describe('POST /api/create-call', () => {
  it('creates a room in the database', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    const room = await getRoom(res.body.roomId);
    expect(room).not.toBeNull();
  });
});
