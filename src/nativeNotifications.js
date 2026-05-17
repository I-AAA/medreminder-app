import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export const isNative = () => Capacitor.isNativePlatform();

// Stable 32-bit positive integer from a string key
function hashId(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  }
  return Math.abs(h) % 2_000_000_000;
}

// Capacitor weekday: 1 = Sunday … 7 = Saturday  (JS getDay(): 0 = Sunday … 6 = Saturday)
const toCapWeekday = dow => dow + 1;

function buildNotifications(meds) {
  const list = [];
  meds.forEach(med => {
    if (!med.times) return;
    const body = `${med.dosage}${med.notes ? " — " + med.notes : ""}`;

    med.times.forEach(time => {
      const [hour, minute] = time.split(":").map(Number);
      const base = { title: `💊 Time for ${med.name}`, body, extra: { medId: med.id } };

      if (med.schedule === "daily") {
        list.push({
          ...base,
          id: hashId(`${med.id}_${time}`),
          schedule: { on: { hour, minute }, allowWhileIdle: true },
        });
      } else if (med.schedule === "weekly" && med.days?.length) {
        list.push({
          ...base,
          id: hashId(`${med.id}_${time}_w${med.days[0]}`),
          schedule: { on: { weekday: toCapWeekday(med.days[0]), hour, minute }, allowWhileIdle: true },
        });
      } else if (med.schedule === "custom" && med.days?.length) {
        med.days.forEach(dow => {
          list.push({
            ...base,
            id: hashId(`${med.id}_${time}_c${dow}`),
            schedule: { on: { weekday: toCapWeekday(dow), hour, minute }, allowWhileIdle: true },
          });
        });
      }
    });
  });
  return list;
}

export async function requestNativeNotificationPermission() {
  if (!isNative()) return false;
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") return true;
    const result = await LocalNotifications.requestPermissions();
    return result.display === "granted";
  } catch {
    return false;
  }
}

export async function scheduleNativeNotifications(meds) {
  if (!isNative()) return;
  try {
    // Clear all previously scheduled medication notifications
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
    const notifications = buildNotifications(meds);
    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (e) {
    console.warn("Native notification scheduling failed:", e);
  }
}

// Called when the app handles a notification action tap
export function addNativeNotificationListener(onMarkTaken) {
  if (!isNative()) return () => {};
  const handle = LocalNotifications.addListener("localNotificationActionPerformed", event => {
    const medId = event.notification.extra?.medId;
    if (medId) onMarkTaken(medId);
  });
  return () => handle.remove();
}
