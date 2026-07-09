const CACHE_NAME = 'card-games-v8';
const CACHE_URLS = [
  './',
  './index.html',
  './kings.html',
  './ftd.html',
  './the-grid.html',
  './ride-the-bus.html',
  './party-prompts.html',
  './deck.js',
  './style.css',
  './manifest.json',
  './icon-beer-180.png',
  './icon-beer-192.png',
  './icon-beer-512.png',
  './qr-lightning.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first: always try the network so updates land immediately;
// fall back to cache when offline.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
