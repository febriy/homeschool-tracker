import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','sync.js']) await copyFile(file, `dist/${file}`);
for (const file of ['manifest.webmanifest','app-icon.svg','app-icon.png','icon-maskable.png','icon-512.png','icon-192.png','apple-touch-icon.png','favicon-32.png','learning.js','learning-data.js','ladder-data.js','literary-table.webp','reading-garden-v2.webp','morning-glory.webp','courgette.ttf','courgette-OFL.txt','styles.css','app.js','curriculum.js','skills.js','skill-data.js','photos.js','fraunces.ttf','fraunces-OFL.txt']) await copyFile(`public/${file}`, `dist/${file}`);
