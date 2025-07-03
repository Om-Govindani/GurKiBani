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
      includeAssets: ["favicon.svg", "logo.png", "robots.txt"],
      manifest: {
        name: "GurKiBani",
        short_name: "GurKiBani",
        description: "Search and explore Sri Guru Granth Sahib Ji offline",
        theme_color: "#0B0D0E",
        background_color: "#0B0D0E",
        display: "standalone",
        start_url: ".",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 50 * 1024 * 1024,
        globPatterns: ["**/*.{js,css,html,svg,png,json}"],
        runtimeCaching: [
          {
            urlPattern: /SGGS_final\.json$/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "sggs-cache",
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
