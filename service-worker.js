const cacheName = 'pixel-art-generator-v20';
const assetsToCache = [
    'ArtModel/',             // Root folder
    'ArtModel/index.html',   // Main file
    'ArtModel/style.css',    // CSS file
    'ArtModel/script.js',    // JS file
    'ArtModel/service-worker.js' // SW itself (optional to cache)
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Caching assets...');
            return cache.addAll(assetsToCache);
        }).catch((err) => {
            console.error('Cache addAll failed:', err);
        })
    );
    self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== cacheName) {
                        console.log('Deleting old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});
