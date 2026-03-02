import { useState, useMemo } from "react";

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

const PATIENTS = [
  { id: "P-10890", variants: [{ gene: "BRCA2", hgvs: "c.7008-2A>T", protein: "", atTest: "VUS", current: "LP", reclassType: "lab" }], testDate: "Mar 15, 2024", panel: "Hereditary Cancer Panel (47 genes)", orderedBy: "Dr. M. Williams", status: "needs-action", watchlist: true, notes: [{ author: "S. Chen", role: "Laboratory Director", date: "Jan 27, 2026 14:45", text: "Lab reclassification received from GeneDx for BRCA2 c.7008-2A>T. Upgraded VUS → LP. Initiating clinician notification workflow." }] },
  { id: "P-12045", variants: [{ gene: "BRCA2", hgvs: "c.7008-2A>T", protein: "", atTest: "VUS", current: "LP", reclassType: "lab" }], testDate: "Sep 22, 2024", panel: "BRCA1/2 Analysis", orderedBy: "Dr. A. Ramirez", status: "needs-action", watchlist: true, notes: [] },
  { id: "P-11234", variants: [{ gene: "ATM", hgvs: "c.7271T>G", protein: "p.Val2424Gly", atTest: "VUS", current: "LP", reclassType: "lab" }], testDate: "Nov 8, 2023", panel: "Hereditary Cancer Panel (47 genes)", orderedBy: "Dr. K. Thompson", status: "needs-action", watchlist: false, notes: [{ author: "J. Park", role: "Genetic Counselor", date: "Jan 23, 2026 09:12", text: "Reviewing new LP classification. Patient has family history of breast cancer (maternal aunt, grandmother). Will discuss with ordering clinician." }] },
  { id: "P-09472", variants: [{ gene: "ATM", hgvs: "c.5932G>T", protein: "p.Glu1978*", atTest: "LP", current: "VUS", reclassType: "lab" }, { gene: "CHEK2", hgvs: "c.1283C>T", protein: "p.Ser428Phe", atTest: "VUS", current: "VUS", reclassType: "evidence" }], testDate: "Jun 3, 2023", panel: "Comprehensive Cancer Panel (84 genes)", orderedBy: "Dr. L. Martinez", status: "under-review", watchlist: true, notes: [{ author: "S. Chen", role: "Laboratory Director", date: "Jan 20, 2026 11:30", text: "ATM variant downgraded from LP to VUS by Invitae. Management implications under review — previously patient was managed as high-risk." }, { author: "M. Torres", role: "Genetic Counselor", date: "Jan 22, 2026 16:05", text: "Discussed with Dr. Martinez. Agreed to continue current surveillance protocol pending further review of the reclassification evidence." }] },
  { id: "P-13201", variants: [{ gene: "CHEK2", hgvs: "c.444+1G>A", protein: "", atTest: "LP", current: "LP", reclassType: "evidence" }], testDate: "Aug 19, 2024", panel: "Hereditary Cancer Panel (47 genes)", orderedBy: "Dr. R. Patel", status: "resolved", watchlist: false, notes: [{ author: "S. Chen", role: "Laboratory Director", date: "Jan 20, 2026 15:22", text: "New ClinVar submission reviewed. No change in classification. Case closed." }] },
  { id: "P-08891", variants: [{ gene: "BRCA2", hgvs: "c.9097del", protein: "p.Thr3033Leufs*", atTest: "VUS", current: "VUS", reclassType: "evidence" }], testDate: "Feb 11, 2023", panel: "BRCA1/2 Analysis", orderedBy: "Dr. S. Kim", status: "under-review", watchlist: false, notes: [] },
  { id: "P-14567", variants: [{ gene: "BRCA2", hgvs: "c.9302T>G", protein: "p.Leu3101Arg", atTest: "LP", current: "P", reclassType: "lab" }], testDate: "Jan 5, 2024", panel: "Hereditary Cancer Panel (47 genes)", orderedBy: "Dr. J. Anderson", status: "resolved", watchlist: false, notes: [{ author: "J. Park", role: "Genetic Counselor", date: "Dec 15, 2025 10:40", text: "Upgraded LP → P. No change in clinical management as LP and P are treated equivalently. Documented for audit." }] },
  { id: "P-10221", variants: [{ gene: "CHEK2", hgvs: "c.1283C>T", protein: "p.Ser428Phe", atTest: "VUS", current: "VUS", reclassType: "evidence" }], testDate: "Apr 30, 2024", panel: "Multi-gene Panel (26 genes)", orderedBy: "Dr. N. Garcia", status: "under-review", watchlist: true, notes: [] },
];

