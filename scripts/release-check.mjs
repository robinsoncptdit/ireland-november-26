import fs from 'node:fs'
const s=JSON.parse(fs.readFileSync('site/settings.json','utf8'))
if(!s.giscus.repoId||!s.giscus.categoryId)throw Error('Publication blocked: configure Giscus repository/category IDs first.')
if(s.baseUrl!==`${s.repository.split('/')[0]}.github.io/${s.repository.split('/')[1]}`)throw Error('Pages URL and repository disagree')
console.log('Release configuration complete.')
