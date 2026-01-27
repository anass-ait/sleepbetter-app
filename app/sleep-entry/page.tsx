"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"

export default function SleepEntryPage() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    heureCoucher: "23:00",
    heureReveil: "07:00",
    humeur: "bon",
    fatigue: 5,
    commentaire: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "fatigue" ? Number.parseInt(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    try {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const response = await fetch("/api/sleep-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess("Sleep entry logged successfully! 🎉")
        setFormData({
          date: new Date().toISOString().split("T")[0],
          heureCoucher: "23:00",
          heureReveil: "07:00",
          humeur: "bon",
          fatigue: 5,
          commentaire: "",
        })
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Failed to log sleep entry")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 max-w-2xl">
        <div className="card-premium">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
              Log Your Sleep
            </h1>
            <p className="text-muted-foreground">Record your sleep data and track your progress</p>
          </div>

          {error && (
            <div className="bg-error/10 border border-error rounded-lg p-4 text-error mb-6 font-medium">{error}</div>
          )}

          {success && (
            <div className="bg-success/10 border border-success rounded-lg p-4 text-success mb-6 font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mood</label>
                <select name="humeur" value={formData.humeur} onChange={handleChange} className="input-premium">
                  <option value="excellent">Excellent</option>
                  <option value="bon">Good</option>
                  <option value="moyen">Average</option>
                  <option value="mauvais">Poor</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Bedtime</label>
                <input
                  type="time"
                  name="heureCoucher"
                  value={formData.heureCoucher}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Wake Time</label>
                <input
                  type="time"
                  name="heureReveil"
                  value={formData.heureReveil}
                  onChange={handleChange}
                  className="input-premium"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-foreground">Fatigue Level</label>
                <span className="text-sm font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {formData.fatigue}/10
                </span>
              </div>
              <input
                type="range"
                name="fatigue"
                min="1"
                max="10"
                value={formData.fatigue}
                onChange={handleChange}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>Rested</span>
                <span>Exhausted</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Additional Notes</label>
              <textarea
                name="commentaire"
                value={formData.commentaire}
                onChange={handleChange}
                placeholder="Any factors that affected your sleep? (caffeine, exercise, stress...)"
                className="input-premium resize-none"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary bg-gradient-to-r from-primary to-accent text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
            >
              {isLoading ? "Logging..." : "Log Sleep Entry"}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
