import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLocationVerified: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setLocationVerified: (verified: boolean) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLocationVerified, setIsLocationVerified] = useState(false)

  // Mock users for demonstration
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@childcare.com',
      role: 'admin'
    },
    {
      id: '2',
      name: 'Field Worker',
      email: 'fieldworker@childcare.com',
      role: 'field_worker',
      assignedChildren: ['1', '2', '3'],
      allowedLocations: [
        {
          id: '1',
          name: 'Johnson Family Home',
          address: '123 Main St, Anytown, ST 12345',
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 100
        }
      ]
    },
    {
      id: '3',
      name: 'Caregiver',
      email: 'caregiver@childcare.com',
      role: 'caregiver'
    }
  ]

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email)
    
    if (foundUser && password === 'password') {
      setUser(foundUser)
      
      // For non-field workers, automatically verify location
      if (foundUser.role !== 'field_worker') {
        setIsLocationVerified(true)
      }
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setUser(null)
    setIsLocationVerified(false)
  }

  const setLocationVerified = (verified: boolean) => {
    setIsLocationVerified(verified)
  }

  const isAuthenticated = user !== null && (user.role !== 'field_worker' || isLocationVerified)

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLocationVerified,
      login,
      logout,
      setLocationVerified
    }}>
      {children}
    </AuthContext.Provider>
  )
}