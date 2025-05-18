const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');
const db = require('./db');

db.init();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    const room = db.getRoom(roomId);
    if (!room) {
      socket.emit('error', 'Room not found');
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
