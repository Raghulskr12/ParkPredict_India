"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, MapPin, Clock } from "lucide-react"

interface AutoRickshawSuggestionProps {
  autoStand: {
    name: string
    distance: string
    fare: string
  }
}

export function AutoRickshawSuggestion({ autoStand }: AutoRickshawSuggestionProps) {
  const handleBookRickshaw = () => {
    // Simulate booking - in real app would integrate with auto-rickshaw services
    alert(
      `Booking auto-rickshaw from ${autoStand.name}!\nEstimated fare: ${autoStand.fare}\nDistance: ${autoStand.distance}`,
    )
  }

  return (
    <Alert className="border-2 border-yellow-200 bg-yellow-50 animate-in slide-in-from-right duration-500">
      <Car className="h-4 w-4 text-yellow-600" />
      <AlertDescription>
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-yellow-800">Low Parking Availability</span>
            <p className="text-sm text-yellow-700 mt-1">Consider taking an auto-rickshaw instead</p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-yellow-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{autoStand.name}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{autoStand.distance}</span>
              </div>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-700 text-xs">
                {autoStand.fare}
              </Badge>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleBookRickshaw}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white ml-4"
          >
            Book Auto
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
