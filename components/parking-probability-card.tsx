"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface ParkingProbabilityCardProps {
  location: string
  probability: number
  isOffline?: boolean
}

export function ParkingProbabilityCard({ location, probability, isOffline }: ParkingProbabilityCardProps) {
  const percentage = Math.round(probability * 100)
  const circumference = 2 * Math.PI * 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - probability * circumference

  const getProbabilityColor = (prob: number) => {
    if (prob >= 0.7) return "text-green-500"
    if (prob >= 0.4) return "text-yellow-500"
    return "text-red-500"
  }

  const getProbabilityBg = (prob: number) => {
    if (prob >= 0.7) return "from-green-400 to-green-600"
    if (prob >= 0.4) return "from-yellow-400 to-orange-500"
    return "from-red-400 to-red-600"
  }

  return (
    <Card className="border-2 border-gradient-to-r from-orange-200 to-green-200 animate-in fade-in duration-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h2 className="font-semibold text-gray-800">{location}</h2>
          </div>
          {isOffline && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 text-xs">
              Cached
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" className="stop-orange-400" />
                  <stop offset="100%" className="stop-green-400" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getProbabilityColor(probability)}`}>{percentage}%</div>
                <div className="text-sm text-gray-500">Available</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div
            className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getProbabilityBg(probability)} text-white font-medium`}
          >
            {probability >= 0.7 ? "🟢 High Chance" : probability >= 0.4 ? "🟡 Moderate Chance" : "🔴 Low Chance"}
          </div>
          <p className="text-sm text-gray-600 mt-2">Based on real-time data and AI predictions</p>
        </div>
      </CardContent>
    </Card>
  )
}
