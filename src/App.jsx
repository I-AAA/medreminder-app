import { useState, useEffect, useCallback } from "react";
import { loadUser, saveUser, loadMeds, saveMeds, loadLogs, saveLogs, saveSchedule } from "./storage";
import { todayKey } from "./utils";
import { deletePhoto } from "./photoStore";
import { scheduleNativeNotifications, addNativeNotificationListener } from "./nativeNotifications";
import { useAlarmChecker } from "./hooks/useAlarmChecker";
import { C } from "./constants";
import { BottomNav } from "./components/BottomNav";
import { SplashScreen } from "./screens/SplashScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MedsScreen } from "./screens/MedsScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { AddEditScreen } from "./screens/AddEditScreen";
import { SettingsScreen } from "./screens/SettingsScreen";

export default function App() {
  const [user, setUser]               = useState(() => loadUser());
  const [meds, setMeds]               = useState(() => loadMeds());
  const [logs, setLogs]               = useState(() => loadLogs());
  const [screen, setScreen]           = useState("home");
  const [selectedMed, setSelectedMed] = useState(null);
  const [editMed, setEditMed]         = useState(null);

  // Persist meds + reschedule native notifications whenever meds change
  useEffect(() => {
    saveMeds(meds);
    saveSchedule(meds);
    scheduleNativeNotifications(meds); // no-op on web
  }, [meds]);

  useEffect(() => { if (user) saveUser(user); }, [user]);

  // Web-based 30-second alarm polling (active while app is open in browser / foreground)
  useAlarmChecker(meds);

  const markTakenById = useCallback(medId => {
    const med = meds.find(m => m.id === medId);
    if (!med) return;
    setLogs(prev => {
      const next = { ...prev };
      const key = todayKey();
      if (!next[key]) next[key] = {};
      const now = new Date();
      const nowMins = now.getHours() * 60 + now.getMinutes();
      const closest = med.times?.reduce((best, t) => {
        const [h, m] = t.split(":").map(Number);
        const diff = Math.abs((h * 60 + m) - nowMins);
        return diff < best.diff ? { t, diff } : best;
      }, { t: med.times?.[0], diff: Infinity });
      if (closest?.t) next[key][`${med.id}_${closest.t}`] = true;
      saveLogs(next);
      return next;
    });
  }, [meds]);

  const markTaken = useCallback(med => {
    markTakenById(med.id);
    setScreen("home");
  }, [markTakenById]);

  // Web: listen for "Mark Taken" posted by the Service Worker notification action
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const handler = event => {
      if (event.data?.type === "MARK_TAKEN") markTakenById(event.data.medId);
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [markTakenById]);

  // Native: listen for local notification action taps (Capacitor)
  useEffect(() => {
    const remove = addNativeNotificationListener(markTakenById);
    return remove;
  }, [markTakenById]);

  // Handle ?taken=<medId> when app was closed at notification time
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const takenId = params.get("taken");
    if (takenId) {
      markTakenById(takenId);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const saveMed = med => {
    setMeds(prev => {
      const idx = prev.findIndex(m => m.id === med.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = med; return n; }
      return [...prev, med];
    });
    setScreen("meds");
    setEditMed(null);
    setSelectedMed(null);
  };

  const deleteMed = id => {
    deletePhoto(id);
    setMeds(prev => prev.filter(m => m.id !== id));
    setScreen("meds");
    setSelectedMed(null);
  };

  const handleNav = tab => {
    if (tab === "add") { setEditMed(null); setScreen("add"); }
    else setScreen(tab);
  };

  if (!user) {
    return <SplashScreen onDone={u => { saveUser(u); setUser(u); }} />;
  }

  const showNav = ["home", "meds", "settings"].includes(screen);

  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      {screen === "home"     && <HomeScreen   user={user} meds={meds} logs={logs} onAddMed={() => handleNav("add")} onSelectMed={m => { setSelectedMed(m); setScreen("detail"); }} />}
      {screen === "meds"     && <MedsScreen   meds={meds} logs={logs} onSelectMed={m => { setSelectedMed(m); setScreen("detail"); }} onAddMed={() => handleNav("add")} />}
      {screen === "add"      && <AddEditScreen med={editMed} onBack={() => setScreen(editMed ? "detail" : "meds")} onSave={saveMed} />}
      {screen === "detail"   && selectedMed && <DetailScreen med={selectedMed} logs={logs} onBack={() => setScreen("meds")} onEdit={m => { setEditMed(m); setScreen("add"); }} onDelete={deleteMed} onMarkTaken={markTaken} />}
      {screen === "settings" && <SettingsScreen user={user} meds={meds} onUpdateUser={u => { setUser(u); saveUser(u); }} onImportDone={() => { setUser(loadUser()); setMeds(loadMeds()); setLogs(loadLogs()); }} />}
      {showNav && <BottomNav active={screen} onChange={handleNav} />}
    </div>
  );
}
