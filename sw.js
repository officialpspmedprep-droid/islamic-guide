const CACHE_NAME = 'psp-islamic-guide-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install - Cache everything
self.addEventListener('install', event => {
  console.log('🔄 PSP Islamic Guide PWA Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Opened cache');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ All resources cached');
        return self.skipWaiting();
      })
  );
});

// Activate - Clean up old caches
self.addEventListener('activate', event => {
  console.log('🚀 PSP Islamic Guide PWA Activated');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      ).then(() => self.clients.claim())
    })
  );
});

// Fetch - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});