"use client"

import Link from "next/link"

type EmptyStateProps = {
  title?: string
  desc?: string
  actionUrl?: string
  actionLabel?: string
  actionIcon?: string
}

const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h11l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
    <path d="M14 4v5h5"/>
    <line x1="7.5" y1="12" x2="16.5" y2="12"/>
    <line x1="7.5" y1="16" x2="13" y2="16"/>
  </svg>
)

export default function EmptyState({
  title = "Chưa có dữ liệu",
  desc,
  actionUrl,
  actionLabel = "Thêm mới",
  actionIcon = "fa-solid fa-plus",
}: EmptyStateProps) {
  return (
    <div className="empty">
      {DEFAULT_ICON}
      <div className="empty-title">{title}</div>
      {desc && <div className="empty-desc">{desc}</div>}
      {actionUrl && (
        <Link href={actionUrl} className="btn btn-primary btn-sm">
          <i className={actionIcon}/> {actionLabel}
        </Link>
      )}
    </div>
  )
}
