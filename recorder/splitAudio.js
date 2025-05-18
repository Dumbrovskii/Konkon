const { spawn } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const { randomBytes } = require('crypto');

function detectSilence(buffer) {
  return new Promise((resolve, reject) => {
    const args = ['-i', 'pipe:0', '-af', 'silencedetect=noise=-30dB:d=0.2', '-f', 'null', '-'];
    const proc = spawn(ffmpeg, args);
    let stderr = '';
    proc.stderr.on('data', d => stderr += d.toString());
    proc.on('close', () => {
      const ends = [];
      const regex = /silence_end: ([0-9.]+)/g;
      let m;
      while ((m = regex.exec(stderr)) !== null) {
        ends.push(parseFloat(m[1]));
      }
      resolve(ends);
    });
    proc.stdin.write(buffer);
    proc.stdin.end();
  });
}

function cutSegment(buffer, start, duration) {
  return new Promise((resolve, reject) => {
    const args = ['-ss', String(start), '-t', String(duration), '-i', 'pipe:0', '-acodec', 'pcm_s16le', '-f', 'wav', 'pipe:1'];
    const proc = spawn(ffmpeg, args);
    const chunks = [];
    proc.stdout.on('data', d => chunks.push(d));
    proc.on('close', () => resolve(Buffer.concat(chunks)));
    proc.stdin.write(buffer);
    proc.stdin.end();
  });
}

module.exports = async function splitAudio(buffer) {
  const silenceEnds = await detectSilence(buffer);
  const segments = [];
  let last = 0;
  for (let i = 0; i < silenceEnds.length; i++) {
    const end = silenceEnds[i];
    const len = end - last;
    const rand = 1 + Math.random() * 1.5; // 1-2.5 seconds
    if (len >= rand) {
      const data = await cutSegment(buffer, last, len);
      segments.push({ id: randomBytes(16).toString('hex'), data });
      last = end;
    }
  }
  if (segments.length === 0) {
    const data = await cutSegment(buffer, 0, 2);
    segments.push({ id: randomBytes(16).toString('hex'), data });
  }
  return segments.map((s, i) => ({ ...s, order: i }));
};
