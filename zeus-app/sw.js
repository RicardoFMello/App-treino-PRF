// Service Worker do Zeus — versão inicial (cache básico de shell)
const CACHE_NAME = 'zeus-v1';
const ARQUIVOS_BASE = [
  './index.html',
  './css/style.css',
  './js/supabase-client.js',
  './js/auth.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ARQUIVOS_BASE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(nomes.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((resposta) => resposta || fetch(event.request))
  );
});
