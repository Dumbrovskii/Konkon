const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function randomGroupSize() {
  return Math.floor(Math.random() * 3) + 3; // 3-5
}

function splitAudio(inputPath, tmpDir) {
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }
  // Use ffmpeg to split by silence. Each chunk will be saved as chunkNN.wav
  const args = [
    '-i', inputPath,
    '-af', 'silencedetect=noise=-30dB:d=0.5',
    '-f', 'segment',
    '-segment_times', '0', // placeholder; actual silence times auto-chosen
    path.join(tmpDir, 'chunk%03d.wav'),
  ];
  spawnSync('ffmpeg', args, { stdio: 'ignore' });

  const files = fs.readdirSync(tmpDir)
    .filter(f => f.startsWith('chunk') && f.endsWith('.wav'))
    .map(f => path.join(tmpDir, f))
    .sort();

  let index = 0;
  let groups = [];
  while (index < files.length) {
    const size = randomGroupSize();
    const group = files.slice(index, index + size);
    if (group.length) groups.push(group);
    index += size;
  }

  const metadata = [];
  groups.forEach((group, groupIndex) => {
    const chunkPath = path.join(tmpDir, `upload_${groupIndex}.wav`);

    // Concatenate group using ffmpeg concat demuxer
    const listFile = path.join(tmpDir, `list_${groupIndex}.txt`);
    fs.writeFileSync(listFile, group.map(p => `file '${p}'`).join('\n'));
    spawnSync('ffmpeg', ['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', chunkPath], { stdio: 'ignore' });

    const startTime = groupIndex * 0; // placeholder, real time requires parsing
    const endTime = startTime; // placeholder
    metadata.push({ id: path.basename(chunkPath), index: groupIndex, startTime, endTime });

    uploadChunk(chunkPath);

    fs.unlinkSync(chunkPath);
    fs.unlinkSync(listFile);
    group.forEach(p => fs.unlinkSync(p));
  });

  return metadata;
}

function uploadChunk(filePath) {
  // Placeholder upload logic
  console.log(`Uploading ${filePath}`);
}

module.exports = { splitAudio };
