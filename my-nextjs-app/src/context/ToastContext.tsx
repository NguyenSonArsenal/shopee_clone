"use client"

import { createContext, useContext, useRef, useState, ReactNode } from "react"
import { ToastContainer, ToastType } from "@component/Toast"

type ToastItem = { id: number; type: ToastType; message: string }

type ToastContextValue = {
  showToast: (type: ToastType, message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const showToast = (type: ToastType, message: string) => {
    idRef.current += 1
    setToasts((prev) => [...prev, { id: idRef.current, type, message }])
  }

  const closeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast phải được gọi bên trong <ToastProvider>")
  return ctx
}
