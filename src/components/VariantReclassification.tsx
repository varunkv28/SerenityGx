import { useState, useMemo } from "react";
import { DesignTokens } from "../constants/designTokens";
import { VARIANT_DATA_RECLASS, TIMELINE_DATA, PATIENTS_FOR_VARIANT } from "../constants/reclassData";
import { ClassBadge, StatusDot } from "./utils";
import TopNav from "./TopNav";

const T = DesignTokens;

const ACMG_PATH = ["PVS1","PS1","PS2","PS3","PS4","PM1","PM2","PM3","PM4","PM5","PM6","PP1","PP2","PP3","PP4","PP5"];
const ACMG_BEN = ["BA1","BS1","BS2","BS3","BS4","BP1","BP2","BP3","BP4","BP5","BP6","BP7"];

function computeACMG(selectedPath: string[], selectedBen: string[]) {
  const hasBA = selectedBen.includes("BA1");
  const bsCount = selectedBen.filter(c => c.startsWith("BS")).length;
  const bpCount = selectedBen.filter(c => c.startsWith("BP")).length;
  const pvs = selectedPath.filter(c => c.startsWith("PVS")).length;
  const ps = selectedPath.filter(c => c.startsWith("PS")).length;
  const pm = selectedPath.filter(c => c.startsWith("PM")).length;
  const pp = selectedPath.filter(c => c.startsWith("PP")).length;

  if (hasBA) return { label: "Benign", key: "B" };
  if (bsCount >= 2) return { label: "Likely Benign", key: "LB" };
  if (bsCount >= 1 && bpCount >= 1) return { label: "Likely Benign", key: "LB" };
  if (pvs >= 1 && ps >= 1) return { label: "Pathogenic", key: "P" };
  if (pvs >= 1 && pm >= 1) return { label: "Likely Pathogenic", key: "LP" };
  if (pvs >= 1 && pp >= 2) return { label: "Likely Pathogenic", key: "LP" };
  if (ps >= 2) return { label: "Pathogenic", key: "P" };
  if (ps >= 1 && pm >= 3) return { label: "Pathogenic", key: "P" };
  if (ps >= 1 && pm >= 2 && pp >= 2) return { label: "Pathogenic", key: "P" };
  if (ps >= 1 && pm >= 1) return { label: "Likely Pathogenic", key: "LP" };
  if (ps >= 1 && pp >= 2) return { label: "Likely Pathogenic", key: "LP" };
  if (pm >= 3) return { label: "Likely Pathogenic", key: "LP" };
  if (pm >= 2 && pp >= 2) return { label: "Likely Pathogenic", key: "LP" };
  if (selectedPath.length === 0 && selectedBen.length === 0) return { label: "VUS", key: "VUS" };
  return { label: "VUS", key: "VUS" };
}

interface Variant {
  id: number;
  gene: string;
  hgvs: string;
  protein: string;
  from: string;
  to: string | null;
  type: string;
  label: string;
  date: string;
  status: string;
  watchlist: boolean;
  isNew: boolean;
  reviewer: string | null;
  clinvar: string;
  chr: string;
  subtype: string;
  source: string | null;
  reclassDate: string | null;
}

