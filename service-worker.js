const CACHE_NAME = 'springforth-cache-v1';
const ASSETS = [
  './',
  './index.html',
  './dist/output.css',
  './manifest.webmanifest',
  './font-awesome-4.7.0/css/font-awesome.min.css',
  './service-worker.js',
  './IMG/springforth-logo.png',
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
  './result.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
