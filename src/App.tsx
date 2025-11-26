import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import './fingen/styles/themes.css'

import { AppStateProvider, useAppState } from './fingen/state/AppState'
import AppLayout from './fingen/components/AppLayout'
import { AuthProvider } from './contexts/AuthContext'
// Top navbar removed per request; sidebar lives inside Dashboard UI

// Pages
import Dashboard from './fingen/pages/Dashboard'
import Onboarding from './fingen/pages/Onboarding'
import BudgetPlanner from './fingen/pages/BudgetPlanner'
import LearnFinance from './fingen/pages/LearnFinance'
import Invest from './fingen/pages/Invest'
import BankPayments from './fingen/pages/BankPayments'
import Rewards from './fingen/pages/Rewards'
import Community from './fingen/pages/Community'
import Coach from './fingen/pages/Coach'
import SpendTracker from './fingen/pages/SpendTracker'
import BillSplitter from './fingen/pages/BillSplitter'
import Notifications from './fingen/pages/Notifications'
import Settings from './fingen/pages/Settings'
import PocketPlan from './pocketplan/PocketPlan'
import Login from './components/Login'
import AIInsights from './fingen/pages/AIInsights'
import AIBudgetWizard from './fingen/pages/AIBudgetWizard'
import SIP from './fingen/pages/SIP'
import EducationVideos from './fingen/pages/EducationVideos'

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