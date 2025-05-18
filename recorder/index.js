const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const { splitAudio } = require('./splitAudio');

const USB_PATH = process.env.USB_PATH || '/mnt/usb';
const DURATION = parseInt(process.env.RECORD_DURATION || '30', 10); // seconds

if (!fs.existsSync(USB_PATH)) {
  console.error('USB path not found:', USB_PATH);
  process.exit(1);
}

const sessionId = new Date().toISOString().replace(/[:.]/g, '-');
const videoFile = path.join(USB_PATH, `session-${sessionId}.mp4`);
const audioFile = path.join(USB_PATH, `session-${sessionId}.wav`);
const metaFile = path.join(USB_PATH, `session-${sessionId}.json`);

function extractAudio() {
  spawnSync(ffmpegPath, [
    '-y',
    '-i', videoFile,
    '-vn',
    '-acodec', 'pcm_s16le',
    audioFile
  ], { stdio: 'inherit' });
}

function record() {
  console.log(`Recording ${DURATION}s to ${videoFile}`);
  const args = [
    '-y',
    '-t', String(DURATION),
    '-f', 'v4l2',
    '-i', '/dev/video0',
    '-f', 'alsa',
    '-i', 'default',
    '-c:v', 'libx264',
    '-c:a', 'aac',
    videoFile
  ];
  const proc = spawn(ffmpegPath, args, { stdio: 'inherit' });
  proc.on('exit', async (code) => {
    if (code !== 0) {
      console.error('ffmpeg exited with', code);
      return;
    }
    extractAudio();
    try {
      await splitAudio(audioFile, metaFile);
      console.log('Audio chunks saved to', metaFile);
    } catch (err) {
      console.error('splitAudio error:', err);
    }
  });
}

record();
