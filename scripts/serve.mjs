import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url)).replace(/[\\/]$/, '');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ttf':'font/ttf','.md':'text/plain; charset=utf-8','.vue':'text/plain; charset=utf-8'};
createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');const name=decodeURIComponent(url.pathname);const file=resolve(root,'.'+(name==='/'?'/index.html':name));if(!file.startsWith(root+sep)){res.writeHead(403).end();return}const content=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(content)}catch{res.writeHead(404).end('Not found')}}).listen(4317,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4317'));
