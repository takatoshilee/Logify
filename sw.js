// sw.js
self.addEventListener('install', event => {
    console.log('Service Worker: Installed');
});

self.addEventListener('fetch', event => {
// For now, simply fetch from network
    event.respondWith(fetch(event.request));
});