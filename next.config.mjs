import withPWAInit from "@serwist/next";

const pages = ["/", "/saved", "/search", "/_offline"];
const news = ["0.webp", "1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp", "8.webp", "9.webp"].map((news) => `/news/${news}`);
const extras = ["/favicon.ico"];
const revision = `${Date.now()}`;

const withPWA = withPWAInit({
  swSrc: "src/sw.js",
  swDest: "public/sw.js",
  exclude: [/public\/sw.js/],
  disable: process.env.NODE_ENV === "development",
  additionalPrecacheEntries: pages.concat(news, extras).map((url) => ({ url, revision })),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    nextScriptWorkers: true,
  },
};

export default withPWA(nextConfig);
