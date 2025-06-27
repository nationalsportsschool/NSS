import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
// Environment variables starting with VITE_ are automatically available in the app
// Set VITE_API_URL in Vercel environment variables for backend URL
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173  ,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    VitePWA({
      // Don't register in dev mode, main.tsx will handle unregistering
      registerType: mode === 'production' ? 'autoUpdate' : 'prompt',
      injectRegister: mode === 'production' ? 'auto' : null,
      devOptions: {
        enabled: false, // Don't enable in dev mode
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\/lovable-uploads\/.*\.(png|jpg|jpeg|svg|gif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 90 // 90 days
              }
            }
          },
          {
            urlPattern: /\.(css|js)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      },
      includeAssets: ['favicon.ico', 'robots.txt'],
      // Use the existing manifest.json file instead of overriding it
      manifest: false
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    sourcemap: true, // Enable sourcemaps for better debugging
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.VITE_FORCE_PRODUCTION_API': JSON.stringify('true'),
  },
}));
