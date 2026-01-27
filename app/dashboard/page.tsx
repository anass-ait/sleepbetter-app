"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import SleepChart from "@/components/dashboard/sleep-chart"
import AlertsList from "@/components/dashboard/alerts-list"
import AdvicePanel from "@/components/dashboard/advice-panel"
import GoalsTracker from "@/components/dashboard/goals-tracker"
import WeeklySummary from "@/components/dashboard/weekly-summary"

interface DashboardData {
  stats: {
    avgSleep: number
    lastNightSleep: number
    qualityScore: number
    shortNights: number
  }
  alerts: Array<{
    id: string
    message: string
    severity: string
    isViewed: boolean
  }>
  advice: Array<{
    id: string
    message: string
    priority: number
  }>
  goals: Array<{
    id: string
    name: string
    target: number
    current: number
    unit: string
  }>
  weeklySummary: {
    totalSleep: number
    avgQuality: number
    bestNight: number
    worstNight: number
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [animationStates, setAnimationStates] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        const response = await fetch("/api/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const dashboardData = await response.json()
          setData(dashboardData)

          Object.keys(dashboardData).forEach((key, index) => {
            setTimeout(() => {
              setAnimationStates((prev) => ({ ...prev, [key]: true }))
            }, index * 150)
          })
        } else {
          router.push("/auth/login")
        }
      } catch (err) {
        console.error("Failed to fetch dashboard:", err)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted) {
      fetchDashboardData()
      const interval = setInterval(fetchDashboardData, 30000)
      return () => clearInterval(interval)
    }
  }, [router, mounted])

  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="text-muted-foreground">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background transition-colors duration-500">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {data && (
            <>
              <div className={animationStates.stats ? "scale-in" : "scale-50 opacity-0"}>
                <DashboardStats stats={data.stats} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className={animationStates.chart ? "fade-in" : "opacity-0"}>
                    <SleepChart />
                  </div>
                  <div className={animationStates.summary ? "slide-in" : "opacity-0"}>
                    <WeeklySummary summary={data.weeklySummary} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={animationStates.advice ? "fade-in" : "opacity-0"}>
                    <AdvicePanel advice={data.advice} />
                  </div>
                  <div className={animationStates.goals ? "scale-in" : "opacity-0"}>
                    <GoalsTracker goals={data.goals} />
                  </div>
                </div>
              </div>

              <div className={animationStates.alerts ? "fade-in" : "opacity-0"}>
                <AlertsList alerts={data.alerts} />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
