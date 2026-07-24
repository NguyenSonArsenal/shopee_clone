"use client"

import { useEffect, useRef, useState } from "react"
import { IconCheckCircle, IconXCircle } from "@icon"

export type ToastType = "success" | "error"
type ToastItem = { id: number; type: ToastType; message: string }

const TOAST_DURATION = 5000

function ToastCard({ toast, onClose }: { toast: ToastItem; onClose: (id: number) => void }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShow(true)))
    const hideTimer = setTimeout(() => setShow(false), TOAST_DURATION)
    const removeTimer = setTimeout(() => onClose(toast.id), TOAST_DURATION + 300)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hideTimer)
      clearTimeout(removeTimer)
    }
  }, [toast.id, onClose])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => onClose(toast.id), 300)
  }

  return (
    <div className={`toast ${toast.type} ${show ? "show" : ""}`}>
      {toast.type === "success" ? <IconCheckCircle className="toast-icon" /> : <IconXCircle className="toast-icon" />}
      <span className="toast-msg">{toast.message}</span>
      <button type="button" className="toast-close" onClick={handleClose} aria-label="Đóng">×</button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const showToast = (type: ToastType, message: string) => {
    idRef.current += 1
    setToasts((prev) => [...prev, { id: idRef.current, type, message }])
  }

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, showToast, closeToast }
}

type ToastContainerProps = {
  toasts: ToastItem[]
  onClose: (id: number) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map((t) => <ToastCard key={t.id} toast={t} onClose={onClose} />)}
    </div>
  )
}
