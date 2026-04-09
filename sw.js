// ============================================
// FRETEX — Service Worker
// ============================================

const CACHE_NAME = 'fretex-v6';

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/cliente.html',
  '/motorista.html',
  '/admin.html',
  '/css/global.css',
  '/css/cliente.css',
  '/css/motorista.css',
  '/css/admin.css',
  '/js/firebase.js',
  '/js/auth.js',
  '/js/cliente.js',
  '/js/motorista.js',
  '/js/admin.js',
  '/manifest.json'
];

// Instalação — pre-cache dos assets estáticos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Ativação — limpar caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback para cache
self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET e Firebase
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebaseapp') ||
      event.request.url.includes('googleapis') ||
      event.request.url.includes('gstatic')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Atualizar cache com resposta nova
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => {
        // Offline: retornar do cache
        return caches.match(event.request);
      })
  );
});