export default function VariantReclassification({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [selectedId, setSelectedId] = useState(0);
  const [activeTab, setActiveTab] = useState("evidence");
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchVal, setSearchVal] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [watchlists, setWatchlists] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    VARIANT_DATA_RECLASS.forEach(v => {
      initial[v.id] = v.watchlist;
    });
    return initial;
  });
  const [selPath, setSelPath] = useState(["PVS1", "PS3", "PM2", "PP1", "PP3"]);
  const [selBen, setSelBen] = useState<string[]>([]);
  const [caseNotes, setCaseNotes] = useState("");

  const selected = VARIANT_DATA_RECLASS.find(v => v.id === selectedId) || VARIANT_DATA_RECLASS[0];
  const classification = useMemo(() => computeACMG(selPath, selBen), [selPath, selBen]);

  const classColor = { P: T.red, LP: T.red, VUS: T.amber, LB: T.green, B: T.green };
  const classBg = { P: T.redLight, LP: T.redLight, VUS: T.amberMuted, LB: T.greenLight, B: T.greenLight };
  const classBorder = { P: "rgba(197,48,48,0.25)", LP: "rgba(197,48,48,0.25)", VUS: "rgba(212,146,10,0.25)", LB: "rgba(39,103,73,0.25)", B: "rgba(39,103,73,0.25)" };

  const filteredVariants = VARIANT_DATA_RECLASS.filter((v: Variant) => {
    if (activeFilter === "↑ LP/P") return v.to === "LP" || v.to === "P";
    if (activeFilter === "↓ from LP/P") return v.from === "LP" && (v.to === "VUS" || v.to === "LB");
    if (activeFilter === "⭐ Watchlist") return watchlists[v.id];
    if (activeFilter === "Open Cases") return v.status === "open";
    return true;
  }).filter((v: Variant) => {
    if (!searchVal) return true;
    const q = searchVal.toLowerCase();
    return v.gene.toLowerCase().includes(q) || v.hgvs.toLowerCase().includes(q) || (v.protein && v.protein.toLowerCase().includes(q));
  });

  const searchResults = searchVal.length > 1 ? VARIANT_DATA_RECLASS.filter((v: Variant) => {
    const q = searchVal.toLowerCase();
    return v.gene.toLowerCase().includes(q) || v.hgvs.toLowerCase().includes(q) || (v.protein && v.protein.toLowerCase().includes(q));
  }).slice(0, 5) : [];

  function togglePath(c: string) { setSelPath(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]); }
  function toggleBen(c: string) { setSelBen(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]); }

  const logicParts: string[] = [];
  const pvsC = selPath.filter(c => c.startsWith("PVS"));
  const psC = selPath.filter(c => c.startsWith("PS"));
  const pmC = selPath.filter(c => c.startsWith("PM"));
  const ppC = selPath.filter(c => c.startsWith("PP"));
  if (pvsC.length) logicParts.push(`${pvsC.length}× Very Strong (${pvsC.join(", ")})`);
  if (psC.length) logicParts.push(`${psC.length}× Strong (${psC.join(", ")})`);
  if (pmC.length) logicParts.push(`${pmC.length}× Moderate (${pmC.join(", ")})`);
  if (ppC.length) logicParts.push(`${ppC.length}× Supporting (${ppC.join(", ")})`);
  if (selBen.length) logicParts.push(`Benign: ${selBen.join(", ")}`);

  const tabs = [
    { id: "evidence", label: "Evidence Timeline", badge: "6" },
    { id: "classify", label: "ACMG Classification" },
    { id: "resolution", label: "Resolution Workflow" },
    { id: "patients", label: "Affected Cases", badge: "2" },
  ];
  const filters = ["All", "↑ LP/P", "↓ from LP/P", "VUS→LB/B", "⭐ Watchlist", "Open Cases"];

  return (
    <div style={{ fontFamily: T.font, background: T.surface, minHeight: "100vh", color: T.text1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; margin:0; padding:0; }
        textarea { font-family: inherit; }
      `}</style>

      <TopNav activePage="Variant Reclassification" onNavigate={onNavigate} />

      <main style={{ maxWidth: 1360, margin: "0 auto", padding: "28px 32px 48px" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.text3, marginBottom: 16 }}>
          <a href="#" onClick={e => { e.preventDefault(); onNavigate("dashboard"); }} style={{ color: T.primary, textDecoration: "none", fontWeight: 500 }}>Dashboard</a>
          <span>›</span><span>Variant Reclassification</span>
        </div>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 26, fontWeight: 700, color: T.navyDeep }}>Variant Reclassification</div>
          <div style={{ color: T.text3, fontSize: 14, marginTop: 4 }}>Search, review evidence, and manage variant classification workflows</div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", background: T.white, border: `1.5px solid ${showSearch ? T.primary : T.border}`, borderRadius: T.radius, padding: "0 18px", boxShadow: showSearch ? `0 0 0 3px ${T.primaryMuted}` : "0 1px 2px rgba(0,0,0,0.04)", transition: "all 0.2s" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={searchVal} onChange={e => setSearchVal(e.target.value)} onFocus={() => setShowSearch(true)} onBlur={() => setTimeout(() => setShowSearch(false), 200)} placeholder="Search by variant (e.g., BRCA2 c.7008-2A>T), gene, or ClinVar ID…" style={{ flex: 1, border: "none", outline: "none", padding: "14px", fontSize: 14.5, fontFamily: T.font, color: T.text1, background: "transparent" }} />
          </div>
          <div style={{ fontSize: 11.5, color: T.text3, marginTop: 6, paddingLeft: 2 }}>
            Search by HGVS nomenclature <code style={{ fontFamily: T.fontMono, fontSize: 11, background: T.navyLight, padding: "1px 5px", borderRadius: 3, color: T.navy }}>c.7008-2A&gt;T</code>, protein change, gene name, or ClinVar accession
          </div>
          {showSearch && searchResults.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "white", border: `1px solid ${T.border}`, borderRadius: T.radius, boxShadow: "0 4px 16px rgba(0,0,0,0.08)", zIndex: 50, marginTop: 4, maxHeight: 340, overflowY: "auto" }}>
              {searchResults.map((v: Variant, i: number) => (
                <div key={i} onClick={() => { setSelectedId(v.id); setSearchVal(""); setShowSearch(false); }} style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderBottom: `1px solid ${T.borderLight}`, transition: "background 0.12s" }} onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = T.navyLight} onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <div><div style={{ fontStyle: "italic", fontWeight: 600, color: T.navy, fontSize: 13.5 }}>{v.gene}</div><div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.text2 }}>{v.hgvs}{v.protein ? ` (${v.protein})` : ""}</div></div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}><ClassBadge type={(v.to || v.from) as "VUS" | "LP" | "P" | "LB" | "B"} /><span style={{ fontSize: 11, color: T.text3 }}>{v.chr}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5 }}>Status:</span>
          {filters.map((f) => (
            <span key={f}>
              {(f === "⭐ Watchlist") && <span style={{ width: 1, height: 20, background: T.border, margin: "0 4px", display: "inline-block", verticalAlign: "middle" }} />}
              <button onClick={() => setActiveFilter(f)} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, border: `1px solid ${activeFilter === f ? T.primary : T.border}`, background: activeFilter === f ? T.primaryMuted : "white", color: activeFilter === f ? T.primary : T.text2, cursor: "pointer", fontFamily: T.font, fontWeight: 500, transition: "all 0.2s" }}>{f}</button>
            </span>
          ))}
          <span style={{ fontSize: 12.5, color: T.text3, marginLeft: "auto" }}>Showing <strong style={{ color: T.text2 }}>{filteredVariants.length}</strong> variants</span>
        </div>

        {/* Two Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20, minHeight: 600 }}>

          {/* LEFT: Variant List */}
          <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surface }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>Variant List</span>
              <select style={{ fontSize: 11.5, padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text2, background: "white", fontFamily: T.font, cursor: "pointer" }}>
                <option>Sort: Genomic position</option><option>Sort: Most recent update</option><option>Sort: Classification</option>
              </select>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredVariants.map((v: Variant) => (
                <div key={v.id} onClick={() => { setSelectedId(v.id); setActiveTab("evidence"); }} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.borderLight}`, cursor: "pointer", transition: "all 0.15s", background: selectedId === v.id ? T.primaryMuted : "transparent", borderLeft: selectedId === v.id ? `3px solid ${T.primary}` : "3px solid transparent" }}
                  onMouseEnter={e => { if (selectedId !== v.id) (e.currentTarget as HTMLElement).style.background = T.navyLight; }}
                  onMouseLeave={e => { if (selectedId !== v.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div>
                      <span style={{ fontStyle: "italic", fontWeight: 600, fontSize: 14, color: T.navy }}>{v.gene}</span>
                      <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.text2 }}>{v.hgvs}</div>
                      {v.protein && <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.text3 }}>{v.protein}</div>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, cursor: "pointer", color: watchlists[v.id] ? T.amber : T.border }} onClick={e => { e.stopPropagation(); setWatchlists(w => ({ ...w, [v.id]: !w[v.id] })); }}>{watchlists[v.id] ? "★" : "☆"}</span>
                      <ClassBadge type={(v.to || v.from) as "VUS" | "LP" | "P" | "LB" | "B"} />
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: v.type === "lab" ? T.red : T.amber }} />
                    <span style={{ fontSize: 11, color: T.text3 }}>{v.label} · {v.date}</span>
                    {v.isNew && <span style={{ fontSize: 9.5, fontWeight: 700, color: T.primary, background: T.primaryMuted, padding: "1px 6px", borderRadius: 3, letterSpacing: 0.4, textTransform: "uppercase" }}>New</span>}
                    <span style={{ marginLeft: "auto" }}><StatusDot status={v.status as "open" | "in-review" | "resolved"} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Detail Panel */}
          <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflowY: "auto" }}>
            {/* Detail Header */}
            <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${T.borderLight}`, position: "sticky", top: 0, background: "white", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: T.fontSerif, fontSize: 22, fontWeight: 700, color: T.navyDeep, display: "flex", alignItems: "center", gap: 10 }}>
                    <em style={{ color: T.navy, fontFamily: T.font }}>{selected.gene}</em> {selected.hgvs}
                  </div>
                  <div style={{ fontSize: 12, color: T.text3, marginTop: 4, fontFamily: T.fontMono }}>
                    ClinVar: <a href="#" style={{ color: T.primary, textDecoration: "none" }}>{selected.clinvar}</a> · GRCh38: {selected.chr} · {selected.subtype}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>ClinVar ↗</button>
                  <button onClick={() => setActiveTab("classify")} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Submit Classification</button>
                </div>
              </div>
              {/* Classification strip */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, padding: "12px 16px", background: T.surface, borderRadius: T.radius }}>
                <div><div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3 }}>Current</div><ClassBadge type={(selected.to || selected.from) as "VUS" | "LP" | "P" | "LB" | "B"} /></div>
                {selected.to && <><span style={{ color: T.text3, fontSize: 18, marginTop: 10 }}>←</span><div><div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3 }}>Previous</div><ClassBadge type={selected.from as "VUS" | "LP" | "P" | "LB" | "B"} /></div></>}
                {selected.reclassDate && <div style={{ marginLeft: "auto" }}><div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3 }}>Reclassified</div><div style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>{selected.reclassDate}</div></div>}
                {selected.source && <div><div style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3 }}>Source</div><div style={{ fontSize: 13, fontWeight: 600, color: T.text2 }}>{selected.source}</div></div>}
              </div>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${T.borderLight}`, padding: "0 28px" }}>
              {tabs.map(t => (
                <div key={t.id} onClick={() => setActiveTab(t.id)} style={{ padding: "12px 18px", fontSize: 13, fontWeight: activeTab === t.id ? 600 : 500, color: activeTab === t.id ? T.primary : T.text3, cursor: "pointer", borderBottom: `2px solid ${activeTab === t.id ? T.primary : "transparent"}`, transition: "all 0.2s" }}>
                  {t.label}{t.badge && <span style={{ background: T.primaryMuted, color: T.primary, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 8, marginLeft: 5 }}>{t.badge}</span>}
                </div>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "24px 28px" }}>

              {/* === EVIDENCE TIMELINE === */}
              {activeTab === "evidence" && (
                <div>
                  {/* Distinction callout */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
                    <div style={{ borderRadius: T.radius, padding: "14px 16px", border: "1.5px solid rgba(197,48,48,0.2)", background: T.redLight }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: T.red }} />Lab Reclassification</div>
                      <p style={{ fontSize: 11.5, color: T.text2, lineHeight: 1.5 }}>Official classification change. Authoritative — requires clinical follow-up.</p>
                      <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginTop: 6, background: "rgba(197,48,48,0.12)", color: T.red, textTransform: "uppercase", letterSpacing: 0.3 }}>Action Required</span>
                    </div>
                    <div style={{ borderRadius: T.radius, padding: "14px 16px", border: "1.5px solid rgba(212,146,10,0.2)", background: T.amberMuted }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, marginBottom: 4 }}><span style={{ width: 8, height: 8, borderRadius: "50%", background: T.amber }} />Evidence Update</div>
                      <p style={{ fontSize: 11.5, color: T.text2, lineHeight: 1.5 }}>New publications, functional data, or ClinVar submissions. Informational — review recommended.</p>
                      <span style={{ display: "inline-block", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, marginTop: 6, background: T.amberLight, color: T.amber, textTransform: "uppercase", letterSpacing: 0.3 }}>Informational</span>
                    </div>
                  </div>

                  <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>Evidence Accrual Timeline</div>
                  <div style={{ position: "relative", paddingLeft: 28 }}>
                    <div style={{ position: "absolute", left: 9, top: 6, bottom: 6, width: 2, background: T.border }} />
                    {TIMELINE_DATA.map((t: any, i: number) => {
                      const dotColor = t.type === "lab" ? T.red : t.type === "evidence" ? T.amber : T.border;
                      const dotBorder = t.type === "lab" ? T.redLight : t.type === "evidence" ? T.amberLight : T.surface;
                      return (
                        <div key={i} style={{ position: "relative", paddingBottom: i < TIMELINE_DATA.length - 1 ? 22 : 0 }}>
                          <div style={{ position: "absolute", left: -28, top: 4, width: 18, height: 18, borderRadius: "50%", background: dotColor, border: `3px solid ${dotBorder}`, zIndex: 2, boxShadow: t.isNew ? `0 0 0 3px ${T.primaryMuted}` : "none" }} />
                          <div style={{ background: t.isNew ? T.primaryLight : T.surface, border: `1px solid ${T.borderLight}`, borderRadius: T.radius, padding: "14px 16px", borderLeft: t.isNew ? `3px solid ${T.primary}` : undefined, transition: "all 0.15s" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                <span style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.3, color: t.type === "lab" ? T.red : t.type === "evidence" ? T.amber : T.text3 }}>{t.label}</span>
                                {t.isNew && <span style={{ fontSize: 9.5, fontWeight: 700, color: T.primary, background: T.primaryMuted, padding: "1px 6px", borderRadius: 3, letterSpacing: 0.4, textTransform: "uppercase" }}>New Since Last Review</span>}
                              </div>
                              <span style={{ fontSize: 11, color: T.text3 }}>{t.date}</span>
                            </div>
                            <p style={{ fontSize: 13, color: T.text2, lineHeight: 1.55, marginBottom: 8 }}>{t.body}</p>
                            {t.source && <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: T.primary, textDecoration: "none", fontWeight: 500 }}>↗ {t.source}</a>}
                            {t.reviewer && (
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, paddingTop: 8, borderTop: `1px solid ${T.borderLight}`, fontSize: 11, color: T.text3 }}>
                                <span style={{ width: 16, height: 16, borderRadius: "50%", background: T.primaryMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: T.primary }}>✓</span>
                                Reviewed by <strong style={{ color: T.text2, fontWeight: 500 }}>{t.reviewer}</strong> on {t.reviewDate}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* === ACMG CLASSIFICATION === */}
              {activeTab === "classify" && (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 6 }}>Select ACMG Evidence Criteria</div>
                  <p style={{ fontSize: 12.5, color: T.text3, marginBottom: 16 }}>Select applicable criteria. Classification is automatically computed based on ACMG/AMP guidelines.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.red, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${T.borderLight}` }}>Pathogenic Evidence</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {ACMG_PATH.map(c => {
                          const sel = selPath.includes(c);
                          return <span key={c} onClick={() => togglePath(c)} style={{ fontFamily: T.fontMono, fontSize: 11, fontWeight: sel ? 600 : 500, padding: "5px 10px", borderRadius: 5, border: `1.5px solid ${sel ? "rgba(197,48,48,0.3)" : T.border}`, background: sel ? T.redLight : "white", color: sel ? T.red : T.text3, cursor: "pointer", transition: "all 0.2s" }}>{c}{sel && " ✓"}</span>;
                        })}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.green, marginBottom: 8, paddingBottom: 4, borderBottom: `1px solid ${T.borderLight}` }}>Benign Evidence</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {ACMG_BEN.map(c => {
                          const sel = selBen.includes(c);
                          return <span key={c} onClick={() => toggleBen(c)} style={{ fontFamily: T.fontMono, fontSize: 11, fontWeight: sel ? 600 : 500, padding: "5px 10px", borderRadius: 5, border: `1.5px solid ${sel ? "rgba(39,103,73,0.3)" : T.border}`, background: sel ? T.greenLight : "white", color: sel ? T.green : T.text3, cursor: "pointer", transition: "all 0.2s" }}>{c}{sel && " ✓"}</span>;
                        })}
                      </div>
                    </div>
                  </div>
                  {/* Output */}
                  <div style={{ marginTop: 20, padding: "16px 20px", borderRadius: T.radius, border: `2px solid ${classBorder[classification.key as keyof typeof classBorder]}`, background: classBg[classification.key as keyof typeof classBg], display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.3s" }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 4 }}>Computed Classification</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: classColor[classification.key as keyof typeof classColor] }}>{classification.label}</div>
                      <div style={{ fontSize: 11.5, color: T.text3, marginTop: 2 }}>{logicParts.length ? `Based on: ${logicParts.join(", ")}` : "No criteria selected"}</div>
                    </div>
                    <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font, flexShrink: 0 }}>Save Classification</button>
                  </div>
                </div>
              )}

              {/* === RESOLUTION WORKFLOW === */}
              {activeTab === "resolution" && (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>Case Resolution Status</div>
                  <div style={{ display: "flex", marginBottom: 28 }}>
                    {["Case Opened", "Under Review", "Decision Documented", "Resolved / Closed"].map((step, i, arr) => {
                      const isCompleted = i === 0;
                      const isActive = i === 1;
                      return <div key={i} style={{ flex: 1, textAlign: "center", padding: "14px 8px", border: `1.5px solid ${isActive || isCompleted ? T.primary : T.border}`, background: isActive ? T.primaryMuted : isCompleted ? T.primaryLight : "white", color: isActive || isCompleted ? T.primary : T.text3, fontSize: 12, fontWeight: isActive ? 600 : 500, borderRadius: i === 0 ? "8px 0 0 8px" : i === arr.length - 1 ? "0 8px 8px 0" : 0, borderLeft: i > 0 ? "none" : undefined, cursor: "pointer" }}>
                        <span style={{ display: "block", fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>Step {i + 1}</span>{step}
                      </div>;
                    })}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>Case Notes</div>
                  <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${T.borderLight}`, background: T.surface }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 12.5, color: T.text2 }}><strong>S. Chen</strong> · Laboratory Director</div>
                        <div style={{ fontSize: 11, color: T.text3 }}>Jan 27, 2026 14:45 EST</div>
                      </div>
                      <div style={{ fontSize: 13, color: T.text1, marginTop: 6, lineHeight: 1.55 }}>Lab reclassification received from GeneDx. Evidence supports upgrade to LP. Reviewing affected patient cases before initiating clinician notification.</div>
                    </div>
                    <div style={{ padding: "12px 16px" }}>
                      <textarea value={caseNotes} onChange={e => setCaseNotes(e.target.value)} placeholder="Add a case note…" style={{ width: "100%", border: "none", outline: "none", resize: "vertical", fontSize: 13, color: T.text1, minHeight: 60, fontFamily: T.font }} />
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                        <button style={{ padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Add Note</button>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: T.text3, marginBottom: 24 }}>All case notes include full audit trail: author, timestamp, and role. Notes cannot be deleted.</div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button style={{ flex: 1, padding: "10px 16px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>Document Decision</button>
                    <button style={{ flex: 1, padding: "10px 16px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Mark Resolved</button>
                  </div>
                </div>
              )}

              {/* === AFFECTED CASES === */}
              {activeTab === "patients" && (
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 6 }}>Cases Linked to This Variant</div>
                  <p style={{ fontSize: 12.5, color: T.text3, marginBottom: 16 }}>Patients who carry this variant. Click to view full case detail. Classification at time of testing is shown for comparison.</p>
                  {PATIENTS_FOR_VARIANT.map((p: any) => (
                    <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: T.surface, borderRadius: T.radius, cursor: "pointer", marginBottom: 8, border: "1px solid transparent", transition: "all 0.15s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = T.primaryMuted; (e.currentTarget as HTMLElement).style.borderColor = T.primary; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = T.surface; (e.currentTarget as HTMLElement).style.borderColor = "transparent"; }}>
                      <div>
                        <div style={{ fontFamily: T.fontMono, fontSize: 13, fontWeight: 600, color: T.navyDeep }}>{p.id}</div>
                        <div style={{ fontSize: 11.5, color: T.text3, marginTop: 2 }}>Tested: {p.testDate} · Classification at testing: <strong style={{ color: T.amber }}>{p.atTest}</strong> → Now: <strong style={{ color: T.red }}>{p.now}</strong></div>
                        <div style={{ fontSize: 11.5, color: T.text3 }}>Panel: {p.panel} · Ordered by: {p.orderedBy}</div>
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                    </div>
                  ))}
                  <div style={{ padding: "14px 18px", background: T.amberMuted, border: "1px solid rgba(212,146,10,0.15)", borderRadius: T.radius, display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16 }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠️</span>
                    <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.55 }}>
                      <strong>Note:</strong> Case linkage shows existing associations between variants and patient records. SerenityGx does not manage patient records directly — it surfaces associations for clinician review and follow-up.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
