import { useState, useRef, useEffect } from "react";
import { C, SCHEDULES, RINGTONES, MED_EMOJIS, DAY_NAMES } from "../constants";
import { genId } from "../utils";
import { getPhoto, setPhoto, deletePhoto } from "../photoStore";
import { Header } from "../components/Header";
import { Field } from "../components/Field";
import { PickerField } from "../components/PickerField";
import { Btn } from "../components/Btn";

function compressPhoto(file, callback) {
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      const MAX = 400;
      let w = img.width, h = img.height;
      if (w > h) { if (w > MAX) { h = h * (MAX / w); w = MAX; } }
      else       { if (h > MAX) { w = w * (MAX / h); h = MAX; } }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      callback(canvas.toDataURL("image/jpeg", 0.7));
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function DaysPicker({ schedule, days, onChange }) {
  if (schedule === "daily") return null;
  const multi = schedule === "custom";
  const toggle = dow => {
    if (multi) onChange(days.includes(dow) ? days.filter(d => d !== dow) : [...days, dow]);
    else       onChange([dow]);
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8 }}>
        {multi ? "Active Days (select all that apply)" : "Day of the Week"}
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {DAY_NAMES.map((name, dow) => {
          const active = days.includes(dow);
          return (
            <button key={dow} onClick={() => toggle(dow)} style={{
              padding: "7px 12px", borderRadius: 10,
              border: `2px solid ${active ? C.primary : C.border}`,
              background: active ? C.primary : C.card,
              color: active ? C.white : C.muted,
              fontWeight: active ? 700 : 400,
              fontSize: 13, cursor: "pointer", transition: "all 0.15s", minWidth: 42,
            }}>{name}</button>
          );
        })}
      </div>
      {days.length === 0 && (
        <p style={{ color: C.danger, fontSize: 11, marginTop: 5 }}>Please select a day.</p>
      )}
    </div>
  );
}

export function AddEditScreen({ med, onBack, onSave }) {
  const [name, setName]         = useState(med?.name     ?? "");
  const [dosage, setDosage]     = useState(med?.dosage   ?? "");
  const [times, setTimes]       = useState(med?.times    ?? ["08:00"]);
  const [schedule, setSchedule] = useState(med?.schedule ?? "daily");
  const [days, setDays]         = useState(med?.days     ?? []);
  const [notes, setNotes]       = useState(med?.notes    ?? "");
  const [emoji, setEmoji]       = useState(med?.emoji    ?? "💊");
  const [color, setColor]       = useState(med?.color    ?? C.primaryLight);
  const [ringtone, setRingtone] = useState(med?.ringtone ?? "default");

  // photo holds the current data URL for preview; null means no photo
  const [photo, setPhoto_]       = useState(null);
  const fileRef = useRef();

  // Load existing photo from IndexedDB when editing
  useEffect(() => {
    if (med?.hasPhoto && med?.id) {
      getPhoto(med.id).then(data => { if (data) setPhoto_(data); });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleScheduleChange = val => {
    setSchedule(val);
    if (val === "daily")  setDays([]);
    if (val === "weekly") setDays(days.length ? [days[0]] : [new Date().getDay()]);
    if (val === "custom") setDays(days.length ? days : [new Date().getDay()]);
  };

  const handleSave = async () => {
    if (!name.trim())   { alert("Medication name is required."); return; }
    if (!dosage.trim()) { alert("Dosage is required."); return; }
    if (times.length === 0) { alert("Add at least one reminder time."); return; }
    if (schedule !== "daily" && days.length === 0) { alert("Please select at least one day."); return; }

    const id = med?.id ?? genId();

    // Persist photo to IndexedDB (separate from the med object)
    if (photo)     await setPhoto(id, photo);
    else           await deletePhoto(id);

    onSave({
      id,
      name: name.trim(), dosage: dosage.trim(),
      times, schedule, days, notes,
      emoji, color, ringtone,
      hasPhoto: !!photo,
    });
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title={med ? "Edit Medication" : "Add Medication"} onBack={onBack} />
      <div style={{ padding: "20px 16px" }}>

        {/* Photo + Emoji */}
        <div style={{ background: C.card, borderRadius: 16, padding: 16, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 10 }}>
            Medication Icon / Photo
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 12 }}>
            <div onClick={() => fileRef.current.click()} style={{
              width: 72, height: 72, borderRadius: 16,
              background: photo ? "transparent" : C.pillBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", border: `2px dashed ${C.border}`,
              overflow: "hidden", flexShrink: 0,
            }}>
              {photo
                ? <img src={photo} alt="" style={{ width: 72, height: 72, objectFit: "cover" }} />
                : <span style={{ fontSize: 32 }}>{emoji}</span>}
            </div>
            <div>
              <Btn small variant="secondary" onClick={() => fileRef.current.click()}>📷 Upload Photo</Btn>
              {photo && <Btn small variant="ghost" onClick={() => setPhoto_(null)} style={{ marginLeft: 8 }}>✕ Remove</Btn>}
              <p style={{ color: C.muted, fontSize: 11, margin: "6px 0 0" }}>Or pick an icon:</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
              onChange={e => { if (e.target.files[0]) compressPhoto(e.target.files[0], setPhoto_); }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MED_EMOJIS.map(e => (
              <button key={e} onClick={() => setEmoji(e)} style={{
                fontSize: 22,
                background: emoji === e ? C.pillBg : "transparent",
                border: `2px solid ${emoji === e ? C.primary : "transparent"}`,
                borderRadius: 8, width: 38, height: 38, cursor: "pointer",
              }}>{e}</button>
            ))}
          </div>
        </div>

        <Field label="Medication Name" value={name} onChange={setName} placeholder="e.g. Metformin" required />
        <Field label="Dosage" value={dosage} onChange={setDosage} placeholder="e.g. 500mg • 1 tablet" required />

        {/* Reminder Times */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Reminder Times <span style={{ color: C.danger }}>*</span></span>
            <button onClick={() => setTimes([...times, "12:00"])} style={{ background: "none", border: "none", color: C.primary, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              + Add Time
            </button>
          </div>
          {times.map((t, i) => (
            <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <input type="time" value={t}
                onChange={e => { const n = [...times]; n[i] = e.target.value; setTimes(n); }}
                style={{ flex: 1, padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 15, background: C.card, color: C.text }}
              />
              {times.length > 1 && (
                <button onClick={() => setTimes(times.filter((_, j) => j !== i))}
                  style={{ background: `${C.danger}18`, border: "none", borderRadius: 8, color: C.danger, width: 36, height: 36, cursor: "pointer", fontSize: 18, fontWeight: 700 }}>×</button>
              )}
            </div>
          ))}
        </div>

        <PickerField label="Schedule" value={schedule} onChange={handleScheduleChange} options={SCHEDULES} />
        <DaysPicker schedule={schedule} days={days} onChange={setDays} />
        <PickerField label="Alarm Sound" value={ringtone} onChange={setRingtone} options={RINGTONES.map(r => ({ value: r.uri, label: r.label }))} />
        <Field label="Notes (optional)" value={notes} onChange={setNotes} placeholder="Special instructions, e.g. take with food" multiline />

        <Btn full onClick={handleSave} style={{ marginTop: 8 }}>💾 Save Medication</Btn>
      </div>
    </div>
  );
}
