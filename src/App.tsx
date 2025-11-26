
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './styles/themes.css'

import { AppStateProvider, useAppState } from './state/AppState'
import AppLayout from './components/AppLayout'
import { AuthProvider } from './contexts/AuthContext'



import Dashboard from './pages/Dashboard'
import Onboarding from './pages/Onboarding'
import BudgetPlanner from './pages/BudgetPlanner'
import LearnFinance from './pages/LearnFinance'
import Invest from './pages/Invest'
import BankPayments from './pages/BankPayments'
import Rewards from './pages/Rewards'
import Community from './pages/Community'
import Coach from './pages/Coach'
import SpendTracker from './pages/SpendTracker'
import BillSplitter from './pages/BillSplitter'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import PocketPlan from './pages/PocketPlan'
import Login from './components/Login'
import AIInsights from './pages/AIInsights'
import AIBudgetWizard from './pages/AIBudgetWizard'
import SIP from './pages/SIP'
import EducationVideos from './pages/EducationVideos'

function AppShell() {
  const { theme } = useAppState()
  const themeClass =
    theme === 'Dark' ? 'bnm-theme-dark' :
      theme === 'Neon' ? 'bnm-theme-neon' :
        theme === 'Light' ? 'bnm-theme-light' :
          theme === 'FoodLover' ? 'theme-food' :
            theme === 'Fitness' ? 'theme-fitness' : 'theme-selfcare'
  return (
    <div className={`App ${themeClass}`} style={{ padding: 16 }}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<BankPayments />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/learn" element={<LearnFinance />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/sip" element={<SIP />} />
          <Route path="/bank" element={<BankPayments />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/community" element={<Community />} />
          <Route path="/coach" element={<Coach />} />
          <Route path="/insights" element={<AIInsights />} />
          <Route path="/edu" element={<EducationVideos />} />
          <Route path="/wizard" element={<AIBudgetWizard />} />
          <Route path="/spend" element={<SpendTracker />} />
          <Route path="/split" element={<BillSplitter />} />
          <Route path="/notes" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/pocketplan" element={<PocketPlan />} />
        </Route>
      </Routes>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  )
}

export default App