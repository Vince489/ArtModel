const cacheName = 'pixel-art-generator-v4';
const assetsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/script.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(assetsToCache).catch((err) => {
                console.error('Cache addAll failed:', err);
            });
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
