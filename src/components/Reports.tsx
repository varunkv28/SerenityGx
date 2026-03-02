import { useState } from "react";

const T = {
  primary: "#18A7BC", primaryLight: "#E8F7F9", primaryMuted: "rgba(24,167,188,0.12)",
  navy: "#0C3C78", navyDeep: "#091E3F", navyLight: "rgba(12,60,120,0.06)",
  amber: "#D4920A", amberLight: "rgba(212,146,10,0.10)", amberMuted: "rgba(212,146,10,0.06)",
  red: "#C53030", redLight: "rgba(197,48,48,0.08)",
  green: "#276749", greenLight: "rgba(39,103,73,0.08)",
  surface: "#FAFBFC", white: "#FFFFFF", border: "#E2E8F0", borderLight: "#EDF2F7",
  text1: "#1A202C", text2: "#4A5568", text3: "#718096",
  radius: 10, radiusSm: 6, radiusLg: 14,
  font: "'DM Sans', sans-serif", fontSerif: "'Source Serif 4', serif", fontMono: "'JetBrains Mono', monospace",
};

// ===== CHART DATA =====
const MONTHLY_RECLASS = [
  { month: "Aug", upgrades: 1, downgrades: 0, evidenceOnly: 3 },
  { month: "Sep", upgrades: 2, downgrades: 1, evidenceOnly: 5 },
  { month: "Oct", upgrades: 1, downgrades: 0, evidenceOnly: 4 },
  { month: "Nov", upgrades: 3, downgrades: 1, evidenceOnly: 7 },
  { month: "Dec", upgrades: 2, downgrades: 2, evidenceOnly: 6 },
  { month: "Jan", upgrades: 4, downgrades: 1, evidenceOnly: 8 },
];

const VARIANTS_BY_GENE = [
  { gene: "BRCA2", count: 312, reclass: 8, pct: 2.6 },
  { gene: "BRCA1", count: 198, reclass: 3, pct: 1.5 },
  { gene: "ATM", count: 142, reclass: 5, pct: 3.5 },
  { gene: "CHEK2", count: 97, reclass: 4, pct: 4.1 },
  { gene: "PALB2", count: 54, reclass: 1, pct: 1.9 },
  { gene: "TP53", count: 28, reclass: 1, pct: 3.6 },
  { gene: "Other", count: 16, reclass: 0, pct: 0 },
];

const CASE_RESOLUTION = [
  { status: "Open", count: 3, color: T.red },
  { status: "In Review", count: 4, color: T.amber },
  { status: "Pending Close", count: 2, color: T.primary },
  { status: "Resolved", count: 38, color: T.green },
];

const EVIDENCE_TYPES = [
  { type: "Lab Reclassification", count: 12, color: T.red },
  { type: "New ClinVar Submission", count: 18, color: T.navy },
  { type: "Functional Study", count: 9, color: T.primary },
  { type: "Segregation Data", count: 6, color: T.amber },
  { type: "Population Data", count: 4, color: T.green },
];

const RECENT_AUDIT = [
  { action: "Variant Reclassification Acknowledged", user: "S. Chen", role: "Laboratory Director", target: "BRCA2 c.7008-2A>T", date: "Jan 27, 2026 14:45" },
  { action: "Case Note Added", user: "J. Park", role: "Genetic Counselor", target: "ATM c.7271T>G", date: "Jan 23, 2026 09:12" },
  { action: "Patient Record Accessed", user: "M. Torres", role: "Genetic Counselor", target: "P-09472", date: "Jan 22, 2026 16:05" },
  { action: "Classification Submitted", user: "S. Chen", role: "Laboratory Director", target: "CHEK2 c.444+1G>A", date: "Jan 20, 2026 15:22" },
  { action: "Notification Draft Generated", user: "J. Park", role: "Genetic Counselor", target: "P-10890", date: "Jan 20, 2026 11:30" },
  { action: "Case Resolved", user: "S. Chen", role: "Laboratory Director", target: "CHEK2 c.444+1G>A / P-13201", date: "Jan 20, 2026 15:25" },
  { action: "Alert Generated", user: "System", role: "Automated", target: "BRCA2 c.7008-2A>T — GeneDx reclassification", date: "Jan 20, 2026 08:00" },
  { action: "Patient Data Uploaded", user: "S. Chen", role: "Laboratory Director", target: "Batch: 12 patients via CSV", date: "Jan 15, 2026 09:45" },
];

