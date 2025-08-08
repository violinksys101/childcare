import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Plus, Search, Edit, Eye, Phone, Mail, MapPin } from 'lucide-react'
import { mockParents, mockChildren } from '@/data/mockData'
import { formatCurrency } from '@/lib/utils'

export function Parents() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'current' | 'overdue' | 'paid'>('all')

  const filteredParents = mockParents.filter(parent => {
    const matchesSearch = parent.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         parent.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || parent.billingStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const getChildrenNames = (childrenIds: string[]) => {
    return childrenIds.map(id => {
      const child = mockChildren.find(c => c.id === id)
      return child ? `${child.firstName} ${child.lastName}` : 'Unknown'
    }).join(', ')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parent Management</h1>
          <p className="text-gray-600 mt-2">Manage parent profiles, contact information, and billing</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Parent
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'current' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('current')}
                size="sm"
              >
                Current
              </Button>
              <Button
                variant={statusFilter === 'overdue' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('overdue')}
                size="sm"
              >
                Overdue
              </Button>
              <Button
                variant={statusFilter === 'paid' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('paid')}
                size="sm"
              >
                Paid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredParents.map((parent) => (
          <Card key={parent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {parent.firstName} {parent.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {parent.children.length} child{parent.children.length !== 1 ? 'ren' : ''}
                  </p>
                </div>
                <Badge 
                  variant={
                    parent.billingStatus === 'current' ? 'success' :
                    parent.billingStatus === 'overdue' ? 'destructive' : 'default'
                  }
                >
                  {parent.billingStatus}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Children</p>
                <p className="text-sm text-gray-600">{getChildrenNames(parent.children)}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {parent.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {parent.phone}
                </div>
                <div className="flex items-start text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{parent.address}</span>
                </div>
              </div>

              {parent.totalDue > 0 && (
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm font-medium text-red-800">Outstanding Balance</p>
                  <p className="text-lg font-bold text-red-900">{formatCurrency(parent.totalDue)}</p>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredParents.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No parents found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{mockParents.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Parents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-success-600">
              {mockParents.filter(p => p.billingStatus === 'current').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Current</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-danger-600">
              {mockParents.filter(p => p.billingStatus === 'overdue').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Overdue</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-warning-600">
              {formatCurrency(mockParents.reduce((sum, p) => sum + p.totalDue, 0))}
            </p>
            <p className="text-sm text-gray-600 mt-1">Total Outstanding</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}