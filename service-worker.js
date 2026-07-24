const CACHE_NAME = 'springforth-cache-v2';
const CACHE_NAME = 'springforth-cache-v2';
const MAX_CACHE_ENTRIES = 60;
const ASSETS = [
  './',
  './index.html',
  './offline.html',
  './dist/output.css',
  './manifest.webmanifest',
  './font-awesome-4.7.0/css/font-awesome.min.css',
  './service-worker.js',
  './IMG/springforth-logo.webp',
  './IMG/HomePage.webp',
  './IMG/aboutus.webp',
  './IMG/Teacher1.webp',
  './IMG/Teacher2.webp',
  './IMG/Teacher3.webp',
  './IMG/Teacher4.webp',
  './IMG/galimg1.webp',
  './IMG/galimg2.webp',
  './IMG/galimg3.webp',
  './IMG/galimg4.webp',
  './IMG/iTTable3.webp',
  './IMG/IMG-20260718-WA0088.webp',
  './IMG/IMG-20260718-WA0093.webp',
  './IMG/basic 5 graduant.webp',
  './IMG/pwa-icon-192.png',
  './IMG/pwa-icon-512.png',
  './result.html'
];

const trimCache = async (cacheName, maxItems) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
  }
};

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )),
      self.clients.claim()
    ])
  );
});

const isNavigationRequest = request => request.mode === 'navigate';
const isStaticAsset = request => ['style', 'script', 'image', 'font', 'document'].includes(request.destination);

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(async cache => {
            await cache.put(event.request, clone);
            await trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
          });
          return response;
        })
        .catch(() => caches.match('./offline.html'))
    );
    return;
  }

  if (isStaticAsset(event.request)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(async cache => {
            await cache.put(event.request, clone);
            await trimCache(CACHE_NAME, MAX_CACHE_ENTRIES);
          });
          return response;
        }).catch(() => caches.match(event.request));
      })
    );
  }
});
