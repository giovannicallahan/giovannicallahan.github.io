/* MathCosmos service worker (docs/INSTALL.md). Only the website registers it (install.js); the Android app never does.
   It can only ever add an offline copy; it never stands between the player and the server:
   - NETWORK FIRST for every request. Whatever the server answers is passed on untouched (a new release, a 404).
   - The cache is read only when the network gives no answer at all (offline play after one visit).
   - One cache is one release: it is filled during install only, never while the game runs, and it counts only once
     every file is in it (the DONE entry is written last). If one file fails, the install fails, the cache that was
     being filled is dropped, and the previous worker and its complete cache stay until a later visit succeeds.
   - Older caches are deleted on activate, and only when this release's cache is complete.
   - No skipWaiting: a page that is open keeps the worker, and the offline copy, of the release it was loaded with.
   The save lives in localStorage and is never touched here.
   The block between the two marker lines is written by `node tools/build-sw.js`; qa/install.test.js fails when it is stale. */
/* precache:start */
var VERSION='211be4420a75';
var FILES=["app.js","board.js","chapters.js","collection/achievements.js","collection/collection.css","collection/core.js","collection/figures.js","collection/ui.js","concept-lab.js","contracts.js","curriculum.js","daily.css","daily.js","docking.css","docking.js","experiment-high.js","experiment-low.js","extra-quests.js","gameplay.js","gen-a.js","gen-b.js","gen-c.js","gen-core.js","gen-d.js","glossary.js","graph-lab.js","handson.css","handson.js","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","index.html","install.js","lab3d.js","life.css","life.js","manifest.webmanifest","mira.jpg","reading-links.js","realm.html","realms/found/experiments-a.js","realms/found/experiments-b.js","realms/found/experiments-c.js","realms/found/experiments-d.js","realms/found/gen-a.js","realms/found/gen-b.js","realms/found/gen-c.js","realms/found/gen-d.js","realms/found/missions-a.js","realms/found/missions-b.js","realms/found/missions-c.js","realms/found/missions-d.js","realms/found/pack.js","realms/found/practice-1.js","realms/found/practice-2.js","realms/found/practice-3.js","realms/found/practice-4.js","realms/found/practice-5.js","realms/found/practice-6.js","realms/found/practice-7.js","realms/found/practice-8.js","realms/found/variants-a.js","realms/found/variants-b.js","realms/found/variants-c.js","realms/found/variants-d.js","realms/la/pack.js","realms/la/practice-1.js","realms/la/practice-10.js","realms/la/practice-11.js","realms/la/practice-12.js","realms/la/practice-13.js","realms/la/practice-14.js","realms/la/practice-2.js","realms/la/practice-3.js","realms/la/practice-4.js","realms/la/practice-5.js","realms/la/practice-6.js","realms/la/practice-7.js","realms/la/practice-8.js","realms/la/practice-9.js","realms/packs.js","realms/registry.js","save-store.js","shell/home.css","shell/home.js","shell/shell.css","shell/shell.js","shell/vendor/THREE-LICENSE.txt","shell/vendor/three.min.js","skip.js","styles.css","update.css","variants.js"];
/* precache:end */
var PREFIX='mathcosmos-',CACHE=PREFIX+VERSION;
/* Written into a cache last, when every file of the release is in it. */
var DONE=new URL('precache-complete',self.location.href).href, HOME=new URL('index.html',self.location.href).href;

/* Cache key: the file itself, without ?query or #hash (realm.html?realm=la and ?realm=found are one file). */
function keyFor(url){var u=new URL(url);return u.origin+u.pathname}
function sameOriginGet(req){
  if(req.method!=='GET')return false;
  try{return new URL(req.url).origin===self.location.origin}catch(e){return false}
}
/* The cache with that name, when it holds a whole release; otherwise nothing. Never creates a cache. */
function complete(name){
  return caches.has(name).then(function(there){
    if(!there)return null;
    return caches.open(name).then(function(cache){return cache.match(DONE).then(function(done){return done?cache:null})});
  });
}

self.addEventListener('install',function(e){
  /* Every file, straight from the server (cache:'reload'). All of them or nothing. */
  e.waitUntil(caches.open(CACHE).then(function(cache){
    return Promise.all(FILES.map(function(f){
      var url=new URL(f,self.location.href).href;
      return fetch(new Request(url,{cache:'reload'})).then(function(res){
        if(!res||!res.ok)throw new Error('MathCosmos offline copy: could not download '+f);
        return cache.put(keyFor(url),res);
      });
    })).then(function(){return cache.put(DONE,new Response(VERSION))});
  }).catch(function(err){
    /* Drop what was half filled. A cache that was already complete (the same release, installed before) is kept. */
    var fail=function(){throw err};
    return complete(CACHE).then(function(cache){if(!cache)return caches.delete(CACHE)}).then(fail,fail);
  }));
});

self.addEventListener('activate',function(e){
  var claim=function(){return self.clients.claim()};
  e.waitUntil(complete(CACHE).then(function(cache){
    if(!cache)return; /* cannot happen after a good install; if it does, the older offline copy is left alone */
    return caches.keys().then(function(names){
      return Promise.all(names.map(function(n){if(n.indexOf(PREFIX)===0&&n!==CACHE)return caches.delete(n)}));
    });
  }).then(claim,claim));
});

/* The offline answer for a request, from this release's complete cache only. */
function offline(req){
  return complete(CACHE).then(function(cache){
    if(!cache)return;
    var key=keyFor(req.url);
    if(key===DONE)return;
    return cache.match(key,{ignoreVary:true}).then(function(hit){
      if(hit)return hit;
      /* A folder address ("/vector-guild/") or an unknown page offline: the home page. */
      if(req.mode==='navigate'||/\/$/.test(key))return cache.match(HOME,{ignoreVary:true});
    });
  });
}

self.addEventListener('fetch',function(e){
  var req=e.request;
  if(!sameOriginGet(req))return;
  /* Any answer from the network is the answer. Only a network failure looks in the cache; if that finds nothing,
     the page gets the same failure it would get without a service worker. */
  e.respondWith(fetch(req).catch(function(err){
    var fail=function(){throw err};
    return offline(req).then(function(hit){if(hit)return hit;throw err},fail);
  }));
});
