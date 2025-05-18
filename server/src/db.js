const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

// Initialize schema
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    created INTEGER
  )`);
});

function createRoom(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO rooms (id, created) VALUES (?, ?)`,
      [id, Date.now()],
      (err) => (err ? reject(err) : resolve())
    );
  });
}

function getRoom(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id, created FROM rooms WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function deleteRoom(id) {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM rooms WHERE id = ?`, [id], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

module.exports = {
  createRoom,
  getRoom,
  deleteRoom,
};
