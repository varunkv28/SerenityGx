import { DesignTokens } from "../constants/designTokens";

const T = DesignTokens;

interface TopNavProps {
  activePage: string;
  onNavigate?: (page: string) => void;
}

export default function TopNav({ activePage, onNavigate }: TopNavProps) {
  const handleNavClick = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <nav style={{ background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy} 60%, #0E4A8A 100%)`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(9,30,63,0.25)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${T.primary}, #14CDDF)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: 14 }}>Gx</div>
        <div style={{ fontFamily: T.fontSerif, fontWeight: 700, fontSize: 20, color: "white" }}>Serenity<span style={{ fontWeight: 400, color: T.primary, fontSize: 16 }}>Gx</span></div>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {["Dashboard", "Variant Reclassification", "Patient Variant Review", "Reports"].map(label => (
          <span key={label} onClick={() => handleNavClick(label)} style={{ padding: "8px 16px", color: activePage === label ? "white" : "rgba(255,255,255,0.7)", background: activePage === label ? "rgba(24,167,188,0.2)" : "transparent", fontSize: 13.5, fontWeight: 500, borderRadius: T.radiusSm, cursor: "pointer", transition: "all 0.2s", position: "relative" }}>
            {label}
            {activePage === label && <span style={{ position: "absolute", bottom: -8, left: 16, right: 16, height: 2, background: T.primary, borderRadius: 2 }} />}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", cursor: "pointer", padding: 6, borderRadius: 6 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
          <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: T.amber, borderRadius: "50%", border: `1.5px solid ${T.navyDeep}` }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 500, fontSize: 13, color: "white" }}>Dr. Sarah Chen</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Laboratory Director</div>
          </div>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, #14CDDF)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "white", fontSize: 13 }}>SC</div>
        </div>
      </div>
    </nav>
  );
}
