import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      registerType: "autoUpdate",
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon-180x-180.png",
        "maskable-icon-512x512.png",
      ],
      manifest: {
        name: "snot.app - track your hayfever symptoms",
        short_name: "snot.app",
        description: "Snot.app lets you track your hayfever symptoms",
        dir: "ltr",
        lang: "en",
        start_url: "/",
        scope: "/",
        id: "snot-app",
        orientation: "portrait",
        display: "minimal-ui",
        theme_color: "mediumseagreen",
        background_color: "mediumspringgreen",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "script" ||
              request.destination === "worker",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "static-resources",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 24 * 60 * 60, // 60 days
              },
            },
          },
          {
            urlPattern: /\.json$/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "static-data-assets",
              expiration: {
                maxEntries: 32,
                maxAgeSeconds: 24 * 60 * 60, // 24 hours
              },
            },
          },
        ],
      },
    }),
  ],
});
