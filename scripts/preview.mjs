import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
const root=path.resolve('public')
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'}
http.createServer((req,res)=>{
 let url;try{url=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400).end();return}
 const prefix='/ireland-november-26';if(url===prefix||url.startsWith(prefix+'/'))url=url.slice(prefix.length)||'/'
 let file=path.resolve(root,'.'+url)
 if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
 if(url.endsWith('/'))file=path.join(file,'index.html')
 if(!fs.existsSync(file)&&!path.extname(file))file+='.html'
 if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end('Not found');return}
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res)
}).listen(8096,'127.0.0.1',()=>console.log('Preview: http://localhost:8096/ireland-november-26/'))
