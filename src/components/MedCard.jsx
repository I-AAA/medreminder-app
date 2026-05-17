import { C, SCHEDULES } from "../constants";
import { fmtTime, nextDose, todayKey } from "../utils";
import { Pill } from "./Pill";
import { PhotoImg } from "./PhotoImg";

export function MedCard({ med, logs, onClick }) {
  const key = todayKey();
  const takenToday = med.times?.some(t => logs[key]?.[`${med.id}_${t}`]);

  return (
    <div
      onClick={onClick}
      style={{
        background: C.card, borderRadius: 16, padding: 16,
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        border: `1.5px solid ${takenToday ? C.primaryLight + "44" : C.border}`,
        cursor: "pointer", position: "relative", overflow: "hidden",
      }}
    >
      {takenToday && (
        <div style={{
          position: "absolute", top: 0, right: 0,
          background: C.primaryLight, color: C.white,
          fontSize: 10, fontWeight: 700, padding: "3px 10px",
          borderRadius: "0 16px 0 10px", letterSpacing: 0.5,
        }}>✓ TAKEN</div>
      )}
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{
          width: 50, height: 50, borderRadius: 14,
          background: `${med.color}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, flexShrink: 0, overflow: "hidden",
        }}>
          {med.hasPhoto
            ? <PhotoImg medId={med.id} hasPhoto={med.hasPhoto} size={50} />
            : med.emoji}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 16, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{med.name}</div>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 2 }}>{med.dosage}</div>
        </div>
        <Pill label={nextDose(med.times)} bg={`${med.color}22`} color={med.color} />
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap" }}>
        {med.times?.map(t => (
          <span key={t} style={{ background: C.pillBg, color: C.primary, borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 500 }}>
            ⏰ {fmtTime(t)}
          </span>
        ))}
        <Pill label={SCHEDULES.find(s => s.value === med.schedule)?.label ?? med.schedule} />
        {med.notes && <Pill label="📝 Note" bg="#FFF3E022" color={C.accent} />}
      </div>
    </div>
  );
}
