// MedReminder Service Worker v3.0
const CACHE_NAME = "medreminder-v3";
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

self.addEventListener("message", event => {
  // ── Immediate notification (foreground trigger) ──────────────────────────
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

  // ── Scheduled alarm (fires even when screen is locked) ───────────────────
  // The app calls this every time it opens, scheduling all of today's remaining
  // alarms as OS-level setTimeout calls inside the SW process.
  // alarmTag is unique per med+time+day so duplicates are suppressed automatically.
  if (event.data?.type === "SCHEDULE_ALARM") {
    const { medId, medName, dosage, notes, delayMs, alarmTag } = event.data;
    setTimeout(() => {
      self.registration.showNotification(`💊 Time for ${medName}`, {
        body: `${dosage}${notes ? " — " + notes : ""}`,
        icon: "./icons/icon-192.png",
        badge: "./icons/icon-192.png",
        vibrate: [300, 100, 300, 100, 300],
        requireInteraction: true,
        tag: alarmTag || `med-${medId}`,
        renotify: true,
        data: { medId, medName },
        actions: [
          { action: "taken", title: "✅ Mark Taken" },
          { action: "snooze", title: "⏰ Snooze 5 min" },
        ],
      });
    }, delayMs);
  }
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const medId = event.notification.data?.medId;

  if (event.action === "taken" && medId) {
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
        for (const client of clientList) {
          client.postMessage({ type: "MARK_TAKEN", medId });
        }
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

// Periodic background sync — Chrome Android wakes the SW occasionally.
// We ask the open app to reschedule; if the app is closed this is a no-op
// (rescheduling happens next time the user opens the app).
self.addEventListener("periodicsync", event => {
  if (event.tag === "med-alarm-check") {
    event.waitUntil(
      clients.matchAll({ type: "window" }).then(clientList => {
        clientList.forEach(client =>
          client.postMessage({ type: "RESCHEDULE_ALARMS" })
        );
      })
    );
  }
});
