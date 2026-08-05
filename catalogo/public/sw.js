// Service Worker for Sistemas Técnicos - Biblioteca Industrial PWA
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `st-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `st-images-${CACHE_VERSION}`;
const PAGE_CACHE = `st-pages-${CACHE_VERSION}`;

// Core Shell assets to pre-cache immediately on installation
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install Event: Cache Core Shell immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Shell');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event: Perform cache cleanup for older versions
self.addEventListener('activate', (event) => {
  const activeCaches = [STATIC_CACHE, IMAGE_CACHE, PAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (!activeCaches.includes(cache)) {
            console.log('[Service Worker] Evicting outdated cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Helper: Determine if request is an image
function isImageRequest(request, url) {
  const acceptHeader = request.headers.get('accept') || '';
  return (
    acceptHeader.includes('image/') ||
    url.pathname.match(/\.(png|jpg|jpeg|gif|svg|webp|ico)/i) ||
    url.host.includes('unsplash.com')
  );
}

// Helper: Determine if request is a static asset (JS, CSS, Fonts)
function isStaticAsset(url) {
  return (
    url.pathname.match(/\.(js|css|woff2|woff|ttf|otf)/i) ||
    url.pathname.includes('/assets/')
  );
}

// Fetch Event: Smart offline routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Exclude API requests from general browser caching
  // Return an elegant JSON fallback when offline for AI services
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        if (url.pathname === '/api/sales/pitch') {
          return new Response(
            JSON.stringify({ 
              error: 'El Agente de Ventas IA Comercial requiere conexión a Internet para procesar de forma segura la inteligencia comercial predictiva.' 
            }), 
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json; charset=utf-8' } 
            }
          );
        }
        return new Response(
          JSON.stringify({ error: 'La API de servicio no está disponible en este momento sin conexión.' }), 
          { 
            status: 503, 
            headers: { 'Content-Type': 'application/json; charset=utf-8' } 
          }
        );
      })
    );
    return;
  }

  // 2. Ignore non-GET requests or browser-extension schemes (chrome-extension://, etc.)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // 3. PAGE NAVIGATION (index.html) - Network-First falling back to Cache
  if (request.mode === 'navigate' || url.pathname === '/') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(PAGE_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match('/').then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 4. IMAGES (Equipment photos, diagrams, logos) - Stale-While-Revalidate Strategy
  // Highly optimized for sub-level technical operations in signal dead zones
  if (isImageRequest(request, url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Quiet fail for background fetching if offline
          });

          // Return immediately if cached, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 5. STATIC ASSETS (JS, CSS, Web Fonts) - Stale-While-Revalidate Strategy
  // Ensures the app shell renders in less than 100ms on repeat visits
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Quiet fail
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 6. GENERAL REQUESTS - Default Network-First falling back to Cache
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(request);
      })
  );
});
