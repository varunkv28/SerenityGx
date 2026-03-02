export const VARIANT_DATA_RECLASS = [
  { id: 0, gene: "BRCA2", hgvs: "c.7008-2A>T", protein: "", from: "VUS", to: "LP", type: "lab", label: "Lab Reclassification", date: "Jan 27", status: "open", watchlist: true, isNew: true, reviewer: null, clinvar: "VCV000127824", chr: "chr13:32339791", subtype: "Splice site variant", source: "GeneDx", reclassDate: "Jan 27, 2026" },
  { id: 1, gene: "CHEK2", hgvs: "c.1283C>T", protein: "p.Ser428Phe", from: "VUS", to: null, type: "evidence", label: "New functional study", date: "Jan 25", status: "in-review", watchlist: true, isNew: true, reviewer: "J. Park", clinvar: "VCV000516271", chr: "chr22:28695868", subtype: "Missense", source: null, reclassDate: null },
  { id: 2, gene: "ATM", hgvs: "c.7271T>G", protein: "p.Val2424Gly", from: "VUS", to: "LP", type: "lab", label: "Lab Reclassification", date: "Jan 22", status: "open", watchlist: false, isNew: false, reviewer: null, clinvar: "VCV000128151", chr: "chr11:108236086", subtype: "Missense", source: "Ambry", reclassDate: "Jan 22, 2026" },
  { id: 3, gene: "CHEK2", hgvs: "c.444+1G>A", protein: "", from: "LP", to: null, type: "evidence", label: "New ClinVar submission", date: "Jan 18", status: "resolved", watchlist: false, isNew: false, reviewer: "S. Chen", clinvar: "VCV000418723", chr: "chr22:28687974", subtype: "Splice donor", source: null, reclassDate: null },
  { id: 4, gene: "ATM", hgvs: "c.5932G>T", protein: "p.Glu1978*", from: "LP", to: "VUS", type: "lab", label: "Lab Reclassification", date: "Jan 15", status: "open", watchlist: true, isNew: false, reviewer: null, clinvar: "VCV000264917", chr: "chr11:108225634", subtype: "Nonsense", source: "Invitae", reclassDate: "Jan 15, 2026" },
  { id: 5, gene: "BRCA2", hgvs: "c.9097del", protein: "p.Thr3033Leufs*", from: "VUS", to: null, type: "evidence", label: "New segregation data", date: "Jan 12", status: "in-review", watchlist: false, isNew: false, reviewer: "M. Torres", clinvar: "VCV000371892", chr: "chr13:32370955", subtype: "Frameshift", source: null, reclassDate: null },
  { id: 6, gene: "BRCA2", hgvs: "c.9302T>G", protein: "p.Leu3101Arg", from: "VUS", to: "P", type: "evidence", label: "Historical reference", date: "stable", status: "resolved", watchlist: false, isNew: false, reviewer: null, clinvar: "VCV000051065", chr: "chr13:32371162", subtype: "Missense", source: null, reclassDate: null },
];

export const TIMELINE_DATA = [
  { type: "lab", label: "Lab Reclassification", date: "Jan 27, 2026", body: "GeneDx officially reclassified this variant from VUS to Likely Pathogenic. Classification based on updated functional evidence and co-segregation data across 4 families.", source: "GeneDx Reclassification Report", isNew: true, reviewer: null, reviewDate: null },
  { type: "evidence", label: "New Functional Study", date: "Jan 14, 2026", body: "Splice-site disruption confirmed via RNA analysis. Complete exon skipping observed in patient lymphoblastoid cells. Supports PVS1 (null variant) classification.", source: "PubMed: PMID 39284716", isNew: true, reviewer: null, reviewDate: null },
  { type: "evidence", label: "ClinVar Submission", date: "Nov 3, 2025", body: "New ClinVar submitter (Invitae) classified this variant as Likely Pathogenic. Now 3/4 submitters agree on LP classification.", source: "ClinVar: VCV000127824", isNew: false, reviewer: "J. Park", reviewDate: "Nov 8, 2025" },
  { type: "evidence", label: "Segregation Evidence", date: "Jun 18, 2025", body: "Co-segregation with breast cancer confirmed in 2 additional families (total 4). Supports PP1 (co-segregation) at moderate strength.", source: "PubMed: PMID 38891204", isNew: false, reviewer: "S. Chen", reviewDate: "Jul 2, 2025" },
  { type: "evidence", label: "ClinVar Submission", date: "Mar 2, 2024", body: "First ClinVar submission classified this variant as VUS. Limited evidence at time of submission — single submitter (GeneDx).", source: "ClinVar: VCV000127824", isNew: false, reviewer: null, reviewDate: null },
  { type: "initial", label: "Initial Classification", date: "Jan 15, 2024", body: "Variant first reported as VUS in patient P-10890. Initial classification by GeneDx hereditary cancer panel.", source: null, isNew: false, reviewer: null, reviewDate: null },
];

export const PATIENTS_FOR_VARIANT = [
  { id: "P-10890", testDate: "Mar 15, 2024", atTest: "VUS", now: "LP", panel: "Hereditary Cancer Panel (47 genes)", orderedBy: "Dr. M. Williams" },
  { id: "P-12045", testDate: "Sep 22, 2024", atTest: "VUS", now: "LP", panel: "BRCA1/2 Analysis", orderedBy: "Dr. A. Ramirez" },
];
