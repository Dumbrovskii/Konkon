const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');
const { getRoom } = require('./db');

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', async (roomId) => {
    const room = await getRoom(roomId);
    if (!room) {
      socket.emit('error', 'room not found');
      return;
    }
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-left', socket.id);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
