import { useState, useRef } from "react";
import { C } from "../constants";
import { Avatar } from "../components/Avatar";
import { Field } from "../components/Field";
import { Btn } from "../components/Btn";
import { exportData, importData } from "../export";

async function requestNotifPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

function showTestNotification() {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "SHOW_NOTIFICATION",
      title: "💊 MedReminder",
      body: "Notifications are active. You'll receive reminders at your set times.",
      medId: "test",
    });
  }
}

export function SettingsScreen({ user, meds, onUpdateUser, onImportDone }) {
  const [name, setName]         = useState(user.name);
  const [age, setAge]           = useState(user.age ?? "");
  const [purpose, setPurpose]   = useState(user.purpose ?? "");
  const [saved, setSaved]       = useState(false);
  const [notifStatus, setNotifStatus] = useState(Notification?.permission ?? "unsupported");
  const [exportStatus, setExportStatus] = useState(null); // null | "exporting" | "done" | "error"
  const [importStatus, setImportStatus] = useState(null);
  const importRef = useRef();

  const handleSave = () => {
    if (!name.trim()) { alert("Name is required."); return; }
    onUpdateUser({ ...user, name: name.trim(), age, purpose });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleEnableNotif = async () => {
    const ok = await requestNotifPermission();
    setNotifStatus(ok ? "granted" : "denied");
    if (ok) showTestNotification();
  };

  const handleExport = async () => {
    setExportStatus("exporting");
    try {
      await exportData();
      setExportStatus("done");
      setTimeout(() => setExportStatus(null), 3000);
    } catch {
      setExportStatus("error");
      setTimeout(() => setExportStatus(null), 3000);
    }
  };

  const handleImportFile = async e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus("importing");
    try {
      await importData(file);
      setImportStatus("done");
      setTimeout(() => {
        setImportStatus(null);
        onImportDone?.();
      }, 1500);
    } catch (err) {
      alert("Import failed: " + err.message);
      setImportStatus(null);
    }
    e.target.value = "";
  };

  const exportLabel = exportStatus === "exporting" ? "⏳ Exporting…"
    : exportStatus === "done"      ? "✅ Saved!"
    : exportStatus === "error"     ? "❌ Error"
    : "📤 Export Backup";

  const importLabel = importStatus === "importing" ? "⏳ Importing…"
    : importStatus === "done"      ? "✅ Done!"
    : "📥 Import Backup";

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, #3a8a65)`, padding: "52px 20px 28px" }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <Avatar name={user.name} size={60} />
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: C.white, fontSize: 24, margin: 0 }}>{user.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", margin: "5px 0 0", fontSize: 14 }}>
              {meds.length} medication{meds.length !== 1 ? "s" : ""} tracked
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>

        {/* Patient Info */}
        <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.text, marginTop: 0, marginBottom: 16 }}>Patient Information</h3>
          <Field label="Name" value={name} onChange={setName} placeholder="Your name" required />
          <Field label="Age" value={age} onChange={setAge} placeholder="Your age" type="number" />
          <Field label="Purpose of medication" value={purpose} onChange={setPurpose} placeholder="e.g. Blood pressure" multiline />
          <Btn full onClick={handleSave}>{saved ? "✅ Saved!" : "Save Changes"}</Btn>
        </div>

        {/* Notifications */}
        <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.text, marginTop: 0, marginBottom: 12 }}>Notifications</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: C.text }}>🔔 Alarm Reminders</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                Status: <strong style={{ color: notifStatus === "granted" ? C.primary : C.danger }}>{notifStatus}</strong>
              </div>
            </div>
            {notifStatus !== "granted" && <Btn small onClick={handleEnableNotif}>Enable</Btn>}
          </div>
          {notifStatus === "granted" && (
            <div style={{ background: C.pillBg, borderRadius: 10, padding: "10px 14px", marginTop: 8 }}>
              <p style={{ color: C.primary, fontSize: 13, margin: 0 }}>✅ Notifications active. You'll receive reminders at your set times.</p>
            </div>
          )}
        </div>

        {/* Data & Backup */}
        <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.text, marginTop: 0, marginBottom: 8 }}>Data & Backup</h3>
          <p style={{ color: C.muted, fontSize: 13, marginBottom: 14, lineHeight: 1.6 }}>
            Export saves all medications, schedules, logs, and photos to a single file on your device. Use it to restore your data after reinstalling or changing phones.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn full variant="secondary" onClick={handleExport} disabled={exportStatus === "exporting"}>{exportLabel}</Btn>
            <Btn full variant="secondary" onClick={() => importRef.current.click()} disabled={importStatus === "importing"}>{importLabel}</Btn>
          </div>
          <input ref={importRef} type="file" accept="application/json,.json" style={{ display: "none" }} onChange={handleImportFile} />
          <p style={{ color: C.muted, fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
            ⚠️ Importing a backup will overwrite all current data.
          </p>
        </div>

        {/* About */}
        <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: C.text, marginTop: 0, marginBottom: 12 }}>About</h3>
          {[
            { icon: "📱", label: "Version",      val: "2.0.0" },
            { icon: "💾", label: "Storage",       val: "Local (on device)" },
            { icon: "🔒", label: "Privacy",       val: "No data leaves device" },
            { icon: "⚡", label: "Works offline", val: "Yes (PWA)" },
          ].map(item => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 14, color: C.text }}>{item.icon} {item.label}</span>
              <span style={{ fontSize: 13, color: C.muted }}>{item.val}</span>
            </div>
          ))}

          {/* Legal links */}
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
            <a href="privacy.html" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.primary, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
              🔏 Privacy Policy ↗
            </a>
            <button onClick={() => alert(DISCLAIMER_TEXT)} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left", fontSize: 13, color: C.primary, padding: 0, display: "flex", alignItems: "center", gap: 6 }}>
              ⚕️ Medical Disclaimer ↗
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

const DISCLAIMER_TEXT =
  "MedReminder is a reminder tool only.\n\n" +
  "This app does not provide medical advice, diagnosis, or treatment. " +
  "Always follow the guidance of your doctor, pharmacist, or other qualified healthcare provider " +
  "regarding your medications and health.\n\n" +
  "Never disregard professional medical advice or delay seeking it because of information or reminders in this app.";
