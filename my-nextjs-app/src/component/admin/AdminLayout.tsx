"use client"

import { useState } from "react"
import AdminSidebar from "@component/admin/AdminSidebar"
import AdminTopbar, { BreadcrumbItem } from "@component/admin/AdminTopBar"

type AdminLayoutProps = {
  breadcrumb: readonly BreadcrumbItem[]
  children: React.ReactNode
  hideSidebar?: boolean
  sidebar?: React.ReactNode // Ghi đè sidebar mặc định (VD SettingsSidebar cho khu vực /cau-hinh-he-thong)
}

export default function AdminLayout({ breadcrumb, children, hideSidebar = false, sidebar }: AdminLayoutProps) {
  const [sbMini, setSbMini] = useState(false)

  return (
    <div className="admin-shell">
      {!hideSidebar && (sidebar ?? <AdminSidebar mini={sbMini} onToggle={() => setSbMini((v) => !v)} />)}
      <div className="admin-main">
        <AdminTopbar breadcrumb={breadcrumb} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
