import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { GET, POST } from '../api/progress.js';
import { GET as childrenGET, POST as childrenPOST } from '../api/children.js';
import { handlePhotos } from '../api/photos.js';
const port = Number(process.env.PORT || 3000);
http.createServer(async (req,res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (['/api/progress','/api/children','/api/photos'].includes(url.pathname)) {
    const chunks=[];for await (const chunk of req) chunks.push(chunk);
    const request=new Request(url,{method:req.method,headers:req.headers,...(['POST','PATCH'].includes(req.method)?{body:Buffer.concat(chunks)}:{})});
    const handler=url.pathname==='/api/photos'?handlePhotos:url.pathname==='/api/children'?(req.method==='POST'?childrenPOST:childrenGET):(req.method==='POST'?POST:GET);
    const response=await handler(request);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;
  }
  const files={'/citrus-border.webp':'public/citrus-border.webp','/citrus-branch.webp':'public/citrus-branch.webp','/citrus-paper.webp':'public/citrus-paper.webp','/allura.ttf':'public/allura.ttf','/reading-garden-v2.webp':'public/reading-garden-v2.webp','/reading-garden.webp':'public/reading-garden.webp','/literary-table.webp':'public/literary-table.webp','/morning-glory.webp':'public/morning-glory.webp','/meadow-border.webp':'public/meadow-border.webp','/meadow-sprig.webp':'public/meadow-sprig.webp','/watercolour-table.webp':'public/watercolour-table.webp','/watercolour-books.webp':'public/watercolour-books.webp','/manifest.webmanifest':'public/manifest.webmanifest','/app-icon.svg':'public/app-icon.svg','/app-icon.png':'public/app-icon.png','/icon-maskable.png':'public/icon-maskable.png','/icon-512.png':'public/icon-512.png','/icon-192.png':'public/icon-192.png','/apple-touch-icon.png':'public/apple-touch-icon.png','/favicon-32.png':'public/favicon-32.png','/':'index.html','/index.html':'index.html','/sync.js':'sync.js','/app.js':'public/app.js','/first-light.svg':'public/first-light.svg','/courgette.ttf':'public/courgette.ttf','/styles.css':'public/styles.css','/learning.js':'public/learning.js','/learning-data.js':'public/learning-data.js','/ladder-data.js':'public/ladder-data.js','/sunflower-real.png':'public/sunflower-real.png','/curriculum.js':'public/curriculum.js','/skills.js':'public/skills.js','/skill-data.js':'public/skill-data.js','/photos.js':'public/photos.js','/sunflower.svg':'public/sunflower.svg','/fraunces.ttf':'public/fraunces.ttf'};
  if (!files[url.pathname]) {res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',url.pathname.endsWith('.webmanifest')?'application/manifest+json':url.pathname.endsWith('.webp')?'image/webp':url.pathname.endsWith('.png')?'image/png':url.pathname.endsWith('.svg')?'image/svg+xml':url.pathname.endsWith('.ttf')?'font/ttf':url.pathname.endsWith('.js')?'text/javascript':url.pathname.endsWith('.css')?'text/css':'text/html');
  res.end(await readFile(files[url.pathname]));
}).listen(port,'127.0.0.1',()=>console.log(`Tracker: http://localhost:${port}`));
