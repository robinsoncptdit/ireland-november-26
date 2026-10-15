import fs from 'node:fs'
import {spawnSync} from 'node:child_process'
const run=(args)=>{const p=spawnSync(process.execPath,args,{stdio:'inherit'});if(p.status!==0)process.exit(p.status||1)}
run(['scripts/check.mjs','source'])
run(['scripts/configure.mjs'])
fs.rmSync('public',{recursive:true,force:true})
run(['quartz/bootstrap-cli.mjs','build','-d','content','-o','public'])
run(['scripts/enhance.mjs'])
run(['scripts/check.mjs','output'])

run(['scripts/links.mjs'])
