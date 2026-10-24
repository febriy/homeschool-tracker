import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','sync.js']) await copyFile(file, `dist/${file}`);
for (const file of ['learning.js','learning-data.js','ladder-data.js','sunflower-real.png','styles.css','app.js','curriculum.js','skills.js','skill-data.js','photos.js','sunflower.svg','fraunces.ttf','fraunces-OFL.txt']) await copyFile(`public/${file}`, `dist/${file}`);
