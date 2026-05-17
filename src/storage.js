const KEY_USER = "medreminder_user";
const KEY_MEDS = "medreminder_meds";
const KEY_LOGS = "medreminder_logs";

export function loadUser() {
  try { return JSON.parse(localStorage.getItem(KEY_USER)); } catch { return null; }
}
export function saveUser(u) {
  localStorage.setItem(KEY_USER, JSON.stringify(u));
}
export function loadMeds() {
  try { return JSON.parse(localStorage.getItem(KEY_MEDS)) || []; } catch { return []; }
}
export function saveMeds(meds) {
  localStorage.setItem(KEY_MEDS, JSON.stringify(meds));
}
export function loadLogs() {
  try { return JSON.parse(localStorage.getItem(KEY_LOGS)) || {}; } catch { return {}; }
}
export function saveLogs(logs) {
  localStorage.setItem(KEY_LOGS, JSON.stringify(logs));
}
export function saveSchedule(meds) {
  const schedule = meds.map(({ id, name, dosage, notes, times, schedule: s, days }) => ({
    id, name, dosage, notes, times, schedule: s, days,
  }));
  localStorage.setItem("medreminder_schedule", JSON.stringify(schedule));
}
