const CACHE='lingua-cards-v7-search';
const ASSETS=['./','./index.html','./manifest.webmanifest','./sample-cards.csv'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

// GitHub Pages cannot set custom response headers. Add COOP/COEP to the same-origin
// navigation response so supported browsers can run the official threaded WASM optimizer.
function addIsolationHeaders(response){
  if(!response||!response.ok)return response;
  const headers=new Headers(response.headers);
  headers.set('Cross-Origin-Opener-Policy','same-origin');
  headers.set('Cross-Origin-Embedder-Policy','require-corp');
  return new Response(response.body,{status:response.status,statusText:response.statusText,headers});
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      let response=await caches.match(event.request);
      if(!response)response=await caches.match('./index.html');
      if(!response){try{response=await fetch(event.request);}catch(_){return new Response('Lingua Cards is offline. Reconnect and reload once.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});}}
      return addIsolationHeaders(response);
    })());
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>{
    if(hit)return hit;
    return fetch(event.request).then(response=>{
      if(response&&response.ok&&(response.type==='basic'||response.type==='cors')){
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(event.request,copy)).catch(()=>{});
      }
      return response;
    }).catch(()=>caches.match('./index.html'));
  }));
});
