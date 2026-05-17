import { C } from "../constants";

export function Avatar({ name, size = 44 }) {
  const initials = name
    ? name.trim().split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: C.white, fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
    }}>{initials}</div>
  );
}
