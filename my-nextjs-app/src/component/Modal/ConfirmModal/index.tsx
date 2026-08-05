"use client"

import { ReactNode } from "react"
import {LABEL_CLOSE_MODAL, LABEL_CONFIRM_DELETE_MODAL} from "@/config/constant";

type ConfirmModalProps = {
  open: boolean
  title?: string
  message: ReactNode
  okText?: string
  cancelText?: string
  confirmLoading?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmModal({
  open,
  title = "Xác nhận",
  message,
  okText = LABEL_CONFIRM_DELETE_MODAL,
  cancelText = LABEL_CLOSE_MODAL,
  confirmLoading = false,
  onConfirm,
  onClose,
}: ConfirmModalProps) {
  if (!open) return null

  return (
    <div className="modal-bg open">
      <div className="modal modal-confirm">
        <div className="modal-head">
          <span>{title}</span>
          <button type="button" className="modal-close" aria-label={LABEL_CLOSE_MODAL} onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <p style={{ margin: 0, fontSize: "var(--fs-primary)", color: "var(--text)", lineHeight: 1.6 }}>{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-outline btn-sm" style={{fontSize: "var(--fs-primary)"}}
                  disabled={confirmLoading} onClick={onClose}>
            {cancelText}
          </button>
          <button type="button" className="btn btn-primary btn-sm" style={{fontSize: "var(--fs-primary)"}}
                  disabled={confirmLoading} onClick={onConfirm}>
            {okText}
          </button>
        </div>
      </div>
    </div>
  )
}
