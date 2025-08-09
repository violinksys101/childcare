import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ChildForm } from '@/components/forms/ChildForm'
import { Plus, Search, Edit, Eye } from 'lucide-react'
import { mockChildren as initialChildren } from '@/data/mockData'
import { Child } from '@/types'
import { calculateAge, formatDate } from '@/lib/utils'

export function Children() {
  const [children, setChildren] = useState<Child[]>(initialChildren)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingChild, setEditingChild] = useState<Child | undefined>()

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         child.parentName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || child.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleAddChild = () => {
    setEditingChild(undefined)
    setIsModalOpen(true)
  }

  const handleEditChild = (child: Child) => {
    setEditingChild(child)
    setIsModalOpen(true)
  }

  const handleSubmitChild = (data: Partial<Child>) => {
    if (editingChild) {
      // Update existing child
      setChildren(prev => prev.map(child => 
        child.id === editingChild.id 
          ? { ...child, ...data }
          : child
      ))
    } else {
      // Add new child
      const newChild: Child = {
        id: Date.now().toString(),
        parentId: Date.now().toString(),
        enrollmentDate: new Date().toISOString().split('T')[0],
        ...data
      } as Child
      setChildren(prev => [...prev, newChild])
    }
    setIsModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Children Management</h1>
          <p className="text-gray-600 mt-2">Manage child profiles, enrollment, and information</p>
        </div>
        <Button onClick={handleAddChild}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Child
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by child name or parent..."
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
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('active')}
                size="sm"
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                onClick={() => setStatusFilter('inactive')}
                size="sm"
              >
                Inactive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child) => (
          <Card key={child.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {child.firstName} {child.lastName}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Age: {calculateAge(child.dateOfBirth)} years
                  </p>
                </div>
                <Badge variant={child.status === 'active' ? 'success' : 'secondary'}>
                  {child.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700">Parent</p>
                <p className="text-sm text-gray-600">{child.parentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Program</p>
                <p className="text-sm text-gray-600">{child.program}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Enrolled</p>
                <p className="text-sm text-gray-600">{formatDate(child.enrollmentDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Emergency Contact</p>
                <p className="text-sm text-gray-600">{child.emergencyContact}</p>
              </div>
              <div className="flex gap-2 pt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditChild(child)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChildren.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No children found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{children.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Children</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-success-600">
              {children.filter(c => c.status === 'active').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Active Enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-warning-600">
              {children.filter(c => c.status === 'inactive').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Inactive</p>
          </CardContent>
        </Card>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingChild ? 'Edit Child' : 'Add New Child'}
        className="max-w-2xl"
      >
        <ChildForm
          child={editingChild}
          onSubmit={handleSubmitChild}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}