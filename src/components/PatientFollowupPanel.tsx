import { DesignTokens } from "../constants/designTokens";
import { ClassBadge } from "./utils";

const T = DesignTokens;

interface PatientFollowupPanelProps {
  data: any[];
}

export default function PatientFollowupPanel({ data }: PatientFollowupPanelProps) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden", animation: "fadeInUp 0.4s ease 0.2s both" }}>
      <div style={{ padding: "18px 22px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.borderLight}` }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.navyDeep, display: "flex", alignItems: "center", gap: 8 }}>
          Cases Requiring Follow-up
          <span style={{ background: T.primaryMuted, color: T.primary, fontSize: 11.5, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>9</span>
        </div>
      </div>
      {data.map((p, i) => (
        <div key={i} style={{ padding: "14px 22px", borderBottom: `1px solid ${T.borderLight}`, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.navyLight}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontFamily: T.fontMono, fontWeight: 600, fontSize: 13.5, color: T.navyDeep }}>{p.id}</span>
            <span style={{ fontSize: 11.5, color: T.text3 }}>Test: {p.testDate}</span>
          </div>
          <div style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.text2, marginBottom: 6 }}>
            <em style={{ fontStyle: "italic", color: T.navy, fontFamily: T.font, fontWeight: 500 }}>{p.gene}</em> {p.hgvs}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500, width: 70 }}>At testing</span>
            <ClassBadge type={p.fromClass} size="xs" />
            <span style={{ fontSize: 11, color: T.text3 }}>→</span>
            <span style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>Now</span>
            <ClassBadge type={p.toClass} size="xs" />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{ fontSize: 11, padding: "2px 7px", borderRadius: 4, fontWeight: 500, background: p.status === "needs-action" ? T.redLight : T.amberLight, color: p.status === "needs-action" ? T.red : T.amber }}>
              {p.status === "needs-action" ? "Needs Action" : "Under Review"}
            </span>
            <span style={{ fontSize: 11, color: T.text3 }}>{p.affectedCount} affected patients</span>
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 22px", textAlign: "center", borderTop: `1px solid ${T.borderLight}` }}>
        <a href="#" style={{ fontSize: 12.5, color: T.primary, textDecoration: "none", fontWeight: 500 }}>View all 9 cases →</a>
      </div>
    </div>
  );
}
