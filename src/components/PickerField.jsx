import { C } from "../constants";

const CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%237A7A6E' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;

export function PickerField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width: "100%", padding: "12px 14px", borderRadius: 10,
          border: `1.5px solid ${C.border}`, background: C.card,
          fontSize: 15, color: C.text, WebkitAppearance: "none", appearance: "none",
          backgroundImage: CHEVRON,
          backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        }}
      >
        {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
      </select>
    </div>
  );
}
