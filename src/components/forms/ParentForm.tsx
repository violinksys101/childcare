import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Parent } from '@/types'

interface ParentFormProps {
  parent?: Parent
  onSubmit: (data: Partial<Parent>) => void
  onCancel: () => void
}

export function ParentForm({ parent, onSubmit, onCancel }: ParentFormProps) {
  const [formData, setFormData] = useState({
    firstName: parent?.firstName || '',
    lastName: parent?.lastName || '',
    email: parent?.email || '',
    phone: parent?.phone || '',
    address: parent?.address || '',
    billingStatus: parent?.billingStatus || 'current'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <Input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <Input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address *
        </label>
        <Textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address, city, state, zip code"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Billing Status
        </label>
        <Select
          name="billingStatus"
          value={formData.billingStatus}
          onChange={handleChange}
        >
          <option value="current">Current</option>
          <option value="overdue">Overdue</option>
          <option value="paid">Paid</option>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {parent ? 'Update Parent' : 'Add Parent'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}