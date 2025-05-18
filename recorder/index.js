const fs = require('fs');
const path = require('path');

// Determine USB path via CLI arg --usbPath or env USB_PATH
function getUsbPath() {
  const argIndex = process.argv.indexOf('--usbPath');
  if (argIndex !== -1 && process.argv.length > argIndex + 1) {
    return process.argv[argIndex + 1];
  }
  return process.env.USB_PATH || '/mnt/usb';
}

const usbPath = getUsbPath();
const sessionFile = path.join(
  usbPath,
  `session-${Date.now()}.json`
);

// Ensure directory exists and open the file descriptor
if (!fs.existsSync(usbPath)) {
  fs.mkdirSync(usbPath, { recursive: true });
}
const fd = fs.openSync(sessionFile, 'a');
fs.writeSync(fd, '[');
fs.fsyncSync(fd);

let firstEntry = true;

function logChunk({ id, index, startTime, endTime }) {
  const entry = JSON.stringify({ id, index, startTime, endTime });
  const prefix = firstEntry ? '' : ',';
  fs.writeSync(fd, prefix + entry);
  fs.fsyncSync(fd); // flush entry to disk
  firstEntry = false;
}

function closeLog() {
  fs.writeSync(fd, ']');
  fs.fsyncSync(fd);
  fs.closeSync(fd);
}

process.on('SIGINT', () => {
  closeLog();
  process.exit();
});

// Placeholder upload function
async function uploadChunkToKitsu9(chunk, info) {
  // TODO: implement actual upload logic
  // After successful upload, log the chunk info
  logChunk(info);
}

module.exports = {
  uploadChunkToKitsu9,
  logChunk,
  closeLog,
  usbPath,
  sessionFile
};
