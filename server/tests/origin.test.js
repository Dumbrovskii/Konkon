const ioClient = require('socket.io-client');

describe('socket.io CORS', () => {
  let server, io, port;

  beforeEach(() => {
    jest.resetModules();
    process.env.ALLOWED_ORIGINS = 'http://allowed.com';
    process.env.PORT = 0;
    ({ server, io } = require('../src/server'));
    port = server.address().port;
  });

  afterEach((done) => {
    io.close();
    server.close(done);
  });

  it('rejects disallowed origin', (done) => {
    const socket = ioClient(`http://localhost:${port}`, {
      extraHeaders: { origin: 'http://notallowed.com' },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      done(new Error('should not connect'));
    });
    socket.on('connect_error', () => {
      socket.close();
      done();
    });
  });
});
