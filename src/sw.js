/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { offlineFallback } from 'workbox-recipes'
import { imageFallback } from './constants'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const revision = crypto.randomUUID()
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
cleanupOutdatedCaches()

setDefaultHandler(new CacheFirst())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ url: { pathname } }) => pathname === '/manifest.json' || pathname === '/geocheck', new NetworkFirst({
    cacheName: 'network-first',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ url: { origin } }) => origin.includes('images.weserv.nl'), new CacheFirst({
    cacheName: 'images',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({ maxAgeSeconds: 7 * 24 * 60 * 60 })
    ]
}))

registerRoute(({ url: { pathname } }) => imageFallback.includes(pathname), new CacheFirst({
    cacheName: 'images-fallback',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ request: { destination } }) => destination === 'style', new StaleWhileRevalidate({
    cacheName: 'styles',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))