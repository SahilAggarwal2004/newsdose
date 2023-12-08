import withPWAInit from '@serwist/next'

const pages = ['/', '/search', '/saved']
const news = ['0.webp', '1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp'].map(news => `/news/${news}`)
const revision = `${Date.now()}`

const withPWA = withPWAInit({
  swSrc: 'src/sw.js',
  swDest: 'public/sw.js',
  exclude: [/public\/sw.js/],
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: pages.concat(news).map(url => ({ url, revision }))
  // fallbacks
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
    optimizePackageImports: ['']
  }
}

export default withPWA(nextConfig)
