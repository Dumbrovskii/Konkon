const fs = require('fs');
const path = require('path');

/**
 * Split audio into segments and group them into blocks of 3–5 phrases.
 * This implementation is a placeholder and simply creates mock segments
 * for demonstration purposes.
 *
 * @param {string} audioPath path to original audio file
 * @returns {Array} Array of blocks with timing metadata
 */
function splitAudio(audioPath) {
  // Create mock segments in place of real audio processing
  const segmentCount = 10; // pretend we found 10 segments
  const segments = [];
  for (let i = 0; i < segmentCount; i++) {
    const startTime = i * 5; // pretend each segment is 5 seconds
    const endTime = startTime + 5;
    const file = path.join(path.dirname(audioPath), `segment_${i}.wav`);
    // create empty file as placeholder
    fs.closeSync(fs.openSync(file, 'w'));

    segments.push({
      id: `seg-${i}`,
      index: i,
      startTime,
      endTime,
      file,
    });
  }

  // Group consecutive segments into blocks of random length 3–5
  const blocks = [];
  let cursor = 0;
  let blockIndex = 0;
  while (cursor < segments.length) {
    const size = Math.min(segments.length - cursor, 3 + Math.floor(Math.random() * 3));
    const slice = segments.slice(cursor, cursor + size);
    blocks.push({
      id: `block-${blockIndex}`,
      index: blockIndex,
      startTime: slice[0].startTime,
      endTime: slice[slice.length - 1].endTime,
      segments: slice,
    });
    cursor += size;
    blockIndex += 1;
  }

  return blocks;
}

module.exports = { splitAudio };
