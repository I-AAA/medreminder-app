import { C } from "../constants";

const TABS = [
  { id: "home",     icon: "🏠", label: "Home" },
  { id: "meds",     icon: "💊", label: "Meds" },
  { id: "add",      icon: "➕", label: "Add" },
  { id: "settings", icon: "⚙️",  label: "Settings" },
];

export function BottomNav({ active, onChange }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.card, borderTop: `1px solid ${C.border}`,
      display: "flex", zIndex: 200,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 3,
            background: "none", border: "none", cursor: "pointer",
            padding: "10px 0 8px",
          }}
        >
          <span style={{
            fontSize: tab.id === "add" ? 26 : 22,
            filter: active === tab.id ? "none" : "grayscale(1) opacity(0.45)",
            transition: "filter 0.15s",
          }}>{tab.icon}</span>
          <span style={{
            fontSize: 10,
            fontWeight: active === tab.id ? 700 : 400,
            color: active === tab.id ? C.primary : C.muted,
            transition: "color 0.15s",
          }}>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
