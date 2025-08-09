import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ReferralForm } from '@/components/forms/ReferralForm'
import { Plus, Search, Edit, Eye, Building, User, Phone, Mail, Globe, Users } from 'lucide-react'
import { mockReferrals as initialReferrals, mockChildren } from '@/data/mockData'
import { Referral } from '@/types'
import { formatDate } from '@/lib/utils'

export function Referrals() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<'all' | 'institution' | 'individual'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReferral, setEditingReferral] = useState<Referral | undefined>()

  const filteredReferrals = referrals.filter(referral => {
    const matchesSearch = referral.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (referral.contactPerson && referral.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = typeFilter === 'all' || referral.type === typeFilter
    return matchesSearch && matchesType
  })

  const handleAddReferral = () => {
    setEditingReferral(undefined)
    setIsModalOpen(true)
  }

  const handleEditReferral = (referral: Referral) => {
    setEditingReferral(referral)
    setIsModalOpen(true)
  }

  const handleSubmitReferral = (data: Partial<Referral>) => {
    if (editingReferral) {
      // Update existing referral
      setReferrals(prev => prev.map(referral => 
        referral.id === editingReferral.id 
          ? { ...referral, ...data }
          : referral
      ))
    } else {
      // Add new referral
      const newReferral: Referral = {
        id: Date.now().toString(),
        referredChildren: [],
        totalReferrals: 0,
        dateAdded: new Date().toISOString().split('T')[0],
        status: 'active',
        ...data
      } as Referral
      setReferrals(prev => [...prev, newReferral])
    }
    setIsModalOpen(false)
  }

  const getReferredChildrenNames = (childrenIds: string[]) => {
    return childrenIds.map(id => {
      const child = mockChildren.find(c => c.id === id)
      return child ? `${child.firstName} ${child.lastName}` : 'Unknown'
    })
  }

  const totalReferrals = referrals.reduce((sum, r) => sum + r.totalReferrals, 0)
  const activeReferrals = referrals.filter(r => r.status === 'active').length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Referral Management</h1>
          <p className="text-gray-600 mt-2">Track institutions and individuals who refer families to your services</p>
        </div>
        <Button onClick={handleAddReferral}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Referral Source
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-primary-600">{referrals.length}</p>
            <p className="text-sm text-gray-600 mt-1">Total Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-success-600">{activeReferrals}</p>
            <p className="text-sm text-gray-600 mt-1">Active Sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{totalReferrals}</p>
            <p className="text-sm text-gray-600 mt-1">Total Referrals</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">
              {referrals.filter(r => r.type === 'institution').length}
            </p>
            <p className="text-sm text-gray-600 mt-1">Institutions</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or contact person..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={typeFilter === 'institution' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('institution')}
                size="sm"
              >
                Institutions
              </Button>
              <Button
                variant={typeFilter === 'individual' ? 'default' : 'outline'}
                onClick={() => setTypeFilter('individual')}
                size="sm"
              >
                Individuals
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredReferrals.map((referral) => (
          <Card key={referral.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {referral.type === 'institution' ? (
                    <Building className="h-5 w-5 text-blue-600 mr-2" />
                  ) : (
                    <User className="h-5 w-5 text-green-600 mr-2" />
                  )}
                  <div>
                    <CardTitle className="text-lg">{referral.name}</CardTitle>
                    <Badge variant={referral.type === 'institution' ? 'default' : 'secondary'}>
                      {referral.type}
                    </Badge>
                  </div>
                </div>
                <Badge variant={referral.status === 'active' ? 'success' : 'secondary'}>
                  {referral.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {referral.contactPerson && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact Person</p>
                  <p className="text-sm text-gray-600">{referral.contactPerson}</p>
                </div>
              )}
              
              <div className="space-y-2">
                {referral.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {referral.email}
                  </div>
                )}
                {referral.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {referral.phone}
                  </div>
                )}
                {referral.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2" />
                    <a href={`https://${referral.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {referral.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">Referrals Made</span>
                  <span className="text-lg font-bold text-blue-900">{referral.totalReferrals}</span>
                </div>
                {referral.referredChildren.length > 0 && (
                  <div>
                    <p className="text-xs text-blue-700 mb-1">Referred Children:</p>
                    <div className="flex flex-wrap gap-1">
                      {getReferredChildrenNames(referral.referredChildren).map((name, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700">Added</p>
                <p className="text-sm text-gray-600">{formatDate(referral.dateAdded)}</p>
              </div>

              {referral.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Notes</p>
                  <p className="text-sm text-gray-600">{referral.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-3">
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEditReferral(referral)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReferrals.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No referral sources found matching your criteria.</p>
          </CardContent>
        </Card>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingReferral ? 'Edit Referral Source' : 'Add New Referral Source'}
        className="max-w-2xl"
      >
        <ReferralForm
          referral={editingReferral}
          onSubmit={handleSubmitReferral}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  )
}