// ══════════════════════════════════════════════
// Mercado ON — Service Worker
// ══════════════════════════════════════════════
const CACHE_NAME = 'mercado-on-v1';
const ASSETS_ESSENCIAIS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instala o SW e guarda os arquivos essenciais no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_ESSENCIAIS))
      .then(() => self.skipWaiting())
  );
});

// Ativa e limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NAME)
          .map((nome) => caches.delete(nome))
      )
    ).then(() => self.clients.claim())
  );
});

// Estratégia: network-first para HTML (sempre busca a versão mais nova),
// cache-first para os demais arquivos estáticos.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Não interceptar chamadas para o Firebase/Firestore/Storage (deixa ir direto pra rede)
  if (request.url.includes('firestore.googleapis.com') ||
      request.url.includes('firebasestorage.googleapis.com') ||
      request.url.includes('googleapis.com') ||
      request.url.includes('gstatic.com')) {
    return;
  }

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
          return resposta;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resposta) => {
        const copia = resposta.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copia));
        return resposta;
      }).catch(() => cached);
    })
  );
});
