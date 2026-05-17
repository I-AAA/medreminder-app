import { C } from "../constants";

export function Pill({ label, bg = C.pillBg, color = C.primary, style = {} }) {
  return (
    <span style={{
      background: bg, color,
      borderRadius: 20, padding: "3px 10px",
      fontSize: 11, fontWeight: 600, display: "inline-block",
      ...style,
    }}>{label}</span>
  );
}
