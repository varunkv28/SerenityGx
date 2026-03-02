export const VARIANT_DATA = [
  { gene: "BRCA2", hgvs: "c.7008-2A>T", protein: "", from: "VUS", to: "LP", updateType: "lab", updateLabel: "Lab Reclassification", status: "open", reviewer: null, date: "Jan 27", patients: 2, isNew: true },
  { gene: "CHEK2", hgvs: "c.1283C>T", protein: "p.Ser428Phe", from: "VUS", to: null, updateType: "evidence", updateLabel: "New functional study", status: "in-review", reviewer: "J. Park", reviewDate: "Jan 24", patients: 1, isNew: true },
  { gene: "ATM", hgvs: "c.7271T>G", protein: "p.Val2424Gly", from: "VUS", to: "LP", updateType: "lab", updateLabel: "Lab Reclassification", status: "open", reviewer: null, patients: 1, isNew: false },
  { gene: "CHEK2", hgvs: "c.444+1G>A", protein: "", from: "LP", to: null, updateType: "evidence", updateLabel: "New ClinVar submission", status: "resolved", reviewer: "S. Chen", reviewDate: "Jan 20", patients: 2, isNew: false },
  { gene: "ATM", hgvs: "c.5932G>T", protein: "p.Glu1978*", from: "LP", to: "VUS", updateType: "lab", updateLabel: "Lab Reclassification", status: "open", reviewer: null, patients: 3, isNew: false },
  { gene: "BRCA2", hgvs: "c.9097del", protein: "p.Thr3033Leufs*", from: "VUS", to: null, updateType: "evidence", updateLabel: "New segregation data", status: "in-review", reviewer: "M. Torres", reviewDate: "Jan 26", patients: 1, isNew: true },
];

export const PATIENT_FOLLOWUP = [
  { id: "P-10890", gene: "BRCA2", hgvs: "c.7008-2A>T", testDate: "Mar 2024", fromClass: "VUS", toClass: "LP", status: "needs-action", affectedCount: 2 },
  { id: "P-11234", gene: "ATM", hgvs: "c.7271T>G (p.Val2424Gly)", testDate: "Nov 2023", fromClass: "VUS", toClass: "LP", status: "needs-action", affectedCount: 1 },
  { id: "P-09472", gene: "ATM", hgvs: "c.5932G>T (p.Glu1978*)", testDate: "Jun 2023", fromClass: "LP", toClass: "VUS", status: "under-review", affectedCount: 3 },
];

export const ACTIVITY = [
  { type: "reclass", icon: "↑", text: <>Lab Reclassification: <em style={{ color: "#0C3C78", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontStyle: "italic" }}>BRCA2</em> <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#0C3C78", background: "rgba(12,60,120,0.06)", padding: "1px 5px", borderRadius: 3 }}>c.7008-2A&gt;T</code> upgraded VUS → LP by GeneDx</>, time: "2 hours ago" },
  { type: "evidence", icon: "📄", text: <>New Functional Study: <em style={{ color: "#0C3C78", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontStyle: "italic" }}>CHEK2</em> <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#0C3C78", background: "rgba(12,60,120,0.06)", padding: "1px 5px", borderRadius: 3 }}>c.1283C&gt;T</code> — loss-of-function data (PMID: 39284716)</>, time: "6 hours ago" },
  { type: "review", icon: "👁", text: <><strong>J. Park</strong> reviewed <em style={{ color: "#0C3C78", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontStyle: "italic" }}>CHEK2</em> <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#0C3C78", background: "rgba(12,60,120,0.06)", padding: "1px 5px", borderRadius: 3 }}>c.1283C&gt;T</code> — documented decision</>, time: "Yesterday, 4:12 PM" },
  { type: "resolved", icon: "✓", text: <><strong>S. Chen</strong> resolved case for <em style={{ color: "#0C3C78", fontFamily: "'DM Sans', sans-serif", fontWeight: 500, fontStyle: "italic" }}>CHEK2</em> <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: "#0C3C78", background: "rgba(12,60,120,0.06)", padding: "1px 5px", borderRadius: 3 }}>c.444+1G&gt;A</code> — no clinical action required</>, time: "Jan 20, 2026" },
];
