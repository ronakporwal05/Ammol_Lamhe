// Script to download face-api.js model files
// Run with: node download-models.cjs

const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';

const MODEL_FILES = [
  'ssd_mobilenetv1_model-weights_manifest.json',
  'ssd_mobilenetv1_model-shard1',
  'ssd_mobilenetv1_model-shard2',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
];

const MODELS_DIR = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(MODELS_DIR)) {
  fs.mkdirSync(MODELS_DIR, { recursive: true });
}

const downloadFile = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        https.get(response.headers.location, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => { file.close(); resolve(); });
        }).on('error', reject);
      } else {
        response.pipe(file);
        file.on('finish', () => { file.close(); resolve(); });
      }
    }).on('error', reject);
  });
};

async function main() {
  console.log('Downloading face-api.js model files...\n');

  for (const fileName of MODEL_FILES) {
    const url = `${BASE_URL}/${fileName}`;
    const dest = path.join(MODELS_DIR, fileName);

    if (fs.existsSync(dest)) {
      console.log(`  ✓ ${fileName} (already exists)`);
      continue;
    }

    process.stdout.write(`  ↓ ${fileName}...`);
    try {
      await downloadFile(url, dest);
      console.log(' ✓');
    } catch (err) {
      console.log(` ✗ Error: ${err.message}`);
    }
  }

  console.log('\nDone! Model files are in /public/models/');
}

main();
