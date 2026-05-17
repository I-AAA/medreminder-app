import { C } from "../constants";

export function Header({ title, onBack, children, compact }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${C.primary} 0%, #3a8a65 100%)`,
      padding: compact ? "52px 20px 20px" : "52px 20px 28px",
      position: "relative",
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          position: "absolute", top: 52, left: 20,
          background: "rgba(255,255,255,0.18)", border: "none", borderRadius: 10,
          color: C.white, padding: "7px 14px", cursor: "pointer", fontSize: 14, fontWeight: 500,
        }}>← Back</button>
      )}
      <div style={{ paddingTop: onBack ? 36 : 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", color: C.white, fontSize: 26, margin: 0 }}>{title}</h1>
        {children}
      </div>
    </div>
  );
}
