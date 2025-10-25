// Service Worker for performance optimization
const CACHE_NAME = 'groupxam-v1';
const STATIC_CACHE = 'groupxam-static-v1';
const DYNAMIC_CACHE = 'groupxam-dynamic-v1';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
    '/',
    '/logo.png',
    '/favicon.ico',
    '/manifest.json'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                return cache.addAll(CRITICAL_RESOURCES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip external requests except for critical resources
    if (url.origin !== location.origin) {
        // Only cache Google Analytics and fonts
        if (url.hostname.includes('googletagmanager.com') ||
            url.hostname.includes('fonts.googleapis.com') ||
            url.hostname.includes('fonts.gstatic.com')) {
            event.respondWith(
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    return cache.match(request).then((response) => {
                        if (response) {
                            return response;
                        }
                        return fetch(request).then((fetchResponse) => {
                            // Cache successful responses
                            if (fetchResponse.status === 200) {
                                cache.put(request, fetchResponse.clone());
                            }
                            return fetchResponse;
                        });
                    });
                })
            );
        }
        return;
    }

    // Handle different types of requests
    if (request.destination === 'image') {
        // Cache images with stale-while-revalidate strategy
        event.respondWith(
            caches.open(DYNAMIC_CACHE).then((cache) => {
                return cache.match(request).then((response) => {
                    if (response) {
                        // Return cached version immediately
                        fetch(request).then((fetchResponse) => {
                            if (fetchResponse.status === 200) {
                                cache.put(request, fetchResponse.clone());
                            }
                        });
                        return response;
                    }
                    // Fetch from network and cache
                    return fetch(request).then((fetchResponse) => {
                        if (fetchResponse.status === 200) {
                            cache.put(request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    });
                });
            })
        );
    } else if (request.destination === 'style' || request.destination === 'script') {
        // Cache static assets with cache-first strategy
        event.respondWith(
            caches.open(STATIC_CACHE).then((cache) => {
                return cache.match(request).then((response) => {
                    if (response) {
                        return response;
                    }
                    return fetch(request).then((fetchResponse) => {
                        if (fetchResponse.status === 200) {
                            cache.put(request, fetchResponse.clone());
                        }
                        return fetchResponse;
                    });
                });
            })
        );
    } else {
        // For HTML pages, use network-first strategy
        event.respondWith(
            fetch(request).then((response) => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                // Fallback to cache if network fails
                return caches.match(request);
            })
        );
    }
});

// Background sync for analytics
self.addEventListener('sync', (event) => {
    if (event.tag === 'analytics-sync') {
        event.waitUntil(
            // Send queued analytics data
            sendQueuedAnalytics()
        );
    }
});

// Helper function to send queued analytics
async function sendQueuedAnalytics() {
    try {
        const queue = await getQueuedAnalytics();
        for (const item of queue) {
            await fetch('/api/analytics', {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        // Clear queue after successful send
        await clearQueuedAnalytics();
    } catch (error) {
        console.error('Failed to send queued analytics:', error);
    }
}

// Helper functions for analytics queue
async function getQueuedAnalytics() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const response = await cache.match('/analytics-queue');
    return response ? await response.json() : [];
}

async function clearQueuedAnalytics() {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.delete('/analytics-queue');
}
