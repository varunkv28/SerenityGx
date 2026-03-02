import { DesignTokens } from "../constants/designTokens";

const T = DesignTokens;

export interface ClassBadgeProps {
  type: "VUS" | "LP" | "P" | "LB" | "B";
  size?: "sm" | "xs";
}

export function ClassBadge({ type, size = "sm" }: ClassBadgeProps) {
  const styles = {
    VUS: { bg: T.amberLight, color: T.amber },
    LP: { bg: T.redLight, color: T.red },
    P: { bg: "rgba(197,48,48,0.15)", color: "#9B2C2C" },
    LB: { bg: T.greenLight, color: T.green },
    B: { bg: "rgba(39,103,73,0.15)", color: "#1C4532" },
  };
  const s = styles[type] || styles.VUS;
  const fs = size === "xs" ? 10 : 11;
  return (
    <span style={{ padding: "2px 7px", borderRadius: 4, fontSize: fs, fontWeight: 600, letterSpacing: 0.2, background: s.bg, color: s.color, whiteSpace: "nowrap" }}>
      {type}
    </span>
  );
}

export interface StatusDotProps {
  status: "open" | "in-review" | "resolved";
}

export function StatusDot({ status }: StatusDotProps) {
  const color = status === "open" ? T.red : status === "in-review" ? T.amber : T.green;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 500, color }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, animation: status === "in-review" ? "pulse 2s infinite" : "none" }} />
      {status === "open" ? "Open" : status === "in-review" ? "In Review" : "Resolved"}
    </span>
  );
}

export function Gene({ children }: { children: React.ReactNode }) {
  return <em style={{ fontStyle: "italic", color: T.navy, fontFamily: T.font, fontWeight: 500 }}>{children}</em>;
}

export function Mono({ children }: { children: React.ReactNode }) {
  return <code style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.navy, background: T.navyLight, padding: "1px 5px", borderRadius: 3 }}>{children}</code>;
}
