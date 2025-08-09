import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Child } from '@/types'

interface ChildFormProps {
  child?: Child
  onSubmit: (data: Partial<Child>) => void
  onCancel: () => void
}

export function ChildForm({ child, onSubmit, onCancel }: ChildFormProps) {
  const [formData, setFormData] = useState({
    firstName: child?.firstName || '',
    lastName: child?.lastName || '',
    dateOfBirth: child?.dateOfBirth || '',
    parentName: child?.parentName || '',
    program: child?.program || 'Full Day Care',
    emergencyContact: child?.emergencyContact || '',
    medicalInfo: child?.medicalInfo || '',
    status: child?.status || 'active'
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
          Date of Birth *
        </label>
        <Input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Parent/Guardian Name *
        </label>
        <Input
          name="parentName"
          value={formData.parentName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Program *
        </label>
        <Select
          name="program"
          value={formData.program}
          onChange={handleChange}
          required
        >
          <option value="Full Day Care">Full Day Care</option>
          <option value="Half Day Care">Half Day Care</option>
          <option value="After School">After School</option>
          <option value="Hourly Care">Hourly Care</option>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Emergency Contact *
        </label>
        <Input
          name="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          placeholder="(555) 123-4567"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medical Information
        </label>
        <Textarea
          name="medicalInfo"
          value={formData.medicalInfo}
          onChange={handleChange}
          placeholder="Allergies, medications, special needs..."
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
          {child ? 'Update Child' : 'Add Child'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  )
}