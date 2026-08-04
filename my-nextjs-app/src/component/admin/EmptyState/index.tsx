"use client"

import Link from "next/link"
import { ReactNode } from "react"
import styles from "./index.module.scss"

type EmptyStateProps = {
  title?: string
  desc?: string
  icon?: ReactNode
  actionUrl?: string
  actionLabel?: string
  actionIcon?: string
}

export default function Index({
  title = "Chưa có dữ liệu",
  desc,
  icon,
  actionUrl,
  actionLabel = "Thêm mới",
  actionIcon = "fa-solid fa-plus",
}: EmptyStateProps) {
  return (
    <div className={styles.empty}>
      {icon}
      <div className={styles.emptyTitle}>{title}</div>
      {desc && <div className={styles.emptyDesc}>{desc}</div>}
      {actionUrl && (
        <Link href={actionUrl} className="btn btn-primary">
          <i className={actionIcon}/> {actionLabel}
        </Link>
      )}
    </div>
  )
}
