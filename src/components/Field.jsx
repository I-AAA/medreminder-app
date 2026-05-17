import { C } from "../constants";

const sharedStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  border: `1.5px solid ${C.border}`, background: C.card,
  fontSize: 15, color: C.text, outline: "none",
  marginTop: 5, resize: "vertical", WebkitAppearance: "none",
  transition: "border-color 0.15s",
};

export function Field({ label, value, onChange, placeholder, type = "text", multiline, required }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", display: "flex", gap: 4 }}>
          {label} {required && <span style={{ color: C.danger }}>*</span>}
        </div>
      )}
      {multiline
        ? <textarea rows={3} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={sharedStyle} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={sharedStyle} />
      }
    </div>
  );
}
