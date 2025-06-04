const CACHE_NAME = 'behindthetick-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/profiles',
  '/api/market',
  '/api/news',
  '/api/search'
];

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification);
  
  const notification = event.notification;
  const action = event.action;
  const data = notification.data || {};
  
  notification.close();
  
  let url = '/';
  
  // Handle different notification types and actions
  if (data.type === 'trade') {
    if (action === 'view') {
      url = `/profiles/${data.trade?.politician?.toLowerCase().replace(/\s+/g, '-')}`;
    } else if (action === 'watchlist') {
      url = '/watchlist';
    } else {
      url = '/market';
    }
  } else if (data.type === 'price') {
    if (action === 'view') {
      url = `/market?symbol=${data.alert?.symbol}`;
    } else if (action === 'trade') {
      url = `/market?symbol=${data.alert?.symbol}&action=trade`;
    } else {
      url = '/market';
    }
  } else if (data.type === 'news') {
    if (action === 'read') {
      url = '/news';
    } else if (action === 'share') {
      // Handle sharing logic
      url = '/news';
    } else {
      url = '/news';
    }
  } else if (data.type === 'market') {
    url = '/market';
  }
  
  // Open the app with the appropriate URL
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin)) {
            client.focus();
            return client.navigate(url);
          }
        }
        // If app is not open, open it
        return clients.openWindow(url);
      })
  );
});

// Push event handler (for server-sent push notifications)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
  
  if (!event.data) {
    console.log('Push event has no data');
    return;
  }
  
  let data;
  try {
    data = event.data.json();
  } catch (error) {
    console.error('Failed to parse push data:', error);
    return;
  }
  
  const options = {
    body: data.body || 'New update available',
    icon: '/icon-192.png',
    badge: '/favicon.png',
    tag: data.tag || 'default',
    data: data.data || {},
    actions: data.actions || [],
    requireInteraction: data.urgency === 'high',
    vibrate: data.urgency === 'high' ? [200, 100, 200] : [100]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'BehindTheTick', options)
  );
});

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Serve from cache or offline page
          return caches.match(request)
            .then((cachedResponse) => {
              return cachedResponse || caches.match('/offline.html');
            });
        })
    );
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      // Try network first for fresh data
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then((cache) => cache.put(request, responseClone));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache for offline functionality
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                // Add stale data indicator
                const headers = new Headers(cachedResponse.headers);
                headers.append('X-Served-From', 'cache');
                return new Response(cachedResponse.body, {
                  status: cachedResponse.status,
                  statusText: cachedResponse.statusText,
                  headers: headers
                });
              }
              
              // Return offline response for API calls
              return new Response(JSON.stringify({
                success: false,
                error: 'Offline - data not available',
                cached: false
              }), {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              });
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses
            if (response.status === 200 && request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          });
      })
      .catch(() => {
        // Fallback for failed requests
        if (request.destination === 'image') {
          return new Response('', { status: 200, statusText: 'OK' });
        }
        return new Response('Resource not available offline', { 
          status: 503, 
          statusText: 'Service Unavailable' 
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Perform background tasks like syncing offline data
      syncOfflineData()
    );
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received', event);
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'New insider trading activity detected',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: data.url || '/',
      actions: [
        {
          action: 'view',
          title: 'View Details'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'BehindTheTick Alert', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow(event.notification.data || '/')
    );
  }
});

// Helper function to sync offline data
async function syncOfflineData() {
  try {
    // Get offline actions from IndexedDB and sync them
    console.log('Service Worker: Syncing offline data...');
    
    // Example: Sync watchlist changes, alert preferences, etc.
    const offlineActions = await getOfflineActions();
    
    for (const action of offlineActions) {
      try {
        await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });
        
        // Remove successful action from offline queue
        await removeOfflineAction(action.id);
      } catch (error) {
        console.error('Service Worker: Failed to sync action', action, error);
      }
    }
    
    console.log('Service Worker: Offline data sync completed');
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

// Placeholder functions for offline data management
async function getOfflineActions() {
  // In a real implementation, this would read from IndexedDB
  return [];
}

async function removeOfflineAction(actionId) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing offline action:', actionId);
}
