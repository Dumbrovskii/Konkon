const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const rooms = {};
const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, '../client')));

app.post('/api/create-call', (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = { created: Date.now() };
  res.json({ roomId });
});

app.get('/call/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/call.html'));
});

app.get('/api/error', (req, res, next) => {
  const err = new Error('Test error');
  err.status = 500;
  next(err);
});

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ code: status, message: err.message });
});

module.exports = { app, rooms };
