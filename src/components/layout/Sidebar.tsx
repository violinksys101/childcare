import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Clock, 
  DollarSign, 
  Calculator,
  Baby,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Children', href: '/children', icon: Baby },
  { name: 'Parents', href: '/parents', icon: Users },
  { name: 'Attendance', href: '/attendance', icon: UserCheck },
  { name: 'Payroll', href: '/payroll', icon: DollarSign },
  { name: 'Accounting', href: '/accounting', icon: Calculator },
]

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center">
          <Baby className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">ChildCare Pro</span>
        </div>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900">
          <Settings className="mr-3 h-5 w-5" />
          Settings
        </button>
      </div>
    </div>
  )
}