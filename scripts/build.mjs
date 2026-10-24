import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','sync.js']) await copyFile(file, `dist/${file}`);
for (const file of ['manifest.webmanifest','app-icon.svg','app-icon.png','icon-maskable.png','icon-512.png','icon-192.png','apple-touch-icon.png','favicon-32.png','learning.js','learning-data.js','ladder-data.js','sunflower-real.png','bloom.svg','floral-pattern.svg','styles.css','app.js','curriculum.js','skills.js','skill-data.js','photos.js','sunflower.svg','fraunces.ttf','fraunces-OFL.txt']) await copyFile(`public/${file}`, `dist/${file}`);
