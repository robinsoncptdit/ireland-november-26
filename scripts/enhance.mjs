import fs from 'node:fs'
const settings=JSON.parse(fs.readFileSync('site/settings.json','utf8'))
for(const name of fs.readdirSync('content').filter(n=>n.endsWith('.md'))){
 const slug=name.slice(0,-3),path=`public/${slug}.html`
 if(!fs.existsSync(path))throw new Error(`Missing guide ${path}`)
 let html=fs.readFileSync(path,'utf8')
 const canonical=`https://${settings.baseUrl}/${slug==='index'?'':slug}`
 const edit=`https://github.com/${settings.repository}/edit/${settings.branch}/content/${name}`
 const panel=`<section class="guide-conversation" aria-label="Discuss and annotate"><h2>Read together</h2><p><a href="${edit}" target="_blank" rel="noopener">Edit this guide</a> · Propose a change on GitHub; only reviewed, merged changes are published.</p><p><strong>General discussion:</strong> Giscus comments, replies and reactions live in GitHub Discussions. Sign in with GitHub to contribute.</p><div class="giscus" data-guide="ireland-2026/${slug}"></div><p class="giscus-status"></p><p><strong>A note on a passage:</strong> <button type="button" id="annotate-guide" data-annotate>Annotate this guide</button>, select text, then choose Annotate. Saving requires a free Hypothesis account. Its annotations are separate from Giscus comments and may be public; do not share private travel details.</p><p id="annotation-status" role="status"></p></section>`
 html=html.replace('</head>',`<link rel="canonical" href="${canonical}"><link rel="stylesheet" href="./trip.css"></head>`)
 html=html.replace(/(<article[^>]*>)/, '$1<nav class="reading-tools" aria-label="Guide tools"><a href="./index">All guides</a> · <a href="./itinerary">Itinerary</a> · <a href="./daily-travel-guide">Daily guide</a> · <a href="./howto">How to use</a> · <button type="button" data-annotate>Annotate this guide</button></nav>')
 html=html.replace('</article>', `</article>${panel}`)
 html=html.replace('</body>',`<script src="./collaboration.js" defer></script></body>`)
 fs.writeFileSync(path,html)
}
fs.copyFileSync('site/trip.css','public/trip.css')
const js=fs.readFileSync('site/collaboration.js','utf8').replace('__SITE_SETTINGS__',JSON.stringify(settings))
fs.writeFileSync('public/collaboration.js',js)
fs.writeFileSync('public/.nojekyll','')
