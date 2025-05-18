const request = require('supertest');
const fs = require('fs');
const path = require('path');

describe('room persistence', () => {
  const dbPath = path.join(__dirname, 'test-rooms.json');
  beforeEach(() => {
    if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    process.env.DB_FILE = dbPath;
    jest.resetModules();
  });

  it('persists rooms across app reload', async () => {
    const { app } = require('../src/app');
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    const roomId = res.body.roomId;

    // simulate server restart
    jest.resetModules();
    process.env.DB_FILE = dbPath;
    const db = require('../src/db');
    db.init();
    const room = db.getRoom(roomId);
    expect(room).toBeDefined();
  });
});
