const CACHE = 'icon-media-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/categorias.html',
  '/article.html',
  '/manifest.webmanifest',
  '/icon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      const copy = response.clone();
      if (response.ok && new URL(request.url).origin === self.location.origin) {
        caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});