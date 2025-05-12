"use client"

import { useState, useEffect } from "react"

interface TimerProps {
  duration: number // in seconds
  onExpire: () => void
}

export default function Timer({ duration, onExpire }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onExpire()
      return
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, onExpire])

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  // Calculate percentage for progress bar
  const percentage = (timeLeft / duration) * 100

  return (
    <div className="w-full max-w-md">
      <div className="text-2xl font-mono text-center mb-2">{formattedTime}</div>
      <div className="w-full bg-blue-900 rounded-full h-4 overflow-hidden">
        <div
          className={`h-full rounded-full ${timeLeft < 10 ? "bg-red-500" : "bg-blue-500"}`}
          style={{ width: `${percentage}%`, transition: "width 1s linear" }}
        ></div>
      </div>
    </div>
  )
}
