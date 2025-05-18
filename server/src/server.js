const http = require('http');
const { Server } = require('socket.io');
const { app } = require('./app');

const server = http.createServer(app);
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
const io = new Server(server, {
  cors: {
    origin: allowedOriginsEnv
      ? allowedOriginsEnv.split(',').map((o) => o.trim())
      : '*',
  },
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
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
