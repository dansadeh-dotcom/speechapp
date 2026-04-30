// ============================================================
// Service Worker — מדברים ביחד PWA
// Caches the app shell for offline use.
// ============================================================

const CACHE = "mdb-v3";
const ASSETS = [
  "/speechapp/",
  "/speechapp/index.html",
  "/speechapp/manifest.json",
  // Vite builds hashed JS/CSS — they are cached via fetch intercept below
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first for navigation and assets (prevents stale app bundles)
self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET") return;

  if (request.mode === "navigate") {
    // Always try network for HTML
    e.respondWith(
      fetch(request).catch(() => caches.match("/speechapp/index.html"))
    );
    return;
  }

  // Network-first for JS/CSS/fonts/images with cache fallback
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});
