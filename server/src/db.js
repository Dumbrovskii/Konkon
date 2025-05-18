const fs = require('fs');
const path = require('path');

const dbFile = process.env.DB_FILE || path.join(__dirname, '../rooms.json');

function readData() {
  try {
    const raw = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return { rooms: {} };
  }
}

function writeData(data) {
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
}

function init() {
  if (!fs.existsSync(dbFile)) {
    writeData({ rooms: {} });
  }
}

function createRoom(roomId) {
  const data = readData();
  data.rooms[roomId] = { created: Date.now() };
  writeData(data);
}

function getRoom(roomId) {
  const data = readData();
  return data.rooms[roomId];
}

module.exports = { init, createRoom, getRoom };
