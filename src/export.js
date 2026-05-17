import { loadUser, saveUser, loadMeds, saveMeds, loadLogs, saveLogs } from "./storage";
import { getAllPhotos, setPhoto } from "./photoStore";

export async function exportData() {
  const [user, meds, logs, photos] = [loadUser(), loadMeds(), loadLogs(), await getAllPhotos()];
  const payload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    user, meds, logs, photos,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = Object.assign(document.createElement("a"), {
    href: url,
    download: `medreminder-backup-${new Date().toISOString().slice(0, 10)}.json`,
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importData(file) {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!Array.isArray(data.meds)) throw new Error("This does not look like a valid MedReminder backup.");
  if (data.user)   saveUser(data.user);
  if (data.meds)   saveMeds(data.meds);
  if (data.logs)   saveLogs(data.logs);
  if (data.photos) {
    for (const [medId, dataUrl] of Object.entries(data.photos)) {
      await setPhoto(medId, dataUrl);
    }
  }
  return data;
}
