import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [".ngrok-free.app"],
    host: true,
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.svg",
        "logo.png",
        "robots.txt",
        "ਦਰਬਾਰ_ਸਾਹਿਬ.jpg",
        "Darbar-sahib.jpeg",
        "ekOnkaar.png",
      ],
      manifest: {
        name: "GurKiBani",
        short_name: "GurKiBani",
        description: "Search and explore Sri Guru Granth Sahib Ji offline",
        theme_color: "#0B0D0E",
        background_color: "#0B0D0E",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "favicon",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/apple-touch-icon.png",
            sizes: "180x180",
            type: "image/png",
            purpose: "apple touch icon",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 100 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
            urlPattern: /SGGS\.json$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "SGGS-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /SundarGutka\.json$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "SundarGutka-cache",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /A-Step-1\.png$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "A-Step-1",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /A-Step-2\.png$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "A-Step-2",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /A-Step-3\.png$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "A-Step-3",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /I-Step-1\.jpeg$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "I-Step-1",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /I-Step-2\.jpeg$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "I-Step-2",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
          {
            urlPattern: /I-Step-1\.jpeg$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "I-Step-3",
              expiration: {
                maxEntries: 1,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
            },
          },
        ],
      },
    }),
  ],
});
