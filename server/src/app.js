const path = require('path');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const rooms = {};
const app = express();
app.use(express.json());

const allowedOriginsEnv = process.env.ALLOWED_ORIGINS;
if (allowedOriginsEnv) {
  const origins = allowedOriginsEnv.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    })
  );
} else {
  app.use(cors());
}

app.use(express.static(path.join(__dirname, '../client')));

app.post('/api/create-call', (req, res) => {
  const roomId = uuidv4();
  rooms[roomId] = { created: Date.now() };
  res.json({ roomId });
});

app.get('/call/:roomId', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/call.html'));
});

app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    res.status(403).json({ error: 'CORS Error: Origin not allowed' });
  } else {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = { app, rooms };
