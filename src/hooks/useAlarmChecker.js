import { useEffect } from "react";
import { loadLogs, saveLogs } from "../storage";
import { todayKey, shouldFireToday } from "../utils";
import { playAlarm } from "../audio";
import { isNative } from "../nativeNotifications";

function fireWebNotification(med) {
  if (Notification.permission !== "granted") return;
  const body = `${med.dosage}${med.notes ? " — " + med.notes : ""}`;
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      title: `💊 Time for ${med.name}`,
      body,
      medId: med.id,
    });
  } else {
    new Notification(`💊 Time for ${med.name}`, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { medId: med.id },
    });
  }
}

export function useAlarmChecker(meds) {
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const logs = loadLogs();
      const key = todayKey();
      if (!logs[key]) logs[key] = {};

      let dirty = false;
      meds.forEach(med => {
        if (!med.times) return;
        if (!shouldFireToday(med.schedule, med.days)) return;

        med.times.forEach(t => {
          const alertedKey = `${med.id}_${t}_alerted`;
          if (t === hhmm && !logs[key][alertedKey]) {
            logs[key][alertedKey] = true;
            dirty = true;
            // Always play audio + vibrate in-app (works web and native foreground)
            playAlarm(med.ringtone || "default");
            if ("vibrate" in navigator) navigator.vibrate([300, 100, 300]);
            // Only send web push notification when running as a PWA (not native Capacitor)
            if (!isNative()) fireWebNotification(med);
          }
        });
      });

      if (dirty) saveLogs(logs);
    };

    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  }, [meds]);
}
