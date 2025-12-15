const CACHE_NAME = 'nova-pulse-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 1. INSTALACIÓN: Guardamos los archivos en la "caja fuerte" (Caché)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Guardando archivos...');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// 2. ACTIVACIÓN: Limpiamos versiones viejas si actualizas la App
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Borrando caché vieja');
          return caches.delete(key);
        }
      }));
    })
  );
});

// 3. INTERCEPTOR: Cuando la App pide un archivo, se lo damos desde la memoria
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si está en memoria, úsalo. Si no, búscalo en internet.
      return response || fetch(event.request);
    })
  );
});