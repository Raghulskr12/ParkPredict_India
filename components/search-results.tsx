"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MapPin, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface SearchResult {
  id: string
  name: string
  city: string
  probability: number
  distance: string
  microZones: Array<{
    name: string
    probability: number
    distance: string
  }>
}

interface SearchResultsProps {
  results: SearchResult[]
  onLocationSelect: (location: SearchResult) => void
}

export function SearchResults({ results, onLocationSelect }: SearchResultsProps) {
  const [expandedResults, setExpandedResults] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedResults)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedResults(newExpanded)
  }

  const getProbabilityBadge = (probability: number) => {
    if (probability > 0.6) return { variant: "default" as const, color: "bg-green-100 text-green-800" }
    if (probability > 0.3) return { variant: "secondary" as const, color: "bg-yellow-100 text-yellow-800" }
    return { variant: "destructive" as const, color: "bg-red-100 text-red-800" }
  }

  return (
    <div className="space-y-4">
      {results.map((result) => {
        const isExpanded = expandedResults.has(result.id)
        const badgeInfo = getProbabilityBadge(result.probability)

        return (
          <Card
            key={result.id}
            className="hover:shadow-md transition-shadow animate-in slide-in-from-bottom duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-orange-500" />
                  <div>
                    <CardTitle className="text-lg">{result.name}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {result.city} • {result.distance}
                    </p>
                  </div>
                </div>
                <Badge className={badgeInfo.color}>{Math.round(result.probability * 100)}%</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Button
                  onClick={() => onLocationSelect(result)}
                  className="flex-1 bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500"
                >
                  Select Location
                </Button>

                <Collapsible open={isExpanded} onOpenChange={() => toggleExpanded(result.id)}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="icon">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>

                  <CollapsibleContent className="mt-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-gray-700">Micro-zones:</h4>
                      {result.microZones.map((zone, index) => {
                        const zoneBadge = getProbabilityBadge(zone.probability)
                        return (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{zone.name}</p>
                              <p className="text-xs text-gray-500">{zone.distance}</p>
                            </div>
                            <Badge size="sm" className={zoneBadge.color}>
                              {Math.round(zone.probability * 100)}%
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
