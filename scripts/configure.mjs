import fs from 'node:fs'
import YAML from 'yaml'
const settings=JSON.parse(fs.readFileSync('site/settings.json','utf8'))
const config=YAML.parse(fs.readFileSync('quartz.config.yaml','utf8'))
Object.assign(config.configuration,{pageTitle:'Ireland · November 2026',baseUrl:settings.baseUrl,enableSPA:false,enablePopovers:false,analytics:null,ignorePatterns:['private','AGENTS.md','README.md']})
config.configuration.theme.fontOrigin='local'
config.configuration.theme.typography={header:'Georgia',body:'system-ui',code:'monospace'}
Object.assign(config.configuration.theme.colors.lightMode,{light:'#faf7ef',lightgray:'#dfdfd2',darkgray:'#38483e',dark:'#173b30',secondary:'#28654e',tertiary:'#a36e35'})
const enabled=new Set(['note-properties','created-modified-date','github-flavored-markdown','table-of-contents','crawl-links','description','remove-draft','content-index','favicon','content-page','explorer','search','article-title','page-title','darkmode','footer'])
if(!config.plugins.some(p=>p.source.endsWith('/note-properties')))config.plugins.push({source:'@quartz-community/note-properties',enabled:true,order:5,options:{hidePropertiesView:true}})
config.plugins=config.plugins.filter(p=>enabled.has(p.source.split('/').pop()))
for(const p of config.plugins){p.enabled=true;if(p.source.endsWith('/footer'))p.options={links:{'Source & proposed edits':`https://github.com/${settings.repository}`}};if(p.source.endsWith('/content-index'))p.options={enableSiteMap:true,enableRSS:false}}
fs.writeFileSync('quartz.config.yaml',YAML.stringify(config))
