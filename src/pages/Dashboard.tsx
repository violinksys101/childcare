import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Users, Baby, UserCheck, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { mockChildren, mockParents, mockAttendance, mockTransactions, mockReferrals } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export function Dashboard() {
  const totalChildren = mockChildren.length
  const activeChildren = mockChildren.filter(child => child.status === 'active').length
  const totalParents = mockParents.length
  const presentToday = mockAttendance.filter(record => record.status === 'present').length
  const totalReferrals = mockReferrals.reduce((sum, r) => sum + r.totalReferrals, 0)
  
  const monthlyRevenue = mockTransactions
    .filter(t => t.type === 'income' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const monthlyExpenses = mockTransactions
    .filter(t => t.type === 'expense' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const stats = [
    {
      title: 'Total Children',
      value: totalChildren,
      icon: Baby,
      color: 'text-primary-600',
      bgColor: 'bg-primary-50'
    },
    {
      title: 'Active Enrollments',
      value: activeChildren,
      icon: UserCheck,
      color: 'text-success-600',
      bgColor: 'bg-success-50'
    },
    {
      title: 'Total Parents',
      value: totalParents,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Present Today',
      value: presentToday,
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ]

  const recentActivities = [
    { id: 1, activity: 'Emma Johnson checked in', time: '8:00 AM', type: 'check-in' },
    { id: 2, activity: 'New parent registration: Michael Smith', time: '9:30 AM', type: 'registration' },
    { id: 2.5, activity: 'New referral from Sunshine Elementary School', time: '9:45 AM', type: 'referral' },
    { id: 3, activity: 'Payment received from Sarah Johnson', time: '10:15 AM', type: 'payment' },
    { id: 4, activity: 'Staff meeting scheduled for 2:00 PM', time: '11:00 AM', type: 'meeting' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your childcare center today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-green-800">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-900">{formatCurrency(monthlyRevenue)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-red-800">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-red-900">{formatCurrency(monthlyExpenses)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-red-600 rotate-180" />
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Net Profit</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(monthlyRevenue - monthlyExpenses)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                  <Badge 
                    variant={
                      activity.type === 'check-in' ? 'success' :
                      activity.type === 'payment' ? 'default' :
                      activity.type === 'registration' ? 'secondary' :
                      activity.type === 'referral' ? 'default' : 'warning'
                    }
                  >
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{presentToday}</p>
              <p className="text-sm text-green-800">Present</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {mockAttendance.filter(r => r.status === 'late').length}
              </p>
              <p className="text-sm text-yellow-800">Late</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-2xl font-bold text-red-600">
                {mockAttendance.filter(r => r.status === 'absent').length}
              </p>
              <p className="text-sm text-red-800">Absent</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{totalChildren}</p>
              <p className="text-sm text-blue-800">Total Enrolled</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}