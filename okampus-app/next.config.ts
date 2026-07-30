import type { NextConfig } from "next";
import withPWA from "next-pwa";
// @ts-expect-error — pas de types officiels pour ce sous-module
import defaultCache from "next-pwa/cache";

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https: wss:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
};

const apiCacheRules = [
  {
    urlPattern: /^https?:\/\/.*\/scholarships.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-scholarships",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /^https?:\/\/.*\/stages.*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-stages",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 32,
        maxAgeSeconds: 24 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  {
    urlPattern: /^https?:\/\/.*\/(mentors|success-stories|resources|forum).*/i,
    handler: "NetworkFirst",
    options: {
      cacheName: "api-content",
      networkTimeoutSeconds: 10,
      expiration: {
        maxEntries: 48,
        maxAgeSeconds: 12 * 60 * 60,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  importScripts: ["/custom-sw.js"],
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [...apiCacheRules, ...defaultCache],
})(nextConfig);
