const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const record = require('node-record-lpcm16');
const fetch = require('node-fetch');
const splitAudio = require('./splitAudio');

const OUTPUT_DIR = process.env.RECORDER_OUTPUT || '/mnt/usb';
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const videoPath = path.join(OUTPUT_DIR, `recording-${Date.now()}.mp4`);

const audioChunks = [];
const mic = record.record();
mic.stream().on('data', chunk => audioChunks.push(chunk));

console.log('Recording... Press Ctrl+C to stop');

const ffmpegArgs = [
  '-y',
  '-f', 'v4l2',
  '-i', '/dev/video0',
  '-f', 'alsa',
  '-i', 'default',
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-c:a', 'aac',
  videoPath
];

const ffmpegProc = spawn(ffmpeg, ffmpegArgs, { stdio: 'ignore' });

async function finish() {
  mic.stop();
  ffmpegProc.kill('SIGINT');
  const audioBuffer = Buffer.concat(audioChunks);
  try {
    const chunks = await splitAudio(audioBuffer);
    const mapping = [];
    for (let i = 0; i < chunks.length; i++) {
      const { id, data } = chunks[i];
      await fetch('https://kitsu9.example.com/speech-to-text', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav' },
        body: data
      }).catch(() => {});
      mapping.push({ id, order: i });
    }
    fs.writeFileSync(path.join(OUTPUT_DIR, 'transcript_map.json'), JSON.stringify(mapping, null, 2));
    console.log('Finished processing.');
  } catch (err) {
    console.error(err);
  }
  process.exit();
}

process.on('SIGINT', finish);

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