"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Search, MapPin, ArrowLeft } from "lucide-react"
import { SearchResults } from "@/components/search-results"

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

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    name: "Connaught Place",
    city: "Delhi",
    probability: 0.72,
    distance: "1.2km",
    microZones: [
      { name: "CP Central Park", probability: 0.65, distance: "1.0km" },
      { name: "Rajiv Chowk Metro", probability: 0.45, distance: "1.2km" },
      { name: "Palika Bazaar", probability: 0.8, distance: "1.4km" },
    ],
  },
  {
    id: "2",
    name: "Khan Market",
    city: "Delhi",
    probability: 0.35,
    distance: "3.5km",
    microZones: [
      { name: "Khan Market Main", probability: 0.25, distance: "3.5km" },
      { name: "Lodhi Road Side", probability: 0.55, distance: "3.8km" },
    ],
  },
  {
    id: "3",
    name: "Bandra-Kurla Complex",
    city: "Mumbai",
    probability: 0.58,
    distance: "2.1km",
    microZones: [
      { name: "BKC Business District", probability: 0.45, distance: "2.0km" },
      { name: "BKC Residential", probability: 0.75, distance: "2.3km" },
    ],
  },
  {
    id: "4",
    name: "Colaba",
    city: "Mumbai",
    probability: 0.28,
    distance: "5.2km",
    microZones: [
      { name: "Gateway of India", probability: 0.15, distance: "5.0km" },
      { name: "Colaba Causeway", probability: 0.4, distance: "5.4km" },
    ],
  },
  {
    id: "5",
    name: "Koramangala",
    city: "Bengaluru",
    probability: 0.68,
    distance: "4.1km",
    microZones: [
      { name: "Koramangala 5th Block", probability: 0.6, distance: "4.0km" },
      { name: "Koramangala 4th Block", probability: 0.75, distance: "4.2km" },
    ],
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const cached = localStorage.getItem("recentSearches")
    if (cached) {
      setRecentSearches(JSON.parse(cached))
    }
  }, [])

  // Simulate search with mock delay
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const filtered = mockSearchResults.filter(
      (result) =>
        result.name.toLowerCase().includes(query.toLowerCase()) ||
        result.city.toLowerCase().includes(query.toLowerCase()),
    )

    setSearchResults(filtered)
    setIsLoading(false)

    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem("recentSearches", JSON.stringify(updated))
  }

  const handleLocationSelect = (location: SearchResult) => {
    // Update main app data and redirect
    const updatedData = {
      location: `${location.name}, ${location.city}`,
      parkingProbability: location.probability,
      towRisk: Math.random() * 0.3, // Random tow risk
      nearestAutoStand: {
        name: `${location.name} Auto Stand`,
        distance: "400m",
        fare: "₹25",
      },
      isMonsoon: false,
      isFestival: false,
      isTwoWheeler: false,
    }

    localStorage.setItem("parkingData", JSON.stringify(updatedData))
    localStorage.setItem("parkingDataTimestamp", Date.now().toString())

    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4 animate-in slide-in-from-left duration-500">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => (window.location.href = "/")}
            className="hover:bg-orange-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
            Search Locations
          </h1>
        </div>

        {/* Search Bar */}
        <Card className="border-2 border-gradient-to-r from-orange-200 to-green-200">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for areas, landmarks, or cities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                className="pl-10 rounded-full border-orange-200 focus:border-orange-400"
              />
              <Button
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 rounded-full px-4 py-1 text-sm"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Searches */}
        {recentSearches.length > 0 && !searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Searches</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentSearches.map((search, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left hover:bg-orange-50"
                  onClick={() => {
                    setSearchQuery(search)
                    handleSearch(search)
                  }}
                >
                  <Search className="w-4 h-4 mr-2 text-gray-400" />
                  {search}
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search Results */}
        {!isLoading && searchResults.length > 0 && (
          <SearchResults results={searchResults} onLocationSelect={handleLocationSelect} />
        )}

        {/* No Results */}
        {!isLoading && searchQuery && searchResults.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No locations found</h3>
              <p className="text-gray-500">Try searching for popular areas like "Connaught Place" or "BKC"</p>
            </CardContent>
          </Card>
        )}

        {/* Popular Locations */}
        {!searchQuery && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockSearchResults.slice(0, 3).map((location) => (
                <Button
                  key={location.id}
                  variant="ghost"
                  className="w-full justify-between hover:bg-orange-50 h-auto p-3"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="text-left">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-gray-500">
                      {location.city} • {location.distance}
                    </div>
                  </div>
                  <Badge
                    variant={
                      location.probability > 0.6 ? "default" : location.probability > 0.3 ? "secondary" : "destructive"
                    }
                    className="ml-2"
                  >
                    {Math.round(location.probability * 100)}%
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
