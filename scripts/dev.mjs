import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { GET, POST } from '../api/progress.js';
const port = Number(process.env.PORT || 3000);
http.createServer(async (req,res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/progress') {
    const chunks=[];for await (const chunk of req) chunks.push(chunk);
    const request=new Request(url,{method:req.method,headers:req.headers,...(req.method==='POST'?{body:Buffer.concat(chunks)}:{})});
    const response=await (req.method==='POST'?POST:GET)(request);
    res.writeHead(response.status,Object.fromEntries(response.headers));res.end(await response.text());return;
  }
  const files={'/':'index.html','/index.html':'index.html','/sync.js':'sync.js'};
  if (!files[url.pathname]) {res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',url.pathname.endsWith('.js')?'text/javascript':'text/html');
  res.end(await readFile(files[url.pathname]));
}).listen(port,'127.0.0.1',()=>console.log(`Tracker: http://localhost:${port}`));
