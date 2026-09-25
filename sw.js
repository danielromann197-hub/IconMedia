const CACHE = 'icon-media-v6';
const APP_SHELL = [
  '/',
  '/index.html',
  '/styles.css',
  '/home-polish.css',
  '/home-fix.css',
  '/home-editorial.css',
  '/script.js',
  '/news-data.js',
  '/categorias.html',
  '/article.html',
  '/manifest.webmanifest',
  '/favicon.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const request = event.request;
  const url = new URL(request.url);
  const fresh = request.mode === 'navigate' || ['style','script','manifest'].includes(request.destination);

  if (fresh && url.origin === self.location.origin) {
    event.respondWith(
      fetch(request, { cache: 'no-store' }).then(response => {
        if (response.ok) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
        return response;
      }).catch(() => caches.match(request).then(cached => cached || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && url.origin === self.location.origin) caches.open(CACHE).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});