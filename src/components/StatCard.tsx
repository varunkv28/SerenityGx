import { useState } from "react";
import { DesignTokens } from "../constants/designTokens";

const T = DesignTokens;

interface StatCardProps {
  color: "teal" | "red" | "amber" | "navy";
  label: string;
  tooltip: string;
  value: string;
  detail: string;
  delay: number;
}

export default function StatCard({ color, label, tooltip, value, detail, delay }: StatCardProps) {
  const [showTip, setShowTip] = useState(false);
  const colorMap = { teal: T.primary, red: T.red, amber: T.amber, navy: T.navy };
  
  return (
    <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radius, padding: "20px 22px", position: "relative", overflow: "hidden", cursor: "pointer", transition: "all 0.25s", animation: `fadeInUp 0.4s ease ${delay}s both` }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.primary; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.borderLight; (e.currentTarget as HTMLElement).style.boxShadow = "none"; (e.currentTarget as HTMLElement).style.transform = "none"; }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: colorMap[color] }} />
      <div style={{ fontSize: 12, fontWeight: 500, color: T.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
        {label}
        <span style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
          <span style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${T.text3}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9, cursor: "help" }}>?</span>
          {showTip && <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: T.navyDeep, color: "white", fontSize: 11.5, fontWeight: 400, textTransform: "none", letterSpacing: 0, padding: "8px 12px", borderRadius: 6, whiteSpace: "nowrap", zIndex: 50, lineHeight: 1.4 }}>{tooltip}</span>}
        </span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: T.navyDeep, lineHeight: 1.1, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: T.text3, marginTop: 6 }} dangerouslySetInnerHTML={{ __html: detail }} />
    </div>
  );
}
