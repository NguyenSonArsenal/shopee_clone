"use client"

import {ReactNode, useEffect, useState} from "react"
import {TOAST, ToastTypeValue} from "@/config/constant";

type ToastItem = { id: number; type: ToastTypeValue; message: string }

const TOAST_DURATION = TOAST.TIMEOUT * 1000

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

  const addExclamation = (text: ReactNode) => {
    if (typeof text !== "string") {
      return text;
    }

    const trimmed = text.trim();
    return trimmed.endsWith("!") ? trimmed : `${trimmed}!`;
  };

  return (
    <div className={`toast ${toast.type} ${show ? "show" : ""}`}>
      <i className={`fa-solid ${toast.type === "success" ? "fa-circle-check" : "fa-circle-xmark"} toast-icon`}/>
      <span className="toast-msg">{ addExclamation(toast.message)}</span>
      <button type="button" className="toast-close" onClick={handleClose} aria-label="Đóng">×</button>
    </div>
  )
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
