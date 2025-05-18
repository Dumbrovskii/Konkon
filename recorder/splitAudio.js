const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');

/**
 * Detects silence in the input file and groups segments into random
 * 3-5-word chunks. Each chunk is uploaded to the Kitsu9 server and
 * recorded in the provided metadata file.
 *
 * @param {string} input - Path to WAV file.
 * @param {string} metaFile - Path to JSON metadata output.
 * @returns {Promise<void>}
 */
async function splitAudio(input, metaFile) {
  // Detect silence
  const detect = spawnSync(ffmpegPath, [
    '-i', input,
    '-af', 'silencedetect=noise=-30dB:d=0.5',
    '-f', 'null',
    '-'
  ], { encoding: 'utf8' });

  if (detect.error) {
    throw detect.error;
  }

  const events = [];
  const lines = detect.stderr.split('\n');
  for (const line of lines) {
    const mStart = line.match(/silence_start: (\d+\.?\d*)/);
    const mEnd = line.match(/silence_end: (\d+\.?\d*)/);
    if (mStart) events.push({ type: 'start', time: parseFloat(mStart[1]) });
    if (mEnd) events.push({ type: 'end', time: parseFloat(mEnd[1]) });
  }

  events.sort((a, b) => a.time - b.time);
  const segments = [];
  let last = 0;
  for (const ev of events) {
    if (ev.type === 'start') {
      segments.push({ start: last, end: ev.time });
    } else if (ev.type === 'end') {
      last = ev.time;
    }
  }

  // Determine duration for the final segment
  const probe = spawnSync(ffmpegPath.replace(/ffmpeg$/, 'ffprobe'), [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=noprint_wrappers=1:nokey=1',
    input
  ], { encoding: 'utf8' });
  const duration = parseFloat(probe.stdout);
  if (!isNaN(duration) && last < duration) {
    segments.push({ start: last, end: duration });
  }

  const mapping = [];
  let index = 0;
  for (let i = 0; i < segments.length; ) {
    const groupSize = Math.floor(Math.random() * 3) + 3; // 3-5 segments
    const group = segments.slice(i, i + groupSize);
    const startTime = group[0].start;
    const endTime = group[group.length - 1].end;
    const id = uuidv4();
    const outFile = path.join(path.dirname(metaFile), `${id}.wav`);
    const cut = spawnSync(ffmpegPath, [
      '-y',
      '-i', input,
      '-ss', startTime.toString(),
      '-to', endTime.toString(),
      '-c', 'copy',
      outFile
    ]);

    if (cut.status !== 0) {
      console.error('ffmpeg split error:', cut.stderr.toString());
      i += groupSize;
      continue;
    }

    const buffer = fs.readFileSync(outFile);
    try {
      await fetch(process.env.KITSU9_URL || 'http://localhost:4000/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'audio/wav' },
        body: buffer
      });
    } catch (err) {
      console.error('Failed to upload chunk:', err.message);
    }

    fs.unlinkSync(outFile);
    mapping.push({ id, index, startTime, endTime });
    index++;
    i += groupSize;
  }

  fs.writeFileSync(metaFile, JSON.stringify(mapping, null, 2));
}

module.exports = { splitAudio };
