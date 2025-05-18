const request = require('supertest');
const { app } = require('../src/app');
const { getRoom, deleteRoom } = require('../src/db');

describe('POST /api/create-call', () => {
  afterEach(async () => {
    // cleanup all rooms
    await deleteRoom(lastRoomId);
    lastRoomId = null;
  });

  let lastRoomId;

  it('responds with a roomId and stores the room', async () => {
    const res = await request(app).post('/api/create-call');
    expect(res.statusCode).toBe(200);
    expect(res.body.roomId).toBeDefined();
    lastRoomId = res.body.roomId;

    const room = await getRoom(lastRoomId);
    expect(room).toBeDefined();
    expect(room.id).toBe(lastRoomId);
  });

  it('deleteRoom removes the room', async () => {
    const res = await request(app).post('/api/create-call');
    const roomId = res.body.roomId;
    await deleteRoom(roomId);
    const room = await getRoom(roomId);
    expect(room).toBeUndefined();
  });
});
