"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

interface TowRiskAlertProps {
  risk: number
}

export function TowRiskAlert({ risk }: TowRiskAlertProps) {
  const riskPercentage = Math.round(risk * 100)

  const getRiskLevel = (risk: number) => {
    if (risk >= 0.3) return { level: "High", color: "destructive", bg: "bg-red-50" }
    if (risk >= 0.15) return { level: "Medium", color: "secondary", bg: "bg-yellow-50" }
    return { level: "Low", color: "outline", bg: "bg-orange-50" }
  }

  const riskInfo = getRiskLevel(risk)

  return (
    <Alert className={`border-2 border-red-200 ${riskInfo.bg} animate-in slide-in-from-left duration-500`}>
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <span className="font-medium text-red-800">Tow Risk Alert</span>
          <p className="text-sm text-red-700 mt-1">{riskPercentage}% chance of vehicle being towed in this area</p>
        </div>
        <Badge variant={riskInfo.color as any} className="ml-2">
          {riskInfo.level} Risk
        </Badge>
      </AlertDescription>
    </Alert>
  )
}
