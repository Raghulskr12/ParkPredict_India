"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CloudRain, Calendar, Bike, Info } from "lucide-react"

interface ModeTogglesProps {
  monsoonMode: boolean
  festivalMode: boolean
  twoWheelerMode: boolean
  onToggle: (mode: "monsoon" | "festival" | "twoWheeler", enabled: boolean) => void
}

export function ModeToggles({ monsoonMode, festivalMode, twoWheelerMode, onToggle }: ModeTogglesProps) {
  return (
    <Card className="border-2 border-gradient-to-r from-orange-200 to-green-200 animate-in slide-in-from-bottom duration-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center space-x-2">
          <span>Smart Modes</span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TooltipProvider>
          {/* Monsoon Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
            <div className="flex items-center space-x-3">
              <CloudRain className="w-5 h-5 text-blue-500" />
              <div>
                <Label htmlFor="monsoon-mode" className="font-medium cursor-pointer">
                  Monsoon Mode
                </Label>
                <p className="text-sm text-gray-600">Reduces probability by 25%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Accounts for waterlogged streets and reduced parking availability during rains</p>
                </TooltipContent>
              </Tooltip>
              <Switch
                id="monsoon-mode"
                checked={monsoonMode}
                onCheckedChange={(checked) => onToggle("monsoon", checked)}
              />
            </div>
          </div>

          {/* Festival Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-purple-500" />
              <div>
                <Label htmlFor="festival-mode" className="font-medium cursor-pointer">
                  Festival Mode
                </Label>
                <p className="text-sm text-gray-600">Increases probability by 50%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Special parking arrangements during Diwali, Holi, and other festivals</p>
                </TooltipContent>
              </Tooltip>
              <Switch
                id="festival-mode"
                checked={festivalMode}
                onCheckedChange={(checked) => onToggle("festival", checked)}
              />
            </div>
          </div>

          {/* Two-Wheeler Mode */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors">
            <div className="flex items-center space-x-3">
              <Bike className="w-5 h-5 text-green-500" />
              <div>
                <Label htmlFor="twowheeler-mode" className="font-medium cursor-pointer">
                  Two-Wheeler Mode
                </Label>
                <p className="text-sm text-gray-600">Increases probability by 10%</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bikes and scooters need 35% less space and have more parking options</p>
                </TooltipContent>
              </Tooltip>
              <Switch
                id="twowheeler-mode"
                checked={twoWheelerMode}
                onCheckedChange={(checked) => onToggle("twoWheeler", checked)}
              />
            </div>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  )
}
