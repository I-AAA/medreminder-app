import { C } from "../constants";
import { todayKey } from "../utils";
import { Avatar } from "../components/Avatar";
import { Btn } from "../components/Btn";
import { MedCard } from "../components/MedCard";

export function HomeScreen({ user, meds, logs, onAddMed, onSelectMed }) {
  const now = new Date();
  const h = now.getHours();
  const greeting = h < 5 ? "Good night" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const key = todayKey();
  const todayDoses = meds.reduce((a, m) => a + (m.times?.length ?? 0), 0);
  const takenCount = meds.reduce((a, m) =>
    a + (m.times?.filter(t => logs[key]?.[`${m.id}_${t}`]).length ?? 0), 0
  );
  const pct = todayDoses > 0 ? Math.round((takenCount / todayDoses) * 100) : 100;

  const nowMins = h * 60 + now.getMinutes();
  const upcomingMeds = meds.filter(m =>
    m.times?.some(t => { const [th, tm] = t.split(":").map(Number); return (th * 60 + tm) > nowMins; })
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ background: `linear-gradient(160deg, ${C.primary} 0%, #3a8a65 100%)`, padding: "52px 20px 28px" }}>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 4 }}>{greeting},</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", color: C.white, fontSize: 30, margin: 0 }}>
            {user.name.split(" ")[0]}
          </h1>
          <Avatar name={user.name} size={44} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          {[
            { label: "Medications",  val: meds.length },
            { label: "Today's Doses", val: todayDoses },
            { label: "Adherence",    val: `${pct}%` },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 8px", textAlign: "center" }}>
              <div style={{ color: C.white, fontWeight: 700, fontSize: 22 }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "22px 0 12px" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: C.text, margin: 0 }}>
            {upcomingMeds.length > 0 ? "Coming up today" : "Today's Medications"}
          </h2>
          <Btn small variant="secondary" onClick={onAddMed}>+ Add</Btn>
        </div>

        {meds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 20px", background: C.card, borderRadius: 18, border: `2px dashed ${C.border}` }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>🌿</div>
            <p style={{ color: C.muted, fontSize: 15, lineHeight: 1.7 }}>No medications added yet.<br />Tap "+ Add" to get started.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {meds.map(med => (
              <MedCard key={med.id} med={med} logs={logs} onClick={() => onSelectMed(med)} />
            ))}
          </div>
        )}

        <div style={{ background: `${C.accent}18`, border: `1.5px solid ${C.accent}44`, borderRadius: 14, padding: "14px 16px", marginTop: 20, display: "flex", gap: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontWeight: 600, color: C.text, fontSize: 13, margin: "0 0 3px" }}>Tip</p>
            <p style={{ color: C.muted, fontSize: 12, margin: 0, lineHeight: 1.6 }}>
              Taking medication at the same time daily helps build a lasting habit. Try linking it to an existing routine like a meal or prayer time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
