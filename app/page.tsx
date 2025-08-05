"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import { ParkingProbabilityCard } from "@/components/parking-probability-card"
import { ModeToggles } from "@/components/mode-toggles"
import { TowRiskAlert } from "@/components/tow-risk-alert"
import { AutoRickshawSuggestion } from "@/components/auto-rickshaw-suggestion"
import { Map } from "@/components/Map"

// Mock data structure
interface ParkingData {
  location: string
  parkingProbability: number
  towRisk: number
  nearestAutoStand: {
    name: string
    distance: string
    fare: string
  }
  isMonsoon: boolean
  isFestival: boolean
  isTwoWheeler: boolean
}

export default function HomePage() {
  const [parkingData, setParkingData] = useState<ParkingData>({
    location: "Connaught Place, Delhi",
    parkingProbability: 0.72,
    towRisk: 0.15,
    nearestAutoStand: {
      name: "CP Auto Stand",
      distance: "500m",
      fare: "₹30",
    },
    isMonsoon: false,
    isFestival: false,
    isTwoWheeler: false,
  })

  const [isOffline, setIsOffline] = useState(false)

  // Calculate adjusted parking probability based on modes
  const getAdjustedProbability = () => {
    let probability = parkingData.parkingProbability

    if (parkingData.isMonsoon) {
      probability *= 0.75 // Reduce by 25%
    }

    if (parkingData.isFestival) {
      probability *= 1.5 // Increase by 50%
    }

    if (parkingData.isTwoWheeler) {
      probability *= 1.1 // Increase by 10%
    }

    return Math.min(probability, 1) // Cap at 100%
  }

  // Load cached data on mount
  useEffect(() => {
    const cachedData = localStorage.getItem("parkingData")
    const cacheTimestamp = localStorage.getItem("parkingDataTimestamp")

    if (cachedData && cacheTimestamp) {
      const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000
      if (Number.parseInt(cacheTimestamp) > fourHoursAgo) {
        setParkingData(JSON.parse(cachedData))
      }
    }

    // Check online status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    setIsOffline(!navigator.onLine)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("parkingData", JSON.stringify(parkingData))
    localStorage.setItem("parkingDataTimestamp", Date.now().toString())
  }, [parkingData])

  const handleModeToggle = (mode: "monsoon" | "festival" | "twoWheeler", enabled: boolean) => {
    setParkingData((prev) => ({
      ...prev,
      [`is${mode.charAt(0).toUpperCase() + mode.slice(1)}`]: enabled,
    }))
  }

  const adjustedProbability = getAdjustedProbability()
  const showAutoRickshaw = adjustedProbability < 0.15

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            ParkPredict India
          </h1>
          <p className="text-gray-600">Smart Parking for Smart Cities</p>
          {isOffline && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Offline Mode
            </Badge>
          )}
        </div>

        {/* Main Prediction Card */}
        <ParkingProbabilityCard
          location={parkingData.location}
          probability={adjustedProbability}
          isOffline={isOffline}
        />

        {/* Mode Toggles */}
        <ModeToggles
          monsoonMode={parkingData.isMonsoon}
          festivalMode={parkingData.isFestival}
          twoWheelerMode={parkingData.isTwoWheeler}
          onToggle={handleModeToggle}
        />

        {/* Tow Risk Alert */}
        {parkingData.towRisk > 0.1 && <TowRiskAlert risk={parkingData.towRisk} />}

        {/* Auto-Rickshaw Suggestion */}
        {showAutoRickshaw && <AutoRickshawSuggestion autoStand={parkingData.nearestAutoStand} />}

        {/* Map Section */}
        <Card className="overflow-hidden border-2 border-gradient-to-r from-orange-200 to-green-200">
          <div className="h-64">
            <Map
              center={{ lat: 28.6328, lng: 77.2167 }}
              zoom={14}
              markers={[{ lat: 28.6328, lng: 77.2167, title: parkingData.location }]}
              isOffline={isOffline}
            />
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-12 border-orange-200 hover:bg-orange-50 bg-transparent"
            onClick={() => (window.location.href = "/search")}
          >
            <MapPin className="w-4 h-4 mr-2" />
            Search Areas
          </Button>
          <Button
            variant="outline"
            className="h-12 border-green-200 hover:bg-green-50 bg-transparent"
            onClick={() => (window.location.href = "/settings")}
          >
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