const USER_ACTIVITY = [
  { user: "S. Chen", role: "Laboratory Director", actions: 34, lastActive: "2 hours ago" },
  { user: "J. Park", role: "Genetic Counselor", actions: 28, lastActive: "Yesterday" },
  { user: "M. Torres", role: "Genetic Counselor", actions: 19, lastActive: "Jan 26" },
  { user: "R. Davis", role: "Lab Technician", actions: 8, lastActive: "Jan 24" },
];

// ===== MINI BAR CHART =====
function BarChart({ data, maxVal }: { data: any[]; maxVal?: number }) {
  const max = maxVal || Math.max(...data.map((d: any) => d.upgrades + d.downgrades + d.evidenceOnly));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 140, padding: "0 4px" }}>
      {data.map((d: any, i: number) => {
        const upH = (d.upgrades / max) * 120;
        const downH = (d.downgrades / max) * 120;
        const evH = (d.evidenceOnly / max) * 120;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: "100%", maxWidth: 36, display: "flex", flexDirection: "column-reverse", borderRadius: "4px 4px 0 0", overflow: "hidden" }}>
              <div style={{ height: upH, background: T.red, transition: "height 0.5s ease" }} title={`Upgrades: ${d.upgrades}`} />
              <div style={{ height: downH, background: T.amber, transition: "height 0.5s ease" }} title={`Downgrades: ${d.downgrades}`} />
              <div style={{ height: evH, background: T.primaryMuted, transition: "height 0.5s ease" }} title={`Evidence: ${d.evidenceOnly}`} />
            </div>
            <span style={{ fontSize: 10, color: T.text3, fontWeight: 500 }}>{d.month}</span>
          </div>
        );
      })}
    </div>
  );
}

// Horizontal bar
function HBar({ value, max, color }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ flex: 1, height: 8, background: T.borderLight, borderRadius: 4, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color || T.primary, borderRadius: 4, transition: "width 0.6s ease" }} />
    </div>
  );
}

// Donut-like ring using CSS
function DonutRing({ segments, size = 120 }: { segments: any[]; size?: number }) {
  const total = segments.reduce((a, s) => a + s.count, 0);
  let cumPct = 0;
  const gradientParts = segments.map((s: any) => {
    const start = cumPct;
    const pct = (s.count / total) * 100;
    cumPct += pct;
    return `${s.color} ${start}% ${cumPct}%`;
  });
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `conic-gradient(${gradientParts.join(", ")})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <div style={{ width: size - 30, height: size - 30, borderRadius: "50%", background: T.white, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.navyDeep, lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: 9.5, color: T.text3, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Total</div>
      </div>
    </div>
  );
}

// Stat card
function StatCard({ label, tooltip, value, detail, color, delay }: { label: string; tooltip?: string; value: string; detail?: string; color: string; delay: number }) {
  const [showTip, setShowTip] = useState(false);
  const colors: any = { teal: T.primary, red: T.red, amber: T.amber, navy: T.navy, green: T.green };
  return (
    <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radius, padding: "18px 20px", position: "relative", overflow: "hidden", animation: `fadeInUp 0.4s ease ${delay}s both` }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: colors[color] }} />
      <div style={{ fontSize: 11, fontWeight: 500, color: T.text3, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 6, display: "flex", alignItems: "center", gap: 5 }}>
        {label}
        {tooltip && (
          <span style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShowTip(true)} onMouseLeave={() => setShowTip(false)}>
            <span style={{ width: 13, height: 13, borderRadius: "50%", border: `1.5px solid ${T.text3}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, cursor: "help" }}>?</span>
            {showTip && <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: T.navyDeep, color: "white", fontSize: 11, fontWeight: 400, textTransform: "none", letterSpacing: 0, padding: "7px 11px", borderRadius: 6, whiteSpace: "nowrap", zIndex: 50, lineHeight: 1.4 }}>{tooltip}</span>}
          </span>
        )}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: T.navyDeep, lineHeight: 1.1, letterSpacing: -0.5 }}>{value}</div>
      {detail && <div style={{ fontSize: 11.5, color: T.text3, marginTop: 4 }} dangerouslySetInnerHTML={{ __html: detail }} />}
    </div>
  );
}

