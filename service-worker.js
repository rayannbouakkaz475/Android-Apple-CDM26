const CACHE_NAME = "cdm-2026-v2";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match(event.request).then(r => r || caches.match("./index.html"))
    )
  );
});

self.addEventListener("push", event => {
  let data = {
    title: "Coupe du Monde 2026",
    body: "Notification test reçue ✅",
    url: "./"
  };

  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data.body = event.data.text() || "Notification test reçue ✅";
    }
  }

  const options = {
    body: data.body || "Notification test reçue ✅",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: "cdm-2026-test",
    requireInteraction: true,
    data: {
      url: data.url || "./"
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      data.title || "Coupe du Monde 2026",
      options
    )
  );
});

self.addEventListener("notificationclick", event => {
  event.notification.close();

  const url = event.notification.data?.url || "./";

  event.waitUntil(
    clients.openWindow(url)
  );
});
