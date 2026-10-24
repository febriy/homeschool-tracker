import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html','sync.js']) await copyFile(file, `dist/${file}`);
for (const file of ['styles.css','app.js','curriculum.js','skills.js','skill-data.js']) await copyFile(`public/${file}`, `dist/${file}`);
