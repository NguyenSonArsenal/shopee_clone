"use client"

import { Modal } from "antd"

type MyModalProps = {
  open: boolean
  title: string
  onClose: () => void
  confirmText?: string
  children: React.ReactNode
}

export default function MyModal({ open, title, onClose, confirmText = "Tôi đã đọc và hiểu", children }: MyModalProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={title}
      width={{ xl: "700px" }}
      footer={
        <button type="button" className="btn btn-primary cursor-pointer" onClick={onClose}>
          {confirmText}
        </button>
      }
      keyboard={false}
      mask={{ closable: false }}
      className="term-modal"
    >
      <div className="term-modal-body">
        {children}
      </div>
    </Modal>
  )
}
