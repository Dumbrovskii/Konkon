process.env.ALLOWED_ORIGINS = 'http://allowed.com';
const request = require('supertest');
// clear cached app in case other tests loaded it
delete require.cache[require.resolve('../src/app')];
const { app } = require('../src/app');

describe('CORS disallowed origins', () => {
  it('rejects requests from disallowed origins', async () => {
    const res = await request(app)
      .post('/api/create-call')
      .set('Origin', 'http://notallowed.com');
    expect(res.statusCode).toBe(403);
    expect(res.body.error).toMatch(/CORS/);
  });
});
