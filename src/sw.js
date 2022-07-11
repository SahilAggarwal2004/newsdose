/* eslint-disable no-restricted-globals */
import { clientsClaim } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setDefaultHandler } from 'workbox-routing'
import { CacheFirst, NetworkFirst, NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies'
import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { ExpirationPlugin } from 'workbox-expiration'
import { offlineFallback } from 'workbox-recipes'

clientsClaim() // This should be at the top of the service worker
self.skipWaiting()

const urlsToCache = (self.__WB_MANIFEST || []).concat(['/', '/business', '/entertainment', '/health', '/science', '/sports', '/technology', '/saved'])
precacheAndRoute(urlsToCache)

setDefaultHandler(new NetworkOnly())
offlineFallback({ pageFallback: '/offline' });

registerRoute(({ url }) => url.href.includes(process.env.REACT_APP_URL), new NetworkFirst({
    cacheName: 'news',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))

registerRoute(({ url, request }) => url.origin.includes('images.weserv.nl') || request.destination === 'image', new CacheFirst({
    cacheName: 'images',
    plugins: [
        new CacheableResponsePlugin({ statuses: [200] }),
        new ExpirationPlugin({ maxAgeSeconds: 30 * 24 * 60 * 60 })
    ]
}))

registerRoute(({ request }) => request.destination === 'style', new StaleWhileRevalidate({
    cacheName: 'styles',
    plugins: [new CacheableResponsePlugin({ statuses: [200] })]
}))