import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get("authorization")

    if (!auth?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const dashboardData = {
      stats: {
        avgSleep: 7.2,
        lastNightSleep: 7.5,
        qualityScore: 72,
        shortNights: 2,
      },
      alerts: [
        {
          id: "1",
          message: "You had 3 short nights last week. Try to maintain consistent sleep schedule.",
          severity: "warning",
          isViewed: false,
        },
        {
          id: "2",
          message: "Your fatigue levels are elevated. Consider improving your sleep environment.",
          severity: "info",
          isViewed: true,
        },
      ],
      advice: [
        {
          id: "1",
          message: "Try to maintain a consistent bedtime within 30 minutes every night",
          priority: 1,
        },
        {
          id: "2",
          message: "Reduce screen time 1 hour before bed",
          priority: 2,
        },
        {
          id: "3",
          message: "Keep your bedroom cool and dark",
          priority: 3,
        },
      ],
      goals: [
        {
          id: "1",
          name: "Sleep Duration",
          target: 8,
          current: 7.2,
          unit: "hours",
        },
        {
          id: "2",
          name: "Sleep Quality",
          target: 100,
          current: 72,
          unit: "%",
        },
      ],
      weeklySummary: {
        totalSleep: 50.4,
        avgQuality: 72,
        bestNight: 9.2,
        worstNight: 5.8,
      },
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard" }, { status: 500 })
  }
}
