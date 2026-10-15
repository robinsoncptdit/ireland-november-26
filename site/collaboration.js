(() => {
 const settings=__SITE_SETTINGS__
 const host=document.querySelector('.giscus')
 if(!host)return
 const status=document.querySelector('.giscus-status')
 if(settings.giscus.repoId && settings.giscus.categoryId){
  const script=document.createElement('script')
  script.src='https://giscus.app/client.js';script.async=true;script.crossOrigin='anonymous'
  const attrs={repo:settings.repository,'repo-id':settings.giscus.repoId,category:settings.giscus.category,'category-id':settings.giscus.categoryId,mapping:'specific',term:host.dataset.guide,strict:'1','reactions-enabled':'1','emit-metadata':'0','input-position':'top',theme:'preferred_color_scheme',lang:'en',loading:'lazy'}
  for(const [k,v] of Object.entries(attrs))script.setAttribute('data-'+k,v)
  script.onerror=()=>{status.textContent='Comments could not load. Open the repository’s Discussions tab to join in.'}
  host.append(script)
 }else status.textContent='Comments will open here once the repository’s GitHub Discussions connection is configured.'
 window.hypothesisConfig=()=>({showHighlights:true,openSidebar:new URLSearchParams(location.search).has('annotate')})
 const h=document.createElement('script');h.src='https://hypothes.is/embed.js';h.async=true
 const note=document.querySelector('#annotation-status')
 h.onerror=()=>{note.textContent='Annotations could not load. Check your connection or content blocker and reload.'}
 document.head.append(h)
 document.querySelectorAll('[data-annotate]').forEach(button=>button.addEventListener('click',()=>{
  const url=new URL(location.href);url.searchParams.set('annotate','1');url.hash='';location.assign(url)
 }))
})()
