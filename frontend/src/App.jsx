import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import FamiliesPage from './pages/FamiliesPage'
import FamilyDetailPage from './pages/FamilyDetailPage'
import AddFamilyPage from './pages/AddFamilyPage'
import DashboardPage from './pages/DashboardPage'
import DeathEventsPage from './pages/DeathEventsPage'
import AddDeathEventPage from './pages/AddDeathEventPage'
import DeathEventDetailPage from './pages/DeathEventDetailPage'
import AnalyticsPage from './pages/AnalyticsPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/families" element={<FamiliesPage />} />
        <Route path="/families/add" element={<AddFamilyPage />} />
        <Route path="/families/:id" element={<FamilyDetailPage />} />
        <Route path="/death-events" element={<DeathEventsPage />} />
        <Route path="/death-events/add" element={<AddDeathEventPage />} />
        <Route path="/death-events/:id" element={<DeathEventDetailPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>
    </Layout>
  )
}

export default App
