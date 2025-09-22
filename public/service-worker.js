const CACHE_NAME = 'snot-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css', // Assuming style.css is directly accessible or bundled
  '/main.js',   // Assuming main.js is directly accessible or bundled
  // Add other critical assets here, like images, fonts, etc.
  // Vite typically bundles assets, so you might need to adjust paths or use a build-time manifest
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
