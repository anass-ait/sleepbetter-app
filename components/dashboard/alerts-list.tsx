"use client"

interface Alert {
  id: string
  message: string
  severity: string
  isViewed: boolean
}

interface AlertsListProps {
  alerts: Alert[]
}

export default function AlertsList({ alerts }: AlertsListProps) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="card-premium text-center py-8">
        <div className="text-4xl mb-3">✨</div>
        <p className="text-muted-foreground font-medium">Your sleep looks great!</p>
        <p className="text-sm text-muted-foreground mt-1">No alerts at this time. Keep maintaining your routine.</p>
      </div>
    )
  }

  return (
    <div className="card-premium">
      <h2 className="text-xl font-bold text-foreground mb-6">Recent Alerts</h2>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 flex gap-3 ${
              alert.severity === "critical"
                ? "border-l-error bg-error/5 border border-error/20"
                : alert.severity === "warning"
                  ? "border-l-warning bg-warning/5 border border-warning/20"
                  : "border-l-accent bg-accent/5 border border-accent/20"
            }`}
          >
            <div className="text-xl flex-shrink-0">
              {alert.severity === "critical" ? "🔴" : alert.severity === "warning" ? "⚠️" : "ℹ️"}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1 capitalize">{alert.severity} Alert</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
