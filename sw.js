const CACHE='fortuna-v2-3';
const FILES=[
 './','./index.html','./manifest.webmanifest','./icon.svg','./icon.png',
 './fortuna-save-1.jpg','./fortuna-save-2.jpg','./fortuna-save-3.jpg'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('fortuna-')&&key!==CACHE).map(key=>caches.delete(key))))
   .then(()=>self.clients.claim())
 );
});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith(
  caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
   if(response&&response.ok&&new URL(event.request.url).origin===self.location.origin){
    const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));
   }
   return response;
  }))
 );
});
