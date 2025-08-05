"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Star, CloudRain, Calendar, Bike, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Settings {
  defaultMonsoonMode: boolean
  defaultFestivalMode: boolean
  defaultTwoWheelerMode: boolean
  preferredVehicle: "car" | "bike"
  towRiskAlerts: boolean
  notifications: boolean
}

export default function SettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState<Settings>({
    defaultMonsoonMode: false,
    defaultFestivalMode: false,
    defaultTwoWheelerMode: false,
    preferredVehicle: "car",
    towRiskAlerts: true,
    notifications: true,
  })

  const [hasChanges, setHasChanges] = useState(false)

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSettingChange = (key: keyof Settings, value: boolean | string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  const saveSettings = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings))
    setHasChanges(false)

    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-in slide-in-from-left duration-500">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => (window.location.href = "/")}
              className="hover:bg-orange-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <Star className="w-6 h-6 text-orange-400" />
        </div>

        {/* Default Modes */}
        <Card className="animate-in slide-in-from-right duration-500 delay-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Default Modes</span>
              <Badge variant="outline" className="text-xs">
                Auto-Enable
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CloudRain className="w-5 h-5 text-blue-500" />
                <div>
                  <Label htmlFor="monsoon-default" className="font-medium">
                    Monsoon Mode
                  </Label>
                  <p className="text-sm text-gray-500">Auto-enable during rainy season</p>
                </div>
              </div>
              <Switch
                id="monsoon-default"
                checked={settings.defaultMonsoonMode}
                onCheckedChange={(checked) => handleSettingChange("defaultMonsoonMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-purple-500" />
                <div>
                  <Label htmlFor="festival-default" className="font-medium">
                    Festival Mode
                  </Label>
                  <p className="text-sm text-gray-500">Auto-enable during festivals</p>
                </div>
              </div>
              <Switch
                id="festival-default"
                checked={settings.defaultFestivalMode}
                onCheckedChange={(checked) => handleSettingChange("defaultFestivalMode", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bike className="w-5 h-5 text-green-500" />
                <div>
                  <Label htmlFor="twowheeler-default" className="font-medium">
                    Two-Wheeler Mode
                  </Label>
                  <p className="text-sm text-gray-500">Auto-enable for bikes/scooters</p>
                </div>
              </div>
              <Switch
                id="twowheeler-default"
                checked={settings.defaultTwoWheelerMode}
                onCheckedChange={(checked) => handleSettingChange("defaultTwoWheelerMode", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Preferences */}
        <Card className="animate-in slide-in-from-right duration-500 delay-200">
          <CardHeader>
            <CardTitle>Vehicle Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehicle-type">Preferred Vehicle Type</Label>
              <Select
                value={settings.preferredVehicle}
                onValueChange={(value: "car" | "bike") => handleSettingChange("preferredVehicle", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="car">🚗 Car</SelectItem>
                  <SelectItem value="bike">🏍️ Bike/Scooter</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500">This will automatically enable Two-Wheeler Mode for bikes</p>
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card className="animate-in slide-in-from-right duration-500 delay-300">
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <Label htmlFor="tow-alerts" className="font-medium">
                    Tow Risk Alerts
                  </Label>
                  <p className="text-sm text-gray-500">Get warned about high tow risk areas</p>
                </div>
              </div>
              <Switch
                id="tow-alerts"
                checked={settings.towRiskAlerts}
                onCheckedChange={(checked) => handleSettingChange("towRiskAlerts", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-green-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🔔</span>
                </div>
                <div>
                  <Label htmlFor="notifications" className="font-medium">
                    Push Notifications
                  </Label>
                  <p className="text-sm text-gray-500">Parking updates and reminders</p>
                </div>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="animate-in slide-in-from-right duration-500 delay-400">
          <CardHeader>
            <CardTitle>App Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0 Beta</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache Status</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Button
          onClick={saveSettings}
          disabled={!hasChanges}
          className="w-full h-12 bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {hasChanges ? "Save Changes" : "All Changes Saved"}
        </Button>

        {/* Cultural Element */}
        <div className="text-center py-4">
          <div className="inline-flex items-center space-x-2 text-orange-400">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Made with ❤️ for India</span>
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
