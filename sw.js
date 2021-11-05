self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('fox-store').then((cache) => cache.addAll([
      '/',
      '/index.html',
      '/main.js',
      '/app.js',
      '/style.css',
      '/images/metal.png',
      '/favicon.ico',
      '/manifest.webmanifest'
    ])),
  );
});


self.addEventListener('fetch', (e) => {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});
