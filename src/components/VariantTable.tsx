import { DesignTokens } from "../constants/designTokens";
import { ClassBadge, StatusDot } from "./utils";

const T = DesignTokens;

interface VariantTableProps {
  data: any[];
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onSelectVariant: (variant: any) => void;
}

export default function VariantTable({ data, filters, activeFilter, onFilterChange, onSelectVariant }: VariantTableProps) {
  return (
    <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden", animation: "fadeInUp 0.4s ease 0.15s both" }}>
      <div style={{ padding: "18px 22px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${T.borderLight}` }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.navyDeep, display: "flex", alignItems: "center", gap: 8 }}>
          Patients with New Variant Data
          <span style={{ background: T.primaryMuted, color: T.primary, fontSize: 11.5, fontWeight: 600, padding: "2px 8px", borderRadius: 10 }}>23</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {filters.map(f => (
            <button key={f} onClick={() => onFilterChange(f)} style={{ padding: "5px 10px", fontSize: 12, color: activeFilter === f ? T.primary : T.text3, background: activeFilter === f ? T.primaryMuted : "none", border: `1px solid ${activeFilter === f ? T.primary : T.border}`, borderRadius: T.radiusSm, cursor: "pointer", fontFamily: T.font, fontWeight: 500, transition: "all 0.2s" }}>{f}</button>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "10px 22px", background: T.surface, borderBottom: `1px solid ${T.borderLight}`, fontSize: 11, color: T.text3 }}>
        <span style={{ fontWeight: 600 }}>Type of New Data:</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: T.red }} /> Lab Reclassification</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber }} /> Evidence Update</span>
      </div>
      {/* Table header */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 120px", padding: "10px 22px", fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, background: T.surface, borderBottom: `1px solid ${T.borderLight}` }}>
        <span>Variant</span><span>Classification Change</span><span>Type of New Data</span><span>Status</span><span>Reviewed</span>
      </div>
      {/* Rows */}
      {data.map((v, i) => (
        <div key={i} onClick={() => onSelectVariant(v)} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 1fr 120px", padding: "14px 22px", alignItems: "center", borderBottom: `1px solid ${T.borderLight}`, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.navyLight}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
          {/* Variant */}
          <div>
            <div style={{ fontStyle: "italic", fontWeight: 600, fontSize: 13.5, color: T.navy }}>{v.gene}</div>
            <div style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.text2 }}>{v.hgvs}</div>
            {v.protein && <div style={{ fontFamily: T.fontMono, fontSize: 10.5, color: T.text3 }}>{v.protein}</div>}
          </div>
          {/* Classification Change */}
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <ClassBadge type={v.from} />
            {v.to ? <><span style={{ color: T.text3, fontSize: 13 }}>→</span><ClassBadge type={v.to} /></> : <span style={{ color: T.text3, fontSize: 11, marginLeft: 4 }}>No change</span>}
          </div>
          {/* Type */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 500, color: v.updateType === "lab" ? T.red : T.amber }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: v.updateType === "lab" ? T.red : T.amber }} />
              {v.updateLabel}
            </div>
            {v.isNew && <span style={{ display: "inline-flex", fontSize: 9.5, fontWeight: 700, color: T.primary, background: T.primaryMuted, padding: "1px 6px", borderRadius: 3, letterSpacing: 0.4, textTransform: "uppercase", marginTop: 3 }}>New</span>}
          </div>
          {/* Status */}
          <StatusDot status={v.status} />
          {/* Reviewed */}
          <div style={{ fontSize: 11, color: T.text3 }}>
            {v.reviewer ? <><strong style={{ color: T.text2, fontWeight: 500 }}>{v.reviewer}</strong> · {v.reviewDate}</> : "—"}
          </div>
        </div>
      ))}
      <div style={{ padding: "12px 22px", textAlign: "center", borderTop: `1px solid ${T.borderLight}` }}>
        <a href="#" style={{ fontSize: 12.5, color: T.primary, textDecoration: "none", fontWeight: 500 }}>View all 23 variant updates →</a>
      </div>
    </div>
  );
}
