import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, MapPin, Users, UserCheck, Plus } from 'lucide-react'
import { mockAttendance, mockStaffAttendance } from '@/data/mockData'
import { useAuth } from '@/components/auth/AuthProvider'

export function Attendance() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'children' | 'staff'>('children')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="success">Present</Badge>
      case 'absent':
        return <Badge variant="destructive">Absent</Badge>
      case 'late':
        return <Badge variant="warning">Late</Badge>
      case 'early_departure':
        return <Badge variant="secondary">Early Departure</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const todayStats = {
    children: {
      present: mockAttendance.filter(r => r.status === 'present').length,
      absent: mockAttendance.filter(r => r.status === 'absent').length,
      late: mockAttendance.filter(r => r.status === 'late').length,
      total: mockAttendance.length
    },
    staff: {
      present: mockStaffAttendance.filter(r => r.status === 'present').length,
      absent: mockStaffAttendance.filter(r => r.status === 'absent').length,
      late: mockStaffAttendance.filter(r => r.status === 'late').length,
      total: mockStaffAttendance.length
    }
  }

  // Field workers can only see their assigned children
  const filteredAttendance = user?.role === 'field_worker' 
    ? mockAttendance.filter(record => user.assignedChildren?.includes(record.childId))
    : mockAttendance

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-2">Track daily attendance for children and staff</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Mark Attendance
        </Button>
      </div>

      {/* Date Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <span className="text-sm text-gray-600">
              Showing attendance for {new Date(selectedDate).toLocaleDateString()}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === 'children' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('children')}
          size="sm"
        >
          <Users className="h-4 w-4 mr-2" />
          Children
        </Button>
        <Button
          variant={activeTab === 'staff' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('staff')}
          size="sm"
        >
          <UserCheck className="h-4 w-4 mr-2" />
          Staff
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-success-600">
              {todayStats[activeTab].present}
            </p>
            <p className="text-sm text-gray-600 mt-1">Present</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-warning-600">
              {todayStats[activeTab].late}
            </p>
            <p className="text-sm text-gray-600 mt-1">Late</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-danger-600">
              {todayStats[activeTab].absent}
            </p>
            <p className="text-sm text-gray-600 mt-1">Absent</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">
              {todayStats[activeTab].total}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      {activeTab === 'children' ? (
        <Card>
          <CardHeader>
            <CardTitle>Children Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{record.childName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {record.checkIn && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          In: {record.checkIn}
                        </div>
                      )}
                      {record.checkOut && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Out: {record.checkOut}
                        </div>
                      )}
                      <div className="flex items-center">
                        <UserCheck className="h-4 w-4 mr-1" />
                        {record.caregiverName}
                      </div>
                    </div>
                    {record.notes && (
                      <p className="text-sm text-gray-500 mt-1">{record.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(record.status)}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Staff Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStaffAttendance.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{record.staffName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {record.checkIn && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          In: {record.checkIn}
                        </div>
                      )}
                      {record.checkOut && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Out: {record.checkOut}
                        </div>
                      )}
                      {record.location && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {record.location}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {record.hoursWorked}h worked
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(record.status)}
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}