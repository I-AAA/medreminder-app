import { C, SCHEDULES } from "../constants";
import { fmtTime, nextDose, todayKey } from "../utils";
import { Pill } from "../components/Pill";
import { Btn } from "../components/Btn";
import { SectionBlock } from "../components/SectionBlock";
import { PhotoImg } from "../components/PhotoImg";

export function DetailScreen({ med, logs, onBack, onEdit, onDelete, onMarkTaken }) {
  const key = todayKey();

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary}, #3a8a65)`, padding: "52px 20px 28px" }}>
        <button onClick={onBack} style={{
          background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10,
          color: C.white, padding: "7px 14px", cursor: "pointer", fontSize: 14, fontWeight: 500, marginBottom: 18,
        }}>← Back</button>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{
            width: 68, height: 68, borderRadius: 18,
            background: "rgba(255,255,255,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 34, overflow: "hidden", flexShrink: 0,
          }}>
            {med.hasPhoto
              ? <PhotoImg medId={med.id} hasPhoto={med.hasPhoto} size={68} />
              : med.emoji}
          </div>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", color: C.white, fontSize: 26, margin: 0 }}>{med.name}</h1>
            <p style={{ color: "rgba(255,255,255,0.75)", margin: "5px 0 0", fontSize: 16 }}>{med.dosage}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <div style={{ background: C.card, borderRadius: 18, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 14 }}>
          <SectionBlock label="Schedule">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Pill label={SCHEDULES.find(s => s.value === med.schedule)?.label ?? med.schedule} />
              {med.times?.map(t => <Pill key={t} label={`⏰ ${fmtTime(t)}`} />)}
            </div>
          </SectionBlock>

          {med.notes && (
            <SectionBlock label="Notes">
              <p style={{ color: C.text, fontSize: 14, margin: 0, lineHeight: 1.7, background: `${C.accent}11`, padding: "10px 14px", borderRadius: 10 }}>
                {med.notes}
              </p>
            </SectionBlock>
          )}

          <SectionBlock label="Next Dose">
            <Pill label={nextDose(med.times)} bg={`${med.color}22`} color={med.color} />
          </SectionBlock>

          <SectionBlock label="Today's Status" last>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {med.times?.map(t => {
                const taken = logs[key]?.[`${med.id}_${t}`];
                return (
                  <div key={t} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: taken ? `${C.primaryLight}22` : C.pillBg,
                    borderRadius: 10, padding: "6px 12px",
                  }}>
                    <span style={{ fontSize: 14 }}>{taken ? "✅" : "⏳"}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: taken ? C.primary : C.muted }}>{fmtTime(t)}</span>
                  </div>
                );
              })}
            </div>
          </SectionBlock>
        </div>

        <Btn full onClick={() => onMarkTaken(med)} style={{ marginBottom: 10 }}>✅ Mark as Taken Now</Btn>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn full variant="secondary" onClick={() => onEdit(med)}>✏️ Edit</Btn>
          <Btn full danger onClick={() => { if (window.confirm(`Delete ${med.name}?`)) onDelete(med.id); }}>🗑️ Delete</Btn>
        </div>
      </div>
    </div>
  );
}
