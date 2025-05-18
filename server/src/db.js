const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../rooms.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS rooms (id TEXT PRIMARY KEY, created INTEGER)');
});

function createRoom(id) {
  return new Promise((resolve, reject) => {
    db.run('INSERT INTO rooms(id, created) VALUES(?, ?)', [id, Date.now()], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

function getRoom(id) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM rooms WHERE id = ?', [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function deleteRoom(id) {
  return new Promise((resolve, reject) => {
    db.run('DELETE FROM rooms WHERE id = ?', [id], function(err) {
      if (err) return reject(err);
      resolve();
    });
  });
}

module.exports = { db, createRoom, getRoom, deleteRoom };
