/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { offlineFallback } from 'workbox-recipes'
import { nanoid } from 'nanoid'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const revision = nanoid()
const urlsToCache = (self.__WB_MANIFEST || []).concat([
    { url: '/', revision },
    { url: '/business', revision },
    { url: '/entertainment', revision },
    { url: '/health', revision },
    { url: '/science', revision },
    { url: '/sports', revision },
    { url: '/technology', revision },
    { url: '/search', revision },
    { url: '/saved', revision }
]).filter(({ url }) => url !== '/manifest.json')
precacheAndRoute(urlsToCache)

setDefaultHandler(new CacheFirst())
offlineFallback({
    pageFallback: '/offline',
    imageFallback: '/news.webp'
});

registerRoute(({ url }) => url.pathname === '/manifest.json', new NetworkFirst({
    cacheName: 'manifest',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ url, request }) => url.origin.includes('images.weserv.nl') || request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })
    ]
}))

registerRoute(({ request }) => request.destination === 'style', new StaleWhileRevalidate({
    cacheName: 'styles',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))