function ClassBadge({ type, size = "sm" }: { type: string; size?: "sm" | "xs" }) {
  const map: any = { VUS: { bg: T.amberLight, c: T.amber }, LP: { bg: T.redLight, c: T.red }, P: { bg: "rgba(197,48,48,0.15)", c: "#9B2C2C" }, LB: { bg: T.greenLight, c: T.green }, B: { bg: "rgba(39,103,73,0.15)", c: "#1C4532" } };
  const s = map[type] || map.VUS;
  return <span style={{ padding: size === "xs" ? "1px 5px" : "2px 7px", borderRadius: 4, fontSize: size === "xs" ? 9.5 : 11, fontWeight: 600, background: s.bg, color: s.c, whiteSpace: "nowrap" }}>{type}</span>;
}

function StatusTag({ status }: { status: string }) {
  const map: any = { "needs-action": { bg: T.redLight, c: T.red, l: "Needs Action" }, "under-review": { bg: T.amberLight, c: T.amber, l: "Under Review" }, resolved: { bg: T.greenLight, c: T.green, l: "Resolved" } };
  const s = map[status] || map["under-review"];
  return <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, fontWeight: 600, background: s.bg, color: s.c }}>{s.l}</span>;
}

function TypeDot({ type }: { type: string }) {
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: type === "lab" ? T.red : T.amber, display: "inline-block", flexShrink: 0 }} />;
}

// Upload modal
function UploadModal({ onClose }: { onClose: () => void }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(9,30,63,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: T.radiusLg, width: 560, boxShadow: "0 20px 60px rgba(9,30,63,0.25)", animation: "slideUp 0.25s ease" }}>
        <div style={{ padding: "22px 28px 16px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 700, color: T.navyDeep }}>Upload Patient Data</div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: "none", background: T.surface, borderRadius: 8, cursor: "pointer", fontSize: 18, color: T.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          {/* Drop zone */}
          <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); }}
            style={{ border: `2px dashed ${dragOver ? T.primary : T.border}`, borderRadius: T.radius, padding: "40px 28px", textAlign: "center", background: dragOver ? T.primaryMuted : T.surface, transition: "all 0.2s", cursor: "pointer", marginBottom: 20 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.navyDeep, marginBottom: 4 }}>Drag & drop your CSV file here</div>
            <div style={{ fontSize: 12.5, color: T.text3 }}>or <span style={{ color: T.primary, fontWeight: 500, cursor: "pointer" }}>browse files</span></div>
          </div>
          {/* Required fields */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 8 }}>Required Fields</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Patient ID", "Full Variant (HGVS)", "Classification at Testing"].map(f => (
                <span key={f} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 4, background: T.redLight, color: T.red, fontWeight: 500, fontFamily: T.fontMono, letterSpacing: -0.2 }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 8 }}>Optional Fields</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Testing Date", "Panel Tested", "Ordering Clinician", "Additional Notes", "Family Relations"].map(f => (
                <span key={f} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 4, background: T.navyLight, color: T.navy, fontWeight: 500, fontFamily: T.fontMono, letterSpacing: -0.2 }}>{f}</span>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
            <a href="#" style={{ fontSize: 12.5, color: T.primary, textDecoration: "none", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download SerenityGx-approved CSV template
            </a>
            <button style={{ padding: "10px 24px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Upload</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Notification draft modal
function NotificationModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  if (!patient) return null;
  const v = patient.variants[0];
  const changed = v.atTest !== v.current;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(9,30,63,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: T.radiusLg, width: 620, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(9,30,63,0.25)" }}>
        <div style={{ padding: "22px 28px 16px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 700, color: T.navyDeep }}>Clinician Notification Draft</div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: "none", background: T.surface, borderRadius: 8, cursor: "pointer", fontSize: 18, color: T.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          <div style={{ padding: "14px 18px", background: T.amberMuted, border: "1px solid rgba(212,146,10,0.15)", borderRadius: T.radius, marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <span style={{ flexShrink: 0, marginTop: 1 }}>ℹ️</span>
            <div style={{ fontSize: 12.5, color: T.text2, lineHeight: 1.55 }}>
              This is a <strong>clinician-facing</strong> notification draft regarding patient <strong>{patient.id}</strong>. To aid in documentation and communication, you may copy and customize this text.
            </div>
          </div>
          <div style={{ background: T.surface, borderRadius: T.radius, padding: "18px 20px", border: `1px solid ${T.borderLight}`, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 10 }}>Draft Communication</div>
            <textarea defaultValue={`Dear ${patient.orderedBy},\n\nThis notification is regarding patient ${patient.id}, who was tested on ${patient.testDate} using the ${patient.panel}.\n\nVariant: ${v.gene} ${v.hgvs}${v.protein ? ` (${v.protein})` : ""}\nClassification at time of testing: ${v.atTest}\n${changed ? `Updated classification: ${v.current}\nReclassification source: GeneDx (January 2026)\n\nThis reclassification from ${v.atTest} to ${v.current} may have implications for clinical management. We recommend reviewing the updated classification and considering whether changes to the patient's care plan are warranted.` : `Current classification: ${v.current} (no change)\nNew evidence has been identified that may be relevant to future classification updates.`}\n\nPlease contact our laboratory if you have questions or require additional information.\n\nRegards,\nClinical Genomics Laboratory`}
              style={{ width: "100%", minHeight: 220, border: "none", outline: "none", resize: "vertical", fontFamily: T.fontMono, fontSize: 12.5, color: T.text1, lineHeight: 1.65, background: "transparent" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button style={{ padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font, display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              Copy to Clipboard
            </button>
            <button onClick={onClose} style={{ padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit patient modal
function EditPatientModal({ patient, onClose }: { patient: any; onClose: () => void }) {
  if (!patient) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(9,30,63,0.5)", backdropFilter: "blur(4px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: T.radiusLg, width: 520, boxShadow: "0 20px 60px rgba(9,30,63,0.25)" }}>
        <div style={{ padding: "22px 28px 16px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: T.fontSerif, fontSize: 18, fontWeight: 700, color: T.navyDeep }}>Edit Patient Record</div>
          <button onClick={onClose} style={{ width: 32, height: 32, border: "none", background: T.surface, borderRadius: 8, cursor: "pointer", fontSize: 18, color: T.text3, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "24px 28px" }}>
          {[
            { label: "Patient ID", value: patient.id, disabled: true, note: "Immutable — cannot be changed" },
            { label: "Test Date", value: patient.testDate, disabled: false },
            { label: "Panel Tested", value: patient.panel, disabled: false },
            { label: "Ordering Clinician", value: patient.orderedBy, disabled: false },
          ].map((field: any, i: number) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{field.label}</label>
              <input defaultValue={field.value} disabled={field.disabled} style={{ width: "100%", padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontSize: 13.5, fontFamily: T.font, color: field.disabled ? T.text3 : T.text1, background: field.disabled ? T.surface : "white", outline: "none" }} />
              {field.note && <div style={{ fontSize: 10.5, color: T.text3, marginTop: 3 }}>{field.note}</div>}
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Additional Notes</label>
            <textarea defaultValue="" placeholder="Add optional notes…" style={{ width: "100%", padding: "10px 14px", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, fontSize: 13.5, fontFamily: T.font, color: T.text1, minHeight: 70, resize: "vertical", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "space-between", alignItems: "center" }}>
            <button style={{ padding: "8px 16px", borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.red, border: `1px solid ${T.red}`, fontFamily: T.font, opacity: 0.8 }}>Archive Patient</button>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={onClose} style={{ padding: "8px 16px", borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>Cancel</button>
              <button style={{ padding: "8px 16px", borderRadius: T.radiusSm, fontSize: 12.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Save Changes</button>
            </div>
          </div>
          <div style={{ fontSize: 10.5, color: T.text3, marginTop: 12 }}>All edits are recorded in the audit trail with author, timestamp, and role.</div>
        </div>
      </div>
    </div>
  );
}

export default function PatientVariantReview({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState("P-10890");
  const [watchlists, setWatchlists] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    PATIENTS.forEach(p => { initial[p.id] = p.watchlist; });
    return initial;
  });
  const [showUpload, setShowUpload] = useState(false);
  const [showNotification, setShowNotification] = useState<any>(null);
  const [showEdit, setShowEdit] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  const filters = ["All", "Needs Action", "Under Review", "Resolved", "⭐ Watchlist"];

  const filteredPatients = useMemo(() => {
    return PATIENTS.filter((p: any) => {
      if (filter === "Needs Action") return p.status === "needs-action";
      if (filter === "Under Review") return p.status === "under-review";
      if (filter === "Resolved") return p.status === "resolved";
      if (filter === "⭐ Watchlist") return watchlists[p.id];
      return true;
    }).filter((p: any) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return p.id.toLowerCase().includes(q) || p.variants.some((v: any) => v.gene.toLowerCase().includes(q) || v.hgvs.toLowerCase().includes(q) || (v.protein && v.protein.toLowerCase().includes(q)));
    });
  }, [filter, search, watchlists]);

  const selected = PATIENTS.find((p: any) => p.id === selectedId) || PATIENTS[0];

  const handleNavClick = (label: string) => {
    if (onNavigate) onNavigate(label);
  };

  return (
    <div style={{ fontFamily: T.font, background: T.surface, minHeight: "100vh", color: T.text1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @keyframes fadeInUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        * { box-sizing:border-box; margin:0; padding:0; }
        textarea, input { font-family: inherit; }
      `}</style>

      {/* NAV */}
      <nav style={{ background: `linear-gradient(135deg, ${T.navyDeep} 0%, ${T.navy} 60%, #0E4A8A 100%)`, padding: "0 32px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(9,30,63,0.25)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${T.primary}, #14CDDF)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white", fontSize: 14 }}>Gx</div>
          <div style={{ fontFamily: T.fontSerif, fontWeight: 700, fontSize: 20, color: "white" }}>Serenity<span style={{ fontWeight: 400, color: T.primary, fontSize: 16 }}>Gx</span></div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["Dashboard", "Variant Reclassification", "Patient Variant Review", "Reports"].map(l => (
            <span key={l} onClick={() => handleNavClick(l)} style={{ padding: "8px 16px", color: l === "Patient Variant Review" ? "white" : "rgba(255,255,255,0.7)", background: l === "Patient Variant Review" ? "rgba(24,167,188,0.2)" : "transparent", fontSize: 13.5, fontWeight: 500, borderRadius: T.radiusSm, cursor: "pointer" }}>{l}</span>
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
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: T.text3, marginBottom: 16 }}>
          <a href="#" style={{ color: T.primary, textDecoration: "none", fontWeight: 500 }}>Dashboard</a><span>›</span><span>Patient Variant Review</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: T.fontSerif, fontSize: 26, fontWeight: 700, color: T.navyDeep }}>Patient Variant Review</div>
            <div style={{ color: T.text3, fontSize: 14, marginTop: 4 }}>Review patients affected by variant reclassifications and evidence updates</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setShowUpload(true)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload Patient CSV
            </button>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font, boxShadow: "0 2px 8px rgba(24,167,188,0.25)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Search Patients
            </button>
          </div>
        </div>

        {/* Search + Filters */}
        <div style={{ display: "flex", alignItems: "center", background: T.white, border: `1.5px solid ${T.border}`, borderRadius: T.radius, padding: "0 18px", marginBottom: 16, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.text3} strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient ID, variant, or gene…" style={{ flex: 1, border: "none", outline: "none", padding: 14, fontSize: 14.5, fontFamily: T.font, color: T.text1, background: "transparent" }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.text3, textTransform: "uppercase", letterSpacing: 0.5 }}>Filter:</span>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 12, padding: "5px 14px", borderRadius: 20, border: `1px solid ${filter === f ? T.primary : T.border}`, background: filter === f ? T.primaryMuted : "white", color: filter === f ? T.primary : T.text2, cursor: "pointer", fontFamily: T.font, fontWeight: 500, transition: "all 0.2s" }}>{f}</button>
          ))}
          <span style={{ fontSize: 12.5, color: T.text3, marginLeft: "auto" }}>Showing <strong style={{ color: T.text2 }}>{filteredPatients.length}</strong> patients</span>
        </div>

        {/* Two Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "420px 1fr", gap: 20, minHeight: 600 }}>

          {/* LEFT: Patient List */}
          <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.borderLight}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: T.surface }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.navyDeep }}>Patient List</span>
              <select style={{ fontSize: 11.5, padding: "4px 8px", border: `1px solid ${T.border}`, borderRadius: T.radiusSm, color: T.text2, background: "white", fontFamily: T.font }}>
                <option>Sort: Most recent</option><option>Sort: Patient ID</option><option>Sort: Status</option>
              </select>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {filteredPatients.map((p: any) => (
                <div key={p.id} onClick={() => setSelectedId(p.id)} style={{ padding: "14px 18px", borderBottom: `1px solid ${T.borderLight}`, cursor: "pointer", background: selectedId === p.id ? T.primaryMuted : "transparent", borderLeft: selectedId === p.id ? `3px solid ${T.primary}` : "3px solid transparent", transition: "all 0.15s" }}
                  onMouseEnter={e => { if (selectedId !== p.id) (e.currentTarget as HTMLElement).style.background = T.navyLight; }}
                  onMouseLeave={e => { if (selectedId !== p.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ fontFamily: T.fontMono, fontWeight: 600, fontSize: 14, color: T.navyDeep }}>{p.id}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, cursor: "pointer", color: watchlists[p.id] ? T.amber : T.border }} onClick={e => { e.stopPropagation(); setWatchlists(w => ({ ...w, [p.id]: !w[p.id] })); }}>{watchlists[p.id] ? "★" : "☆"}</span>
                      <StatusTag status={p.status} />
                    </div>
                  </div>
                  {p.variants.map((v: any, vi: number) => (
                    <div key={vi} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <TypeDot type={v.reclassType} />
                      <span style={{ fontStyle: "italic", fontWeight: 500, color: T.navy, fontSize: 12.5 }}>{v.gene}</span>
                      <span style={{ fontFamily: T.fontMono, fontSize: 11.5, color: T.text2 }}>{v.hgvs}</span>
                      <ClassBadge type={v.atTest} size="xs" />
                      {v.atTest !== v.current && <><span style={{ fontSize: 10, color: T.text3 }}>→</span><ClassBadge type={v.current} size="xs" /></>}
                    </div>
                  ))}
                  <div style={{ fontSize: 11, color: T.text3, marginTop: 4 }}>Test: {p.testDate} · {p.panel}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Patient Detail */}
          <div style={{ background: T.white, border: `1px solid ${T.borderLight}`, borderRadius: T.radiusLg, overflowY: "auto" }}>
            {/* Header */}
            <div style={{ padding: "22px 28px 18px", borderBottom: `1px solid ${T.borderLight}`, position: "sticky", top: 0, background: "white", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: T.fontSerif, fontSize: 22, fontWeight: 700, color: T.navyDeep, display: "flex", alignItems: "center", gap: 10 }}>
                    {selected.id}
                    <StatusTag status={selected.status} />
                    {watchlists[selected.id] && <span style={{ fontSize: 14, color: T.amber }}>★</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: T.text3, marginTop: 4 }}>
                    Tested: {selected.testDate} · {selected.panel} · Ordered by: {selected.orderedBy}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setShowEdit(selected)} style={{ padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button onClick={() => setShowNotification(selected)} style={{ padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font, display: "flex", alignItems: "center", gap: 5 }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    Draft Notification
                  </button>
                </div>
              </div>
            </div>

            <div style={{ padding: "24px 28px" }}>
              {/* Variant(s) Detected */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>Variant(s) Detected</div>
                {selected.variants.map((v: any, i: number) => (
                  <div key={i} style={{ padding: "16px 18px", background: T.surface, borderRadius: T.radius, border: `1px solid ${T.borderLight}`, marginBottom: 10, cursor: "pointer", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = T.primary; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = T.borderLight; }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontStyle: "italic", fontWeight: 600, fontSize: 15, color: T.navy }}>{v.gene}</div>
                        <div style={{ fontFamily: T.fontMono, fontSize: 13, color: T.text2 }}>{v.hgvs}</div>
                        {v.protein && <div style={{ fontFamily: T.fontMono, fontSize: 12, color: T.text3 }}>{v.protein}</div>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <TypeDot type={v.reclassType} />
                        <span style={{ fontSize: 11, color: v.reclassType === "lab" ? T.red : T.amber, fontWeight: 500 }}>{v.reclassType === "lab" ? "Lab Reclassification" : "Evidence Update"}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600, width: 85 }}>At Testing</span>
                        <ClassBadge type={v.atTest} />
                      </div>
                      {v.atTest !== v.current && <span style={{ color: T.text3, fontSize: 14 }}>→</span>}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 600 }}>Current</span>
                        <ClassBadge type={v.current} />
                      </div>
                      <a href="#" style={{ fontSize: 11.5, color: T.primary, textDecoration: "none", fontWeight: 500, marginLeft: "auto" }}>View Variant Detail →</a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resolution Workflow */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>Case Resolution</div>
                <div style={{ display: "flex" }}>
                  {["Case Opened", "Under Review", "Decision Documented", "Resolved / Closed"].map((step: string, i: number, arr: string[]) => {
                    const stIdx = selected.status === "needs-action" ? 0 : selected.status === "under-review" ? 1 : 3;
                    const isCompleted = i < stIdx;
                    const isActive = i === stIdx;
                    return <div key={i} style={{ flex: 1, textAlign: "center", padding: "12px 8px", border: `1.5px solid ${isActive || isCompleted ? T.primary : T.border}`, background: isActive ? T.primaryMuted : isCompleted ? T.primaryLight : "white", color: isActive || isCompleted ? T.primary : T.text3, fontSize: 12, fontWeight: isActive ? 600 : 500, borderRadius: i === 0 ? "8px 0 0 8px" : i === arr.length - 1 ? "0 8px 8px 0" : 0, borderLeft: i > 0 ? "none" : undefined }}>
                      <span style={{ display: "block", fontSize: 10, color: T.text3, textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 }}>Step {i + 1}</span>{step}
                    </div>;
                  })}
                </div>
              </div>

              {/* Case Notes — Full audit trail */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: T.text3, marginBottom: 12 }}>
                  Case Notes
                  <span style={{ marginLeft: 8, fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: 11, color: T.text3 }}>(Full audit trail — author, timestamp, role)</span>
                </div>
                <div style={{ border: `1px solid ${T.border}`, borderRadius: T.radius, overflow: "hidden" }}>
                  {selected.notes.length > 0 ? selected.notes.map((n: any, i: number) => (
                    <div key={i} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.borderLight}`, background: T.surface }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <div style={{ fontSize: 12, color: T.text2 }}><strong>{n.author}</strong> · {n.role}</div>
                        <div style={{ fontSize: 11, color: T.text3 }}>{n.date}</div>
                      </div>
                      <div style={{ fontSize: 13, color: T.text1, lineHeight: 1.55 }}>{n.text}</div>
                    </div>
                  )) : (
                    <div style={{ padding: "16px", textAlign: "center", color: T.text3, fontSize: 13, background: T.surface }}>No case notes yet.</div>
                  )}
                  <div style={{ padding: "12px 16px" }}>
                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a case note…" style={{ width: "100%", border: "none", outline: "none", resize: "vertical", fontSize: 13, color: T.text1, minHeight: 50, fontFamily: T.font, background: "transparent" }} />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                      <button style={{ padding: "6px 12px", borderRadius: T.radiusSm, fontSize: 11.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Add Note</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 10 }}>
                <button style={{ flex: 1, padding: "10px 16px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>Document Decision</button>
                <button style={{ flex: 1, padding: "10px 16px", borderRadius: T.radiusSm, fontSize: 13, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg,${T.navy},${T.primary})`, color: "white", border: "none", fontFamily: T.font }}>Mark Resolved</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showNotification && <NotificationModal patient={showNotification} onClose={() => setShowNotification(null)} />}
      {showEdit && <EditPatientModal patient={showEdit} onClose={() => setShowEdit(false)} />}
    </div>
  );
}
