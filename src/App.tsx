import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Children } from './pages/Children'
import { Parents } from './pages/Parents'
import { Referrals } from './pages/Referrals'
import { Attendance } from './pages/Attendance'
import { Payroll } from './pages/Payroll'
import { Accounting } from './pages/Accounting'

function App() {
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

export default App