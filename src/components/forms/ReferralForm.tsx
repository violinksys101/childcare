import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Referral } from '@/types'

interface ReferralFormProps {
  referral?: Referral
  onSubmit: (data: Partial<Referral>) => void
  onCancel: () => void
}

export function ReferralForm({ referral, onSubmit, onCancel }: ReferralFormProps) {
  const [formData, setFormData] = useState({
    name: referral?.name || '',
    type: referral?.type || 'institution',
    contactPerson: referral?.contactPerson || '',
    email: referral?.email || '',
    phone: referral?.phone || '',
    address: referral?.address || '',
    website: referral?.website || '',
    notes: referral?.notes || '',
    status: referral?.status || 'active'
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Institution or individual name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type *
        </label>
        <Select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="institution">Institution</option>
          <option value="individual">Individual</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Person
        </label>
        <Input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={handleChange}
          placeholder="Primary contact person"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <Textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address, city, state, zip code"
          rows={2}
        />
      </div>

      {formData.type === 'institution' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <Input
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="www.example.com"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <Textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional information about this referral source..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <Select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {referral ? 'Update Referral Source' : 'Add Referral Source'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}