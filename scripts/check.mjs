import fs from 'node:fs'
import path from 'node:path'
import {createHash} from 'node:crypto'
import {execFileSync} from 'node:child_process'
const mode=process.argv[2]||'all'
const allowed=['index','itinerary','activities-and-food','folklore-and-ancient-sites','ruins-and-abbeys','farms-and-rural-industries','independent-makers','cheap-eats','horse-riding']
const forbidden=[/wanderlog\.com\/plan/i,/\bDL\d{3,4}\b/,/two separate (hotel )?rooms/i]
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isSymbolicLink()?(()=>{throw Error(`Symlink prohibited: ${d}/${e.name}`)})():e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)])
const privateWordHashes=new Set(['b7095965389e1bdb4e70408d13fb8bc405aa386b92de6703c5d83acb58c5715a', '04509b0f5f15080ce519d709f84396a2fcf9502e179c6b988e5e6ec38b367694'])
const contactsPath='private/originals/WhatsApp Contacts.md'
const contactSource=fs.existsSync(contactsPath)?fs.readFileSync(contactsPath,'utf8'):''
const privateEmails=contactSource.match(/[\w.+-]+@[\w.-]+\.[a-zA-Z]+/g)||[]
const privatePhones=[...(contactSource.match(/\+?\d[\d ()-]{8,}\d/g)||[]).map(v=>v.replace(/\D/g,'')),...Array.from(contactSource.matchAll(/wa\.me\/(\d+)/g),m=>m[1])]
let count=0
function inspectText(s,label){const digits=s.replace(/\D/g,'');if(privateEmails.some(v=>s.toLowerCase().includes(v.toLowerCase()))||privatePhones.some(v=>digits.includes(v)))throw Error(`Private contact in ${label}`);for(const word of s.toLowerCase().match(/[a-z]+/g)||[])if(privateWordHashes.has(createHash('sha256').update(word).digest('hex')))throw Error(`Private identifier in ${label}`);for(const re of forbidden)if(re.test(s))throw Error(`Private marker in ${label}`)}
function inspect(file){const buf=fs.readFileSync(file);if(buf.includes(0))return;const s=buf.toString();inspectText(s,file);count++}
if(mode==='source'||mode==='all'){
 const files=walk('content')
 if(files.length!==allowed.length)throw Error('Unexpected content file count; review the explicit public allowlist')
 for(const f of files){if(!allowed.includes(path.basename(f,'.md'))||!f.endsWith('.md'))throw Error(`Unapproved public file: ${f}`);inspect(f)}
}
if(mode==='output'||mode==='all'){
 if(!fs.existsSync('public'))throw Error('Build output missing')
 for(const f of walk('public')){
  if(/(?:AGENTS|README|WhatsApp|private|originals)/i.test(f))throw Error(`Excluded output path: ${f}`)
  inspect(f)
 }
 const index=JSON.parse(fs.readFileSync('public/static/contentIndex.json'))
 for(const slug of Object.keys(index))if(!allowed.includes(slug))throw Error(`Unexpected search page: ${slug}`)
 for(const slug of allowed){
  const html=fs.readFileSync(`public/${slug}.html`,'utf8')
  if(!html.includes(`data-guide="ireland-2026/${slug}"`)||!html.includes('collaboration.js')||!html.includes('rel="canonical"'))throw Error(`Missing collaboration/canonical: ${slug}`)
 }
}
// Scan every reachable commit's complete tree, not only the current index.
try{
 execFileSync('git',['rev-parse','--git-dir'],{stdio:'ignore'})
 const tracked=execFileSync('git',['ls-files','-z']).toString().split('\0').filter(Boolean)
 for(const f of tracked)if(/^(private|node_modules|public|\.quartz)\/|(^|\/)(AGENTS\.md|\.quartz-cache)(\/|$)/.test(f))throw Error(`Private/generated file tracked: ${f}`)
 for(const f of tracked)inspect(f)
 const refs=execFileSync('git',['rev-list','--all']).toString().trim().split('\n').filter(Boolean)
 for(const ref of refs){
  const names=execFileSync('git',['ls-tree','-r','--name-only',ref]).toString().split('\n').filter(Boolean)
  for(const n of names){if(/^private\/|WhatsApp|(^|\/)AGENTS\.md$/.test(n))throw Error(`Private file in history ${ref}: ${n}`)}
  const data=execFileSync('git',['grep','-I','-h','-e','',ref],{encoding:'utf8',maxBuffer:30*1024*1024,stdio:['ignore','pipe','ignore']});inspectText(data,'Git history '+ref)
 }
}catch(e){if(e.status!==1&&e.status!==128)throw e}
console.log(`Privacy checks passed (${count} text files; source/output allowlist and available Git history).`)
