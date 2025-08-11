import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/auth/AuthProvider'
import { LoginForm } from './components/auth/LoginForm'
import { LocationAuth } from './components/auth/LocationAuth'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Children } from './pages/Children'
import { Parents } from './pages/Parents'
import { Referrals } from './pages/Referrals'
import { Attendance } from './pages/Attendance'
import { Payroll } from './pages/Payroll'
import { Accounting } from './pages/Accounting'

function AppContent() {
  const { user, isAuthenticated, setLocationVerified } = useAuth()

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm />
  }

  // Show location verification for field workers
  if (user.role === 'field_worker' && !isLocationVerified) {
    return (
      <LocationAuth
        user={user}
        onAuthSuccess={() => setLocationVerified(true)}
        onAuthFailure={(error) => {
          console.error('Location auth failed:', error)
          // Could show error message or redirect
        }}
      />
    )
  }

  // Show main app if authenticated and location verified (if needed)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="children" element={<Children />} />
          <Route path="parents" element={<Parents />} />
          <Route path="referrals" element={<Referrals />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="accounting" element={<Accounting />} />
        </Route>
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App