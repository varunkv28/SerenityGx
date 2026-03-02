import { DesignTokens } from "../constants/designTokens";
import { ClassBadge } from "./utils";

const T = DesignTokens;

interface VariantModalProps {
  variant: any;
  onClose: () => void;
}

export default function VariantModal({ variant, onClose }: VariantModalProps) {
  if (!variant) return null;
  
  return (
    <div onClick={onClose} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(9,30,63,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: T.radiusLg, width: 680, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(9,30,63,0.25)", animation: "slideUp 0.25s ease" }}>
        {/* Header */}
        <div style={{ padding: "22px 28px 16px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 700, color: T.navyDeep, display: "flex", alignItems: "center", gap: 10 }}>
              <em style={{ color: T.navy, fontFamily: T.font }}>{variant.gene}</em> {variant.hgvs}
              {variant.to && <ClassBadge type={variant.to} />}
            </div>
            <div style={{ fontSize: 12.5, color: T.text3, marginTop: 4 }}>ClinVar ID: VCV000127824 · GRCh38: chr13:32339791</div>
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: "none", background: T.surface, borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: T.text3, fontSize: 18 }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          {/* Evidence distinction */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 10 }}>Update Classification</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ borderRadius: T.radius, padding: 16, border: "1.5px solid rgba(197,48,48,0.2)", background: T.redLight }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.red }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Lab Reclassification</span>
                </div>
                <p style={{ fontSize: 12, color: T.text2, lineHeight: 1.55 }}>Official classification change issued by a clinical laboratory. Authoritative — requires clinical follow-up.</p>
                <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginTop: 8, background: "rgba(197,48,48,0.12)", color: T.red }}>Action Required</span>
              </div>
              <div style={{ borderRadius: T.radius, padding: 16, border: "1.5px solid rgba(212,146,10,0.2)", background: T.amberMuted }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.amber }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Evidence Updates</span>
                </div>
                <p style={{ fontSize: 12, color: T.text2, lineHeight: 1.55 }}>New publications and functional data. Informational — review recommended but not yet authoritative.</p>
                <span style={{ display: "inline-block", fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 4, marginTop: 8, background: T.amberLight, color: T.amber }}>Informational</span>
              </div>
            </div>
          </div>
          {/* ACMG Criteria */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 10 }}>ACMG Criteria Applied</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["PVS1", "PS3", "PM2", "PP1", "PP3"].map(c => (
                <span key={c} style={{ fontFamily: T.fontMono, fontSize: 11, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: T.redLight, border: "1px solid rgba(197,48,48,0.2)", color: T.red }}>{c}</span>
              ))}
            </div>
          </div>
          {/* Resolution workflow */}
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 10 }}>Case Resolution Workflow</div>
            <div style={{ display: "flex" }}>
              {[{ label: "Opened", active: false, completed: true }, { label: "Under Review", active: true }, { label: "Decision Documented", active: false }, { label: "Resolved / Closed", active: false }].map((step, i, arr) => (
                <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 8px", border: `1.5px solid ${step.active ? T.primary : step.completed ? T.primary : T.border}`, background: step.active ? T.primaryMuted : step.completed ? T.primaryLight : "white", color: step.active || step.completed ? T.primary : T.text3, fontSize: 12, fontWeight: step.active ? 600 : 500, borderRadius: i === 0 ? "8px 0 0 8px" : i === arr.length - 1 ? "0 8px 8px 0" : 0, borderLeft: i > 0 ? "none" : undefined, cursor: "pointer" }}>
                  <span style={{ display: "block", fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>Step {i + 1}</span>
                  {step.label}
                </div>
              ))}
            </div>
          </div>
          {/* Affected patients */}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 10 }}>Affected Cases ({variant.patients} patients)</div>
            {["P-10890", "P-12045"].slice(0, variant.patients).map(pid => (
              <div key={pid} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: T.surface, borderRadius: 8, cursor: "pointer", marginBottom: 8, transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.primaryMuted}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = T.surface}>
                <div>
                  <div style={{ fontFamily: T.fontMono, fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{pid}</div>
                  <div style={{ fontSize: 11.5, color: T.text3 }}>Classification at testing: <strong style={{ color: T.amber }}>VUS</strong></div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
