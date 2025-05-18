const path = require('path');
const { splitAudio } = require('./splitAudio');

async function main() {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: node index.js <audio-file>');
    process.exit(1);
  }
  const tmpDir = path.join(__dirname, 'tmp');
  const chunks = splitAudio(input, tmpDir);
  chunks.forEach(meta => {
    console.log(`Uploaded chunk ${meta.index} id=${meta.id} start=${meta.startTime} end=${meta.endTime}`);
  });
}

main();
