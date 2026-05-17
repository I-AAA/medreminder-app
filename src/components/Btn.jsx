import { C } from "../constants";

const VARIANTS = {
  primary:   { background: C.primary,   color: C.white },
  secondary: { background: C.pillBg,    color: C.primary },
  ghost:     { background: "transparent", color: C.muted, border: `1.5px solid ${C.border}` },
  danger:    { background: C.danger,    color: C.white },
};

export function Btn({ children, onClick, variant = "primary", small, full, disabled, danger, style = {} }) {
  const base = {
    fontWeight: 600,
    fontSize: small ? 13 : 15,
    border: "none",
    borderRadius: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    padding: small ? "8px 16px" : "14px 20px",
    transition: "opacity 0.15s, transform 0.1s",
    width: full ? "100%" : "auto",
    opacity: disabled ? 0.5 : 1,
    WebkitAppearance: "none",
  };
  const chosen = danger ? VARIANTS.danger : VARIANTS[variant];
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.transform = "scale(0.97)"; }}
      onMouseUp={e => { e.currentTarget.style.transform = ""; }}
      onTouchStart={e => { if (!disabled) e.currentTarget.style.opacity = "0.8"; }}
      onTouchEnd={e => { e.currentTarget.style.opacity = ""; }}
      style={{ ...base, ...chosen, ...style }}
    >{children}</button>
  );
}
