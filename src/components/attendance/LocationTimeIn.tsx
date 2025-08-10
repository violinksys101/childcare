import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Clock, CheckCircle, AlertCircle, Loader, User } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthProvider'
import { mockChildren } from '@/data/mockData'
import { Child, Location } from '@/types'

interface LocationTimeInProps {
  onTimeInSuccess: (childId: string, location: Location) => void
  onTimeInFailure: (error: string) => void
}

export function LocationTimeIn({ onTimeInSuccess, onTimeInFailure }: LocationTimeInProps) {
  const { user } = useAuth()
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)
  const [nearbyChild, setNearbyChild] = useState<Child | null>(null)
  const [assignedChildren, setAssignedChildren] = useState<Child[]>([])
  const [isTimingIn, setIsTimingIn] = useState(false)

  useEffect(() => {
    // Get assigned children for field worker
    if (user?.role === 'field_worker' && user.assignedChildren) {
      const children = mockChildren.filter(child => 
        user.assignedChildren?.includes(child.id)
      )
      setAssignedChildren(children)
    }
  }, [user])

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180
    const φ2 = lat2 * Math.PI / 180
    const Δφ = (lat2 - lat1) * Math.PI / 180
    const Δλ = (lon2 - lon1) * Math.PI / 180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  const checkLocationForTimeIn = (position: GeolocationPosition) => {
    const userLat = position.coords.latitude
    const userLon = position.coords.longitude

    for (const child of assignedChildren) {
      if (child.homeLocation) {
        const distance = calculateDistance(
          userLat, 
          userLon, 
          child.homeLocation.latitude, 
          child.homeLocation.longitude
        )
        
        if (distance <= child.homeLocation.radius) {
          setNearbyChild(child)
          return child
        }
      }
    }

    setNearbyChild(null)
    return null
  }

  const getCurrentLocation = () => {
    setIsCheckingLocation(true)
    setLocationError('')

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser')
      setIsCheckingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation(position)
        checkLocationForTimeIn(position)
        setIsCheckingLocation(false)
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable.'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.'
            break
        }
        setLocationError(errorMessage)
        setIsCheckingLocation(false)
        onTimeInFailure(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

  const handleTimeIn = async () => {
    if (!nearbyChild || !nearbyChild.homeLocation) {
      onTimeInFailure('No valid location found for time-in')
      return
    }

    setIsTimingIn(true)
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onTimeInSuccess(nearbyChild.id, nearbyChild.homeLocation)
      
      // Reset state after successful time-in
      setCurrentLocation(null)
      setNearbyChild(null)
    } catch (error) {
      onTimeInFailure('Failed to record time-in. Please try again.')
    } finally {
      setIsTimingIn(false)
    }
  }

  // Auto-check location on component mount
  useEffect(() => {
    if (user?.role === 'field_worker' && assignedChildren.length > 0) {
      getCurrentLocation()
    }
  }, [user?.role, assignedChildren.length])

  if (user?.role !== 'field_worker') {
    return null
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-6 w-6 text-primary-600" />
        </div>
        <CardTitle>Location-Based Time In</CardTitle>
        <p className="text-sm text-gray-600 mt-2">
          You must be at an assigned child's location to time in
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="text-center">
          {isCheckingLocation && (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Checking your location...</span>
            </div>
          )}
          
          {nearbyChild && (
            <div className="flex items-center justify-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Location verified for time-in!</span>
            </div>
          )}
          
          {locationError && (
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{locationError}</span>
            </div>
          )}
        </div>

        {/* Current Location Info */}
        {currentLocation && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Current Location</h4>
            <p className="text-sm text-gray-600">
              Lat: {currentLocation.coords.latitude.toFixed(6)}<br />
              Lon: {currentLocation.coords.longitude.toFixed(6)}<br />
              Accuracy: ±{Math.round(currentLocation.coords.accuracy)}m
            </p>
          </div>
        )}

        {/* Nearby Child Location */}
        {nearbyChild && nearbyChild.homeLocation && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Ready for Time-In</h4>
            <div className="flex items-center space-x-2 mb-2">
              <User className="h-4 w-4 text-green-700" />
              <span className="text-sm font-medium text-green-800">
                {nearbyChild.firstName} {nearbyChild.lastName}
              </span>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-green-700 mt-0.5" />
              <span className="text-sm text-green-800">
                {nearbyChild.homeLocation.address}
              </span>
            </div>
            <Badge variant="success" className="mt-2">
              Within {nearbyChild.homeLocation.radius}m radius
            </Badge>
          </div>
        )}

        {/* Assigned Children List */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Your Assigned Children</h4>
          <div className="space-y-2">
            {assignedChildren.map((child) => (
              <div key={child.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {child.firstName} {child.lastName}
                    </p>
                    {child.homeLocation && (
                      <p className="text-xs text-gray-600">{child.homeLocation.address}</p>
                    )}
                  </div>
                  {nearbyChild?.id === child.id && (
                    <Badge variant="success" className="text-xs">
                      Current Location
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {nearbyChild ? (
            <Button 
              onClick={handleTimeIn}
              disabled={isTimingIn}
              className="w-full"
            >
              {isTimingIn ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Recording Time-In...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Time In at {nearbyChild.firstName}'s Location
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={getCurrentLocation}
              disabled={isCheckingLocation}
              variant="outline"
              className="w-full"
            >
              {isCheckingLocation ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Checking Location...
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 mr-2" />
                  Check My Location
                </>
              )}
            </Button>
          )}

          {locationError && (
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Retry
            </Button>
          )}
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            You must be within the specified radius of an assigned child's home to time in.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}