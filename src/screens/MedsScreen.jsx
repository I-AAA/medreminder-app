import { C } from "../constants";
import { Header } from "../components/Header";
import { Btn } from "../components/Btn";
import { MedCard } from "../components/MedCard";

export function MedsScreen({ meds, logs, onSelectMed, onAddMed }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <Header title="My Medications">
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 6 }}>
          {meds.length} medication{meds.length !== 1 ? "s" : ""} tracked
        </p>
      </Header>
      <div style={{ padding: "20px 16px" }}>
        {meds.length === 0 ? (
          <div style={{ textAlign: "center", padding: "44px 20px", background: C.card, borderRadius: 18, border: `2px dashed ${C.border}` }}>
            <div style={{ fontSize: 52, marginBottom: 14 }}>💊</div>
            <p style={{ color: C.muted, fontSize: 15 }}>No medications yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {meds.map(med => (
              <MedCard key={med.id} med={med} logs={logs} onClick={() => onSelectMed(med)} />
            ))}
          </div>
        )}
        <Btn full onClick={onAddMed} style={{ marginTop: 16 }}>+ Add New Medication</Btn>
      </div>
    </div>
  );
}
