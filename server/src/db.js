const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, '../data/rooms.db');
const db = new sqlite3.Database(dbPath);

// Initialize table
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY)');
});

function createRoom(id) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO rooms (id) VALUES (?)', [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

function getRoom(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM rooms WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function deleteRoom(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM rooms WHERE id = ?', [id], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { db, createRoom, getRoom, deleteRoom };
