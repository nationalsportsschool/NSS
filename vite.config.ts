import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
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
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true, // Enable in dev mode for testing
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
      includeAssets: ['favicon.ico', 'robots.txt', 'lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png'],
      manifest: {
        name: 'National Sports School Portal',
        short_name: 'Sports Hub',
        description: 'A comprehensive portal for sports school management',
        start_url: '/?source=pwa',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1e40af',
        orientation: 'portrait-primary',
        scope: '/',
        icons: [
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '144x144',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
            sizes: '72x72',
            type: 'image/png',
            purpose: 'any'
          }
        ],
        categories: ['education', 'sports', 'productivity'],
        screenshots: [
          {
            src: '/lovable-uploads/33900580-8f8e-4c8d-b6d6-511af21db8ca.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Sports School Dashboard Interface'
          }
        ],
        prefer_related_applications: false,
        display_override: ['standalone', 'minimal-ui'],
        shortcuts: [
          {
            name: 'Admin Dashboard',
            short_name: 'Admin',
            description: 'View admin dashboard',
            url: '/admin/dashboard',
            icons: [
              {
                src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: 'Coach Dashboard',
            short_name: 'Coach',
            description: 'View coach dashboard',
            url: '/coach/dashboard',
            icons: [
              {
                src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
                sizes: '96x96'
              }
            ]
          },
          {
            name: 'Parent Dashboard',
            short_name: 'Parent',
            description: 'View parent dashboard',
            url: '/parent/dashboard',
            icons: [
              {
                src: '/lovable-uploads/d3e2c1ed-3a94-410a-92a5-4126a5366ca6.png',
                sizes: '96x96'
              }
            ]
          }
        ]
      }
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
