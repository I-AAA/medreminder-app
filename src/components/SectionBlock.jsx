import { C } from "../constants";

export function SectionBlock({ label, children, last }) {
  return (
    <div style={{
      marginBottom: last ? 0 : 18,
      paddingBottom: last ? 0 : 18,
      borderBottom: last ? "none" : `1px solid ${C.border}`,
    }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
