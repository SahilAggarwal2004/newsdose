import { installSerwist } from "@serwist/sw";

const matcher = ({ request }) => request.destination === "document";

installSerwist({
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  offlineAnalyticsConfig: true,
  navigateFallback: false,
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: { ignoreURLParametersMatching: [/.*/] },
  runtimeCaching: [
    {
      urlPattern: matcher,
      handler: "NetworkOnly",
      options: { cacheName: "documents", precacheFallback: { fallbackURL: "/_offline" } },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: "CacheFirst",
      options: { cacheName: "static-font-assets" },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: "CacheFirst",
      options: { cacheName: "static-image-assets" },
    },
    {
      urlPattern: /\/_next\/image\?url=.+$/i,
      handler: "CacheFirst",
      options: { cacheName: "next-image" },
    },
    {
      urlPattern: /\.(?:mp3|wav|ogg)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-audio-assets",
      },
    },
    {
      urlPattern: /\.(?:mp4)$/i,
      handler: "CacheFirst",
      options: {
        rangeRequests: true,
        cacheName: "static-video-assets",
      },
    },
    {
      urlPattern: /\.(?:js)$/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "js-assets" },
    },
    {
      urlPattern: /\.(?:css|less)$/i,
      handler: "CacheFirst",
      options: { cacheName: "static-style-assets" },
    },
    {
      urlPattern: /\/_next\/data\/.+\/.+\.json$/i,
      handler: "StaleWhileRevalidate",
      options: { cacheName: "next-data" },
    },
    {
      urlPattern: /\.(?:json|xml|csv)$/i,
      handler: "NetworkFirst",
      options: { cacheName: "static-data-assets" },
    },
    {
      urlPattern: ({ url }) => url.pathname === "/geocheck",
      handler: "NetworkFirst",
      options: { cacheName: "location" },
    },
  ],
});
