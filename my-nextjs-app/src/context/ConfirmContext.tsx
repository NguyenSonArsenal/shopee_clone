"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type ConfirmOptions = {
  title?: string
  message: string
  okText?: string
  cancelText?: string
  onOk?: () => void
  onClose?: () => void
}

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => void
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts)
  }

  const handleOk = () => {
    options?.onOk?.()
    setOptions(null)
  }

  const handleClose = () => {
    options?.onClose?.()
    setOptions(null)
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <div className={`modal-bg ${options ? "open" : ""}`}>
        <div className="modal modal-confirm">
          <div className="modal-head">
            <span>{options?.title || "Xác nhận"}</span>
            <button type="button" className="modal-close" onClick={handleClose} aria-label="Đóng">&times;</button>
          </div>
          <div className="modal-body">
            <p style={{ margin: 0, fontSize: "var(--fs-primary)", color: "var(--text)", lineHeight: 1.6 }}>
              {options?.message}
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-outline btn-md cursor-pointer" onClick={handleClose}>
              {options?.cancelText || "Đóng"}
            </button>
            <button type="button" className="btn btn-primary btn-md cursor-pointer" onClick={handleOk}>
              {options?.okText || "Đồng ý"}
            </button>
          </div>
        </div>
      </div>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm phải được gọi bên trong <ConfirmProvider>")
  return ctx
}
