"use client"

import { useEffect, useState } from "react"

type NotificationProps = {
  type: "success" | "error"
  message: string
}

export default function Notification({ type, message }: NotificationProps) {
  const [dismissed, setDismissed] = useState(false)

  // Có message mới thì phải hiện lại, dù trước đó đã bị đóng
  useEffect(() => {
    setDismissed(false)
  }, [message])

  if (!message || dismissed) return null

  return (
    <div className={type === "error" ? "alert alert-danger" : "alert alert-success"}>
      <span>{message}</span>
      <button
        type="button"
        className="alert-close"
        onClick={() => setDismissed(true)}
        aria-label="Đóng thông báo"
      >
        ×
      </button>
    </div>
  )
}
