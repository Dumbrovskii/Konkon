const fs = require('fs');
const http = require('http');
const { splitAudio } = require('./splitAudio');

/**
 * Send a single segment block to the server and remove the temporary file
 * once the upload succeeds.
 */
function sendBlock(block, serverUrl) {
  return new Promise((resolve, reject) => {
    const url = new URL(serverUrl);
    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname,
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav' },
      },
      (res) => {
        res.resume();
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            fs.unlink(block.segments[0].file, () => {});
            resolve();
          } else {
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      }
    );

    req.on('error', reject);

    // Stream the first segment file as a placeholder for the block data
    fs.createReadStream(block.segments[0].file).pipe(req);
  });
}

async function processAudio(filePath, serverUrl) {
  const blocks = splitAudio(filePath);
  for (const block of blocks) {
    try {
      await sendBlock(block, serverUrl);
      console.log(`Uploaded block ${block.id}`);
    } catch (err) {
      console.error(`Failed to upload block ${block.id}:`, err.message);
    }
  }
}

module.exports = { processAudio };
