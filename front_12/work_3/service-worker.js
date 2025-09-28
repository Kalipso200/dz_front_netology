
const CACHE_NAME = 'app-cache-v1.2.0';
const OFFLINE_CACHE = 'offline-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles/main.css',
  '/script.js',
  '/manifest.json',
  '/offline.html',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png'
];

// Событие установки Service Worker
self.addEventListener('install', (event) => {
  console.log('🛠️ Service Worker: Установка...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Кеширование ресурсов...');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => {
        console.log('✅ Service Worker: Все ресурсы закешированы');
        return self.skipWaiting(); // Активируем сразу
      })
      .catch((error) => {
        console.error('❌ Service Worker: Ошибка кеширования:', error);
      })
  );
});

// Событие активации Service Worker
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker: Активация...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Удаляем старые кеши
          if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE) {
            console.log('🗑️ Service Worker: Удаление старого кеша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('✅ Service Worker: Активирован и готов к работе');
      return self.clients.claim(); // Берем контроль над страницами
    })
  );
});

// Событие перехвата запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем не-GET запросы и chrome-extension
  if (event.request.method !== 'GET' || 
      event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Если есть кешированная версия - возвращаем ее
        if (cachedResponse) {
          console.log('📂 Service Worker: Возвращаем из кеша:', event.request.url);
          return cachedResponse;
        }

        // Если нет в кеше - делаем сетевой запрос
        return fetch(event.request)
          .then((networkResponse) => {
            // Клонируем ответ, т.к. он может быть использован только один раз
            const responseToCache = networkResponse.clone();

            // Кешируем успешные ответы
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  console.log('💾 Service Worker: Кешируем новый ресурс:', event.request.url);
                  cache.put(event.request, responseToCache);
                })
                .catch((error) => {
                  console.error('❌ Service Worker: Ошибка кеширования:', error);
                });
            }

            return networkResponse;
          })
          .catch((error) => {
            console.log('🌐 Service Worker: Офлайн режим для:', event.request.url);
            
            // Для HTML запросов возвращаем offline страницу
            if (event.request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            // Для API запросов возвращаем офлайн ответ
            if (event.request.url.includes('/api/')) {
              return new Response(
                JSON.stringify({
                  error: 'Офлайн режим',
                  message: 'Вы находитесь в офлайн-режиме. Данные могут быть устаревшими.',
                  timestamp: new Date().toISOString()
                }),
                {
                  status: 503,
                  statusText: 'Service Unavailable',
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
            
            // Для других ресурсов пытаемся найти в кеше
            return caches.match(event.request);
          });
      })
  );
});

// Событие обновления контента
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'UPDATE_CACHE') {
    updateCache();
  }
});

// Функция для обновления кеша
async function updateCache() {
  console.log('🔄 Service Worker: Обновление кеша...');
  
  try {
    const cache = await caches.open(CACHE_NAME);
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.status === 200) {
          await cache.put(request, networkResponse.clone());
          console.log('✅ Обновлен ресурс:', request.url);
        }
      } catch (error) {
        console.log('⚠️ Не удалось обновить:', request.url);
      }
    }
    
    console.log('🎉 Service Worker: Кеш обновлен');
  } catch (error) {
    console.error('❌ Service Worker: Ошибка обновления кеша:', error);
  }
}

// Фоновая синхронизация
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Фоновая синхронизация');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Здесь можно реализовать фоновую синхронизацию данных
  console.log('🔄 Выполняется фоновая синхронизация...');
}