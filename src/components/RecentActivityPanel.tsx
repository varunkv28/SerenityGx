import { DesignTokens } from "../constants/designTokens";

const T = DesignTokens;

interface RecentActivityPanelProps {
  data: any[];
}

export default function RecentActivityPanel({ data }: RecentActivityPanelProps) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden", animation: "fadeInUp 0.4s ease 0.25s both" }}>
      <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${T.borderLight}` }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.navyDeep }}>Recent Activity</div>
      </div>
      {data.map((a, i) => {
        const iconColors = { reclass: { bg: T.redLight, c: T.red }, evidence: { bg: T.amberLight, c: T.amber }, review: { bg: T.primaryMuted, c: T.primary }, resolved: { bg: T.greenLight, c: T.green } };
        const ic = iconColors[a.type as keyof typeof iconColors] || { bg: T.primaryMuted, c: T.primary };
        return (
          <div key={i} style={{ padding: "12px 22px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: ic.bg, color: ic.c, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13, marginTop: 1 }}>{a.icon}</div>
            <div>
              <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.5 }}>{a.text}</div>
              <div style={{ fontSize: 11, color: T.text3, marginTop: 3 }}>{a.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
