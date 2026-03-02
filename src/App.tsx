import { useState } from 'react'
import SerenityDashboard from './components/Dashboard'
import VariantReclassification from './components/VariantReclassification'
import PatientVariantReview from './components/PatientVariantReview'
import Reports from './components/Reports'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const handleNavigate = (page: string) => {
    if (page === 'Dashboard') {
      setCurrentPage('dashboard')
    } else if (page === 'Variant Reclassification') {
      setCurrentPage('variant-reclassification')
    } else if (page === 'Patient Variant Review') {
      setCurrentPage('patient-review')
    } else if (page === 'Reports') {
      setCurrentPage('reports')
    }
  }

  return (
    <>
      {currentPage === 'dashboard' && <SerenityDashboard onNavigate={handleNavigate} />}
      {currentPage === 'variant-reclassification' && <VariantReclassification onNavigate={handleNavigate} />}
      {currentPage === 'patient-review' && <PatientVariantReview onNavigate={handleNavigate} />}
      {currentPage === 'reports' && <Reports onNavigate={handleNavigate} />}
    </>
  )
}

export default App
