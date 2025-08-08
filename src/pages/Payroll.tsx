import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { DollarSign, Clock, FileText, Plus, Download } from 'lucide-react'
import { mockPayroll } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export function Payroll() {
  const [selectedPeriod, setSelectedPeriod] = useState('Jan 1-15, 2024')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success">Approved</Badge>
      case 'paid':
        return <Badge variant="default">Paid</Badge>
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const totalPayroll = mockPayroll.reduce((sum, record) => sum + record.netPay, 0)
  const totalGross = mockPayroll.reduce((sum, record) => sum + record.grossPay, 0)
  const totalDeductions = mockPayroll.reduce((sum, record) => sum + record.deductions, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Manage employee payroll, hours, and compensation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Payroll
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Pay Period:</label>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="Jan 1-15, 2024">Jan 1-15, 2024</option>
              <option value="Dec 16-31, 2023">Dec 16-31, 2023</option>
              <option value="Dec 1-15, 2023">Dec 1-15, 2023</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPayroll)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Net Pay</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalGross)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Gross Pay</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDeductions)}</p>
            <p className="text-sm text-gray-600 mt-1">Total Deductions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {mockPayroll.reduce((sum, record) => sum + record.regularHours + record.overtimeHours, 0)}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Records */}
      <Card>
        <CardHeader>
          <CardTitle>Payroll Records - {selectedPeriod}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPayroll.map((record) => (
              <div key={record.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{record.employeeName}</h3>
                    <p className="text-sm text-gray-600">{record.position}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(record.status)}
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Payslip
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Hours Breakdown</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Regular:</span>
                        <span>{record.regularHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Overtime:</span>
                        <span>{record.overtimeHours}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Holiday:</span>
                        <span>{record.holidayHours}h</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Rate & Gross</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Hourly Rate:</span>
                        <span>{formatCurrency(record.hourlyRate)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Gross Pay:</span>
                        <span>{formatCurrency(record.grossPay)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Deductions</p>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Total:</span>
                        <span className="text-red-600">{formatCurrency(record.deductions)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Net Pay</p>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(record.netPay)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  {record.status === 'draft' && (
                    <Button size="sm">
                      Approve
                    </Button>
                  )}
                  {record.status === 'approved' && (
                    <Button size="sm" variant="default">
                      Mark as Paid
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}