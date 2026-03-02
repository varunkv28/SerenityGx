import { useState } from "react";
import { DesignTokens } from "../constants/designTokens.ts";
import { VARIANT_DATA, PATIENT_FOLLOWUP, ACTIVITY } from "../constants/mockData.tsx";
import TopNav from "./TopNav.tsx";
import StatCard from "./StatCard.tsx";
import VariantTable from "./VariantTable.tsx";
import PatientFollowupPanel from "./PatientFollowupPanel.tsx";
import RecentActivityPanel from "./RecentActivityPanel.tsx";
import VariantModal from "./VariantModal.tsx";

const T = DesignTokens;

export default function SerenityDashboard({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedVariant, setSelectedVariant] = useState<any>(null);

  const filters = ["All", "↑ LP/P", "↓ from LP/P", "VUS→LB/B"];

  const filteredData = VARIANT_DATA.filter((v: any) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "↑ LP/P") return v.to === "LP" || v.to === "P";
    if (activeFilter === "↓ from LP/P") return v.from === "LP" && (v.to === "VUS" || v.to === "LB" || v.to === "B");
    return false;
  });

  return (
    <div style={{ fontFamily: T.font, background: T.surface, minHeight: "100vh", color: T.text1 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Source+Serif+4:wght@400;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      `}</style>
      <TopNav activePage="Dashboard" onNavigate={onNavigate} />
      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px 48px" }}>
        {/* Page Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, animation: "fadeInUp 0.4s ease both" }}>
          <div>
            <div style={{ fontFamily: T.fontSerif, fontSize: 26, fontWeight: 700, color: T.navyDeep, letterSpacing: -0.5 }}>Surveillance Dashboard</div>
            <div style={{ color: T.text3, fontSize: 14, marginTop: 4 }}>Last updated: Jan 27, 2026 · 14:32 EST</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: "white", color: T.text2, border: `1px solid ${T.border}`, fontFamily: T.font }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              Upload Patient CSV
            </button>
            <button style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: T.radiusSm, fontSize: 13.5, fontWeight: 500, cursor: "pointer", background: `linear-gradient(135deg, ${T.navy}, ${T.primary})`, color: "white", border: "none", fontFamily: T.font, boxShadow: "0 2px 8px rgba(24,167,188,0.25)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              Search Variants
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          <StatCard color="teal" label="Variants Under Active Surveillance" tooltip="Total unique variants with opt-in monitoring enabled by your lab" value="847" detail='Across <strong style="color:#4A5568">312</strong> unique patients' delay={0.05} />
          <StatCard color="red" label="Clinically Significant Reclassifications" tooltip="Patients whose variant moved into or out of LP/P classification" value="12" detail='<strong style="color:#4A5568">8</strong> upgraded to LP/P · <strong style="color:#4A5568">4</strong> downgraded' delay={0.1} />
          <StatCard color="amber" label="Evidence Updates Pending Review" tooltip="New publications, functional studies, or ClinVar submissions awaiting clinician review" value="23" detail='<strong style="color:#4A5568">7</strong> new since your last session' delay={0.15} />
          <StatCard color="navy" label="Cases Requiring Follow-up" tooltip="Open cases where a reclassification or evidence update requires clinician action" value="9" detail='<strong style="color:#4A5568">3</strong> open · <strong style="color:#4A5568">4</strong> in review · <strong style="color:#4A5568">2</strong> pending close' delay={0.2} />
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 20 }}>
          <VariantTable 
            data={filteredData} 
            filters={filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onSelectVariant={setSelectedVariant}
          />

          {/* RIGHT SIDEBAR */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <PatientFollowupPanel data={PATIENT_FOLLOWUP} />
            <RecentActivityPanel data={ACTIVITY} />
          </div>
        </div>
      </main>
      {selectedVariant && <VariantModal variant={selectedVariant} onClose={() => setSelectedVariant(null)} />}
    </div>
  );
}
