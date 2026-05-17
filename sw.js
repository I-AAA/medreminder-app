// MedReminder Service Worker v2.0
const CACHE_NAME = "medreminder-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
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
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== "basic") return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match("./index.html"));
    })
  );
});

// Show notification posted from the main app
self.addEventListener("message", event => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, medId } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,
      tag: `med-${medId}`,
      data: { medId },
      actions: [
        { action: "taken", title: "✅ Mark Taken" },
        { action: "snooze", title: "⏰ Snooze 5 min" },
      ],
    });
  }
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const medId = event.notification.data?.medId;

  if (event.action === "taken" && medId) {
    // Tell the app to log this dose as taken
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          client.postMessage({ type: "MARK_TAKEN", medId });
        }
        // If app is not open, open it and pass the action via URL
        if (clientList.length === 0) {
          return clients.openWindow(`./?taken=${medId}`);
        }
      })
    );
    return;
  }

  if (event.action === "snooze") {
    const { title, body } = event.notification;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body: "⏰ Snoozed: " + body,
        icon: "./icons/icon-192.png",
        badge: "./icons/icon-192.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: { medId },
        actions: [
          { action: "taken", title: "✅ Mark Taken" },
          { action: "snooze", title: "⏰ Snooze 5 min" },
        ],
      });
    }, 5 * 60 * 1000);
    return;
  }

  // Default: focus or open the app
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes("medreminder") && "focus" in client) return client.focus();
      }
      return clients.openWindow("./");
    })
  );
});

self.addEventListener("periodicsync", event => {
  if (event.tag === "med-alarm-check") {
    event.waitUntil(Promise.resolve());
  }
});
