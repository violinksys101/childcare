import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MapPin, Lock, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { User, Child, Location } from '@/types'

interface LocationAuthProps {
  user: User
  onAuthSuccess: () => void
  onAuthFailure: (error: string) => void
}

export function LocationAuth({ user, onAuthSuccess, onAuthFailure }: LocationAuthProps) {
  const [currentLocation, setCurrentLocation] = useState<GeolocationPosition | null>(null)
  const [locationError, setLocationError] = useState<string>('')
  const [isCheckingLocation, setIsCheckingLocation] = useState(false)
  const [allowedLocations, setAllowedLocations] = useState<Location[]>([])
  const [nearbyLocation, setNearbyLocation] = useState<Location | null>(null)

  useEffect(() => {
    // Mock allowed locations for field worker
    if (user.role === 'field_worker') {
      setAllowedLocations([
        {
          id: '1',
          name: 'Johnson Family Home',
          address: '123 Main St, Anytown, ST 12345',
          latitude: 40.7128,
          longitude: -74.0060,
          radius: 100
        },
        {
          id: '2',
          name: 'Smith Family Home',
          address: '456 Oak Ave, Anytown, ST 12345',
          latitude: 40.7589,
          longitude: -73.9851,
          radius: 100
        },
        {
          id: '3',
          name: 'Brown Family Home',
          address: '789 Pine Rd, Anytown, ST 12345',
          latitude: 40.7505,
          longitude: -73.9934,
          radius: 100
        }
      ])
    }
  }, [user])

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
        checkLocationAccess(position)
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
        onAuthFailure(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    )
  }

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

  const checkLocationAccess = (position: GeolocationPosition) => {
    const userLat = position.coords.latitude
    const userLon = position.coords.longitude

    for (const location of allowedLocations) {
      const distance = calculateDistance(userLat, userLon, location.latitude, location.longitude)
      
      if (distance <= location.radius) {
        setNearbyLocation(location)
        onAuthSuccess()
        return
      }
    }

    onAuthFailure('You are not at an authorized location for field work.')
  }

  const handleManualLocationCheck = () => {
    getCurrentLocation()
  }

  // Auto-check location on component mount
  useEffect(() => {
    if (user.role === 'field_worker') {
      getCurrentLocation()
    }
  }, [user.role])

  if (user.role !== 'field_worker') {
    onAuthSuccess()
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-primary-600" />
          </div>
          <CardTitle>Location Verification Required</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Field workers must be at an authorized location to access the system
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
            
            {nearbyLocation && (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Location verified!</span>
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

          {/* Nearby Authorized Location */}
          {nearbyLocation && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-900 mb-2">Authorized Location</h4>
              <p className="text-sm text-green-800">
                <strong>{nearbyLocation.name}</strong><br />
                {nearbyLocation.address}
              </p>
              <Badge variant="success" className="mt-2">
                Access Granted
              </Badge>
            </div>
          )}

          {/* Authorized Locations List */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Your Authorized Locations</h4>
            <div className="space-y-2">
              {allowedLocations.map((location) => (
                <div key={location.id} className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-sm text-gray-900">{location.name}</p>
                  <p className="text-xs text-gray-600">{location.address}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Within {location.radius}m radius
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleManualLocationCheck}
              disabled={isCheckingLocation}
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
                  Verify My Location
                </>
              )}
            </Button>

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
              Make sure location services are enabled and you're at one of your assigned locations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}