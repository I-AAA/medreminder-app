import { useState } from "react";
import { C } from "../constants";
import { Btn } from "../components/Btn";
import { Field } from "../components/Field";
import { isNative, requestNativeNotificationPermission } from "../nativeNotifications";

async function requestNotifPermission() {
  if (isNative()) return requestNativeNotificationPermission();
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  return (await Notification.requestPermission()) === "granted";
}

// step 0 → disclaimer, step 1 → welcome, step 2 → profile form
export function SplashScreen({ onDone }) {
  const [step, setStep]       = useState(0);
  const [name, setName]       = useState("");
  const [age, setAge]         = useState("");
  const [purpose, setPurpose] = useState("");

  const handleStart = async () => {
    if (!name.trim()) { alert("Please enter your name."); return; }
    await requestNotifPermission();
    onDone({ name: name.trim(), age, purpose });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24 }}>

      {/* ── Step 0: Medical Disclaimer ── */}
      {step === 0 && (
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 56, lineHeight: 1, marginBottom: 12 }}>⚕️</div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 26, color: C.primary, marginBottom: 6 }}>Before You Begin</h1>
            <p style={{ color: C.muted, fontSize: 14 }}>Please read and accept to continue</p>
          </div>

          <div style={{ background: C.card, borderRadius: 18, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", marginBottom: 20 }}>
            <div style={{ background: `${C.accent}18`, border: `1.5px solid ${C.accent}55`, borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ fontWeight: 700, color: C.text, fontSize: 14, margin: "0 0 6px" }}>⚠️ Medical Disclaimer</p>
              <p style={{ color: C.muted, fontSize: 13, margin: 0, lineHeight: 1.65 }}>
                MedReminder is a <strong>reminder tool only</strong>. It does not provide medical advice,
                diagnosis, or treatment.
              </p>
            </div>

            <ul style={{ paddingLeft: 18, margin: "0 0 16px" }}>
              {[
                "Always follow your doctor's or pharmacist's instructions for your medications.",
                "Never change your dosage or stop taking medication without consulting your healthcare provider.",
                "In an emergency, contact your doctor or emergency services immediately — do not rely on this app.",
                "This app is a supplement to, not a replacement for, professional medical care.",
              ].map((point, i) => (
                <li key={i} style={{ fontSize: 13, color: C.text, marginBottom: 10, lineHeight: 1.6 }}>{point}</li>
              ))}
            </ul>

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 14 }}>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 14px", lineHeight: 1.6 }}>
                By tapping "I Understand &amp; Agree", you confirm you have read this disclaimer and
                understand that MedReminder is not a medical device or service.
              </p>
              <Btn full onClick={() => setStep(1)}>I Understand &amp; Agree →</Btn>
            </div>
          </div>

          <p style={{ textAlign: "center", color: C.muted, fontSize: 12, lineHeight: 1.6 }}>
            Your data is stored only on your device.{" "}
            <a href="privacy.html" target="_blank" rel="noopener noreferrer" style={{ color: C.primary }}>Privacy Policy</a>
          </p>
        </div>
      )}

      {/* ── Step 1: Welcome ── */}
      {step === 1 && (
        <div style={{ textAlign: "center", maxWidth: 340 }}>
          <div style={{ fontSize: 80, marginBottom: 16, lineHeight: 1 }}>💊</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, color: C.primary, marginBottom: 10 }}>MedReminder</h1>
          <p style={{ color: C.muted, fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Never miss a dose again.<br />Simple reminders for your health.
          </p>
          <Btn full onClick={() => setStep(2)}>Get Started →</Btn>
        </div>
      )}

      {/* ── Step 2: Profile Form ── */}
      {step === 2 && (
        <div style={{ width: "100%", maxWidth: 400, background: C.card, borderRadius: 20, padding: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, color: C.primary, marginBottom: 6 }}>Tell us about you</h2>
          <p style={{ color: C.muted, fontSize: 14, marginBottom: 22 }}>Helps personalise your reminders.</p>
          <Field label="Your Name" value={name} onChange={setName} placeholder="e.g. Ibrahim Al-Rashid" required />
          <Field label="Age" value={age} onChange={setAge} placeholder="e.g. 45" type="number" />
          <Field label="Purpose of medication" value={purpose} onChange={setPurpose} placeholder="e.g. Managing blood pressure" multiline />
          <Btn full onClick={handleStart} style={{ marginTop: 4 }}>Continue →</Btn>
        </div>
      )}

    </div>
  );
}
