import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','sync.js']) await copyFile(file, `dist/${file}`);
for (const file of ['manifest.webmanifest','app-icon.svg','app-icon.png','icon-maskable.png','icon-512.png','icon-192.png','apple-touch-icon.png','favicon-32.png','backups.js','backup-data.js','book-progress.js','play.js','play-data.js','i18n.js','learning.js','learning-data.js','ladder-data.js','citrus-border.webp','citrus-branch.webp','citrus-paper.webp','allura.ttf','allura-OFL.txt','courgette.ttf','courgette-OFL.txt','styles.css','app.js','curriculum.js','skills.js','skill-data.js','photos.js','fraunces.ttf','fraunces-OFL.txt']) await copyFile(`public/${file}`, `dist/${file}`);

await copyFile('node_modules/fflate/esm/browser.js','dist/zip.js');
await copyFile('node_modules/fflate/LICENSE','dist/zip-LICENSE.txt');
