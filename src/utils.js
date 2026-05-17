export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export function fmtTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function nextDose(times) {
  if (!times || times.length === 0) return "–";
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  const sorted = [...times].sort();
  for (const t of sorted) {
    const [h, m] = t.split(":").map(Number);
    const tM = h * 60 + m;
    if (tM > mins) {
      const diff = tM - mins;
      if (diff < 60) return `in ${diff}m`;
      return `in ${Math.floor(diff / 60)}h ${diff % 60}m`;
    }
  }
  return `tomorrow ${fmtTime(sorted[0])}`;
}

// Returns true if a medication with the given schedule/days should fire today
export function shouldFireToday(schedule, days) {
  if (schedule === "daily") return true;
  const todayDow = new Date().getDay(); // 0=Sun … 6=Sat
  if (!days || days.length === 0) return true; // fallback: fire daily
  return days.includes(todayDow);
}
