const socket = io();
const roomId = window.location.pathname.split('/').pop();

socket.emit('join-room', roomId);

socket.on('user-joined', (id) => {
  console.log('User joined', id);
});

socket.on('user-left', (id) => {
  console.log('User left', id);
});