export default function Reports({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [activeSection, setActiveSection] = useState("overview");
  const [timeRange, setTimeRange] = useState("6mo");

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "reclassifications", label: "Reclassifications" },
    { id: "evidence", label: "Evidence Trends" },
    { id: "audit", label: "Audit Trail" },
  ];

  const maxGeneCount = Math.max(...VARIANTS_BY_GENE.map((g: any) => g.count));

  const handleNavClick = (label: string) => {
    if (onNavigate) onNavigate(label);
  };

  return (
    <div style={{ fontFamily: T.font, background: T.surface, minHeight: "100vh", color: T.text1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy} 60%, #0E4A8A 100%)`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(9,30,63,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${T.primary}, #14CDDF)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: 14 }}>Gx</div>
          <div style={{ fontFamily: T.fontSerif, fontWeight: 700, fontSize: 20, color: "white" }}>Serenity<span style={{ fontWeight: 400, color: T.primary, fontSize: 16 }}>Gx</span></div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Dashboard", "Variant Reclassification", "Patient Variant Review", "Reports"].map(l => (
            <span key={l} onClick={() => handleNavClick(l)} style={{ padding: "8px 16px", color: l === "Reports" ? "white" : "rgba(255,255,255,0.7)", background: l === "Reports" ? "rgba(24,167,188,0.2)" : "transparent", fontSize: 13.5, fontWeight: 500, borderRadius: T.radiusSm, cursor: "pointer" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", padding: 6 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span style={{ position: "absolute", top: 4, right: 4, width: 7, height: 7, background: T.amber, borderRadius: "50%", border: `1.5px solid ${T.navyDeep}` }} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ textAlign: "right" }}><div style={{ fontWeight: 500, fontSize: 13, color: "white" }}>Dr. Sarah Chen</div><div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Laboratory Director</div></div>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg,${T.primary},#14CDDF)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, color: "white", fontSize: 13 }}>SC</div>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1360, margin: "0 auto", padding: "28px 32px 48px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.text3, marginBottom: 16 }}>
          <a href="#" style={{ color: T.primary, textDecoration: "none", fontWeight: 500 }}>Dashboard</a><span>›</span><span>Reports</span>
        </div>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.fontSerif, fontSize: 26, fontWeight: 700, color: T.navyDeep }}>Reports & Analytics</div>
            <div style={{ color: T.text3, fontSize: 14, marginTop: 4 }}>System-wide statistics for laboratory management and operational oversight</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: T.text3, fontWeight: 500 }}>Period:</span>
            {["3mo", "6mo", "1yr", "All"].map(r => (
              <button key={r} onClick={() => setTimeRange(r)} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 20, border: `1px solid ${timeRange === r ? T.primary : T.border}`, background: timeRange === r ? T.primaryMuted : "white", color: timeRange === r ? T.primary : T.text2, cursor: "pointer", fontFamily: T.font, fontWeight: 500 }}>{r}</button>
            ))}
            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font, marginLeft: 8 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export PDF
            </button>
          </div>
        </div>

        {/* Section Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${T.borderLight}`, paddingBottom: 0 }}>
          {sections.map((s: any) => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{ padding: "10px 20px", fontSize: 13.5, fontWeight: activeSection === s.id ? 600 : 500, color: activeSection === s.id ? T.primary : T.text3, cursor: "pointer", border: "none", background: "none", fontFamily: T.font, borderBottom: `2px solid ${activeSection === s.id ? T.primary : "transparent"}`, transition: "all 0.2s", marginBottom: -1 }}>{s.label}</button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeSection === "overview" && (
          <div style={{ animation: "fadeInUp 0.3s ease both" }}>
            {/* Top Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14, marginBottom: 24 }}>
              <StatCard color="teal" label="Variants Monitored" tooltip="Unique variants with active surveillance enabled" value="847" detail='Across <strong>6</strong> genes' delay={0.05} />
              <StatCard color="navy" label="Total Patients" tooltip="Unique patients in the system" value="312" detail='<strong>48</strong> added this month' delay={0.1} />
              <StatCard color="red" label="Reclassifications (6mo)" tooltip="Lab-issued classification changes in the last 6 months" value="22" detail='<strong>13</strong> upgrades · <strong>5</strong> downgrades' delay={0.15} />
              <StatCard color="amber" label="Evidence Updates (6mo)" tooltip="New publications, ClinVar submissions, and functional studies surfaced" value="33" detail='<strong>8</strong> pending review' delay={0.2} />
              <StatCard color="green" label="Cases Resolved (6mo)" tooltip="Cases that completed the full review-to-resolution workflow" value="38" detail='Avg resolution: <strong>4.2 days</strong>' delay={0.25} />
            </div>

            {/* Charts Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
              {/* Reclassification Trends */}
              <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep }}>Reclassification & Evidence Activity</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 11, color: T.text3 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.red }} /> Upgrades to LP/P</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.amber }} /> Downgrades</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.primaryMuted, border: `1px solid ${T.primary}` }} /> Evidence Only</span>
                  </div>
                </div>
                <BarChart data={MONTHLY_RECLASS} maxVal={16} />
              </div>

              {/* Variants by Gene */}
              <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>Variants Tracked by Gene</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {VARIANTS_BY_GENE.map((g: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: 13, color: T.navy, width: 52, flexShrink: 0 }}>{g.gene}</span>
                      <HBar value={g.count} max={maxGeneCount} color={T.primary} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.navyDeep, width: 36, textAlign: "right" }}>{g.count}</span>
                      <span style={{ fontSize: 11, color: T.text3, width: 80 }}>{g.reclass} reclass ({g.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
              {/* Case Resolution */}
              <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>Case Resolution Status</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <DonutRing segments={CASE_RESOLUTION} size={110} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {CASE_RESOLUTION.map((s: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, color: T.text2, flex: 1 }}>{s.status}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evidence by Type */}
              <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>Evidence Updates by Type</div>
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  <DonutRing segments={EVIDENCE_TYPES} size={110} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    {EVIDENCE_TYPES.map((e: any, i: number) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: T.text2, flex: 1 }}>{e.type}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{e.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Activity */}
              <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>User Activity</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {USER_ACTIVITY.map((u: any, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: `linear-gradient(135deg, ${T.primary}, ${T.navy})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                        {u.user.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{u.user}</div>
                        <div style={{ fontSize: 11, color: T.text3 }}>{u.role}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{u.actions}</div>
                        <div style={{ fontSize: 10.5, color: T.text3 }}>{u.lastActive}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RECLASSIFICATIONS */}
        {activeSection === "reclassifications" && (
          <div style={{ animation: "fadeInUp 0.3s ease both" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              <StatCard color="red" label="Total Reclassifications" value="22" detail="Last 6 months" delay={0.05} />
              <StatCard color="red" label="Upgraded to LP/P" tooltip="Variants moved into Likely Pathogenic or Pathogenic" value="13" detail="Most impactful category" delay={0.1} />
              <StatCard color="amber" label="Downgraded from LP/P" tooltip="Variants moved out of LP/P to VUS or Benign" value="5" detail="May affect management plans" delay={0.15} />
              <StatCard color="green" label="VUS → LB/B" tooltip="VUS variants resolved to Likely Benign or Benign" value="4" detail="Reduces uncertainty" delay={0.2} />
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.navyDeep }}>Reclassification History</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr", padding: "10px 24px", fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, background: T.surface, borderBottom: `1px solid ${T.borderLight}` }}>
                <span>Variant</span><span>Transition</span><span>Source</span><span>Date</span><span>Patients Affected</span>
              </div>
              {[
                { gene: "BRCA2", hgvs: "c.7008-2A>T", from: "VUS", to: "LP", source: "GeneDx", date: "Jan 27, 2026", patients: 2 },
                { gene: "ATM", hgvs: "c.7271T>G", from: "VUS", to: "LP", source: "Ambry Genetics", date: "Jan 22, 2026", patients: 1 },
                { gene: "ATM", hgvs: "c.5932G>T", from: "LP", to: "VUS", source: "Invitae", date: "Jan 15, 2026", patients: 3 },
                { gene: "BRCA2", hgvs: "c.9302T>G", from: "LP", to: "P", source: "GeneDx", date: "Dec 10, 2025", patients: 1 },
                { gene: "CHEK2", hgvs: "c.444+1G>A", from: "VUS", to: "LP", source: "Invitae", date: "Nov 28, 2025", patients: 2 },
              ].map((r: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1.2fr 1fr 1fr", padding: "14px 24px", alignItems: "center", borderBottom: `1px solid ${T.borderLight}`, cursor: "pointer", transition: "background 0.12s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.navyLight}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div>
                    <span style={{ fontStyle: "italic", fontWeight: 600, color: T.navy, fontSize: 13 }}>{r.gene}</span>
                    <span style={{ fontFamily: T.fontMono, fontSize: 12, color: T.text2, marginLeft: 6 }}>{r.hgvs}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10.5, fontWeight: 600, background: r.from === "VUS" ? T.amberLight : T.redLight, color: r.from === "VUS" ? T.amber : T.red }}>{r.from}</span>
                    <span style={{ color: T.text3, fontSize: 12 }}>→</span>
                    <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10.5, fontWeight: 600, background: ["LP", "P"].includes(r.to) ? T.redLight : r.to === "VUS" ? T.amberLight : T.greenLight, color: ["LP", "P"].includes(r.to) ? T.red : r.to === "VUS" ? T.amber : T.green }}>{r.to}</span>
                  </div>
                  <span style={{ fontSize: 12.5, color: T.text2 }}>{r.source}</span>
                  <span style={{ fontSize: 12.5, color: T.text2 }}>{r.date}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{r.patients}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVIDENCE TRENDS */}
        {activeSection === "evidence" && (
          <div style={{ animation: "fadeInUp 0.3s ease both" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
              <StatCard color="teal" label="Total Evidence Updates" value="49" detail="Last 6 months" delay={0.05} />
              <StatCard color="navy" label="ClinVar Submissions" value="18" delay={0.1} />
              <StatCard color="red" label="Lab Reclassifications" value="12" delay={0.15} />
              <StatCard color="amber" label="Functional Studies" value="9" delay={0.2} />
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>Monthly Evidence Accrual</div>
              <BarChart data={MONTHLY_RECLASS} maxVal={16} />
              <div style={{ display: "flex", gap: 16, marginTop: 12, justifyContent: "center", fontSize: 11, color: T.text3 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.red }} /> LP/P Upgrades</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.amber }} /> Downgrades</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: T.primaryMuted, border: `1px solid ${T.primary}` }} /> Evidence Only</span>
              </div>
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, padding: "20px 24px" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 16 }}>Evidence Breakdown by Type</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {EVIDENCE_TYPES.map((e: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: T.text2, width: 160 }}>{e.type}</span>
                    <HBar value={e.count} max={20} color={e.color} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep, width: 30, textAlign: "right" }}>{e.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT TRAIL */}
        {activeSection === "audit" && (
          <div style={{ animation: "fadeInUp 0.3s ease both" }}>
            <div style={{ padding: "14px 20px", background: T.amberMuted, border: `1px solid rgba(212,146,10,0.15)`, borderRadius: T.radius, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ️</span>
              <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.55 }}>
                <strong>Audit Trail</strong> captures all system events including user authentication, data access, alert generation & acknowledgment, variant review actions, evidence acknowledgment, reclassification decisions, and patient-related access. All entries include author, timestamp, and role.
              </div>
            </div>
            <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden" }}>
              <div style={{ padding: "18px 24px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: T.navyDeep }}>Recent System Events</div>
                <div style={{ display: "flex", gap: 6 }}>
                  {["All", "Reviews", "Classifications", "Access", "Alerts"].map(f => (
                    <button key={f} style={{ fontSize: 11.5, padding: "4px 10px", borderRadius: 16, border: `1px solid ${f === "All" ? T.primary : T.border}`, background: f === "All" ? T.primaryMuted : "white", color: f === "All" ? T.primary : T.text3, cursor: "pointer", fontFamily: T.font, fontWeight: 500 }}>{f}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 2fr 1.5fr", padding: "10px 24px", fontSize: 11, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, background: T.surface, borderBottom: `1px solid ${T.borderLight}` }}>
                <span>Action</span><span>User</span><span>Role</span><span>Target</span><span>Timestamp</span>
              </div>
              {RECENT_AUDIT.map((a: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr 1fr 2fr 1.5fr", padding: "12px 24px", alignItems: "center", borderBottom: `1px solid ${T.borderLight}`, fontSize: 12.5 }}>
                  <span style={{ color: T.text1, fontWeight: 500 }}>{a.action}</span>
                  <span style={{ color: T.text2, fontWeight: 600 }}>{a.user}</span>
                  <span style={{ color: T.text3 }}>{a.role}</span>
                  <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.navy }}>{a.target}</span>
                  <span style={{ color: T.text3, fontSize: 11.5 }}>{a.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
