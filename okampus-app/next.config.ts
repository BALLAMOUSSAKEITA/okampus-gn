import type { NextConfig } from "next";
import withPWA from "next-pwa";
// @ts-expect-error — pas de types officiels pour ce sous-module
import defaultCache from "next-pwa/cache";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
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
  fallbacks: {
    document: "/offline",
  },
  runtimeCaching: [...apiCacheRules, ...defaultCache],
})(nextConfig);
