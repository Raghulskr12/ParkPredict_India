"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { MapPin, WifiOff } from "lucide-react"

interface MapProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{ lat: number; lng: number; title: string }>
  isOffline?: boolean
}

export function Map({ center, zoom = 14, markers = [], isOffline = false }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (isOffline || !mapRef.current) return

    // Dynamically load Mapbox GL JS
    const loadMapbox = async () => {
      try {
        // Check if mapboxgl is already loaded
        if (typeof window !== "undefined" && (window as any).mapboxgl) {
          initializeMap()
          return
        }

        // Load Mapbox CSS
        const link = document.createElement("link")
        link.href = "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css"
        link.rel = "stylesheet"
        document.head.appendChild(link)

        // Load Mapbox JS
        const script = document.createElement("script")
        script.src = "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js"
        script.onload = () => {
          initializeMap()
        }
        script.onerror = () => {
          setMapError(true)
        }
        document.head.appendChild(script)
      } catch (error) {
        setMapError(true)
      }
    }

    const initializeMap = () => {
      if (!mapRef.current) return

      try {
        const mapboxgl = (window as any).mapboxgl

        // Use a demo token for prototype (in production, use environment variable)
        mapboxgl.accessToken =
          "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"

        const map = new mapboxgl.Map({
          container: mapRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [center.lng, center.lat],
          zoom: zoom,
        })

        // Add markers
        markers.forEach((marker) => {
          const el = document.createElement("div")
          el.className = "marker"
          el.style.cssText = `
            background-color: #f97316;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
          `

          new mapboxgl.Marker(el)
            .setLngLat([marker.lng, marker.lat])
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${marker.title}</h3>`))
            .addTo(map)
        })

        // Add traffic layer to simulate correlation
        map.on("load", () => {
          map.addLayer({
            id: "traffic",
            type: "fill",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Polygon",
                      coordinates: [
                        [
                          [center.lng - 0.01, center.lat - 0.01],
                          [center.lng + 0.01, center.lat - 0.01],
                          [center.lng + 0.01, center.lat + 0.01],
                          [center.lng - 0.01, center.lat + 0.01],
                          [center.lng - 0.01, center.lat - 0.01],
                        ],
                      ],
                    },
                    properties: {},
                  },
                ],
              },
            },
            paint: {
              "fill-color": "#ef4444",
              "fill-opacity": 0.1,
            },
          })
          setMapLoaded(true)
        })
      } catch (error) {
        setMapError(true)
      }
    }

    loadMapbox()
  }, [center, zoom, markers, isOffline])

  // Offline fallback UI
  if (isOffline) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-green-100 flex flex-col items-center justify-center text-center p-6">
        <WifiOff className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Map Offline</h3>
        <p className="text-gray-500 mb-4">Connect to internet to view map</p>
        <Badge variant="outline" className="bg-orange-50 text-orange-700">
          <MapPin className="w-3 h-3 mr-1" />
          {markers[0]?.title || "Current Location"}
        </Badge>
      </div>
    )
  }

  // Error fallback UI
  if (mapError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 flex flex-col items-center justify-center text-center p-6">
        <MapPin className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-red-600 mb-2">Map Error</h3>
        <p className="text-red-500 mb-4">Unable to load map</p>
        <Badge variant="outline" className="bg-red-50 text-red-700">
          Fallback Mode
        </Badge>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {!mapLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-green-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Traffic correlation indicator */}
      {mapLoaded && (
        <div className="absolute top-2 right-2">
          <Badge variant="outline" className="bg-white/90 text-xs">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
            High Traffic Zone
          </Badge>
        </div>
      )}
    </div>
  )
}
