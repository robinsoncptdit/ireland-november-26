import fs from 'node:fs'
import path from 'node:path'
const files=fs.readdirSync('public').filter(n=>n.endsWith('.html'))
let checked=0
for(const f of files){
 const html=fs.readFileSync(`public/${f}`,'utf8')
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  const href=match[1].replaceAll('&amp;','&')
  if(/^(?:https?:|mailto:|tel:|data:|\/\/)/.test(href))continue
  const url=new URL(href,`https://local.test/${f}`)
  let name=decodeURIComponent(url.pathname).replace(/^\/ireland-november-26(?=\/|$)/,'').slice(1)
  if(!name||name.endsWith('/'))name+='index.html'
  if(!path.extname(name))name+='.html'
  const target=path.join('public',name)
  if(!fs.existsSync(target))throw Error(`Broken local link ${f}: ${href}`)
  if(url.hash&&name.endsWith('.html')){
   const id=decodeURIComponent(url.hash.slice(1));const dest=fs.readFileSync(target,'utf8')
   if(!dest.includes(`id="${id}"`))throw Error(`Missing anchor ${f}: ${href}`)
  }
  checked++
 }
}
console.log(`Checked ${checked} local links/assets and anchors across ${files.length} HTML pages.`)
