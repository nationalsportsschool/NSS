import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handle service worker based on environment
if (import.meta.env.DEV) {
  if ('serviceWorker' in navigator) {
    // Unregister all service workers in development
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((isUnregistered) => {
          if (isUnregistered) {
            console.log('[PWA] ✅ Service worker unregistered in dev mode');
          }
        });
      }
    });

    // Clear all service worker-related caches
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames.forEach((cacheName) => {
          caches.delete(cacheName).then((isDeleted) => {
            if (isDeleted) {
              console.log(`[PWA] 🗑️ Cache "${cacheName}" deleted in dev mode`);
            }
          });
        });
      });
    }

    console.warn('[PWA] ⚠️ Service workers disabled in development');
  }
} else {
  // In production, register the service worker through vite-plugin-pwa
  // This is now handled automatically by the VitePWA plugin with autoUpdate
  console.log('[PWA] 🚀 PWA enabled in production mode');
  
  // Optional: Add a custom reload for new content
  let refreshing = false;
  
  // Detect controller change and refresh the page
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });
}

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
