"use client"

import { useState } from "react"
import AdminSidebar from "@component/admin/AdminSidebar"
import AdminTopbar, { BreadcrumbItem } from "@component/admin/AdminTopBar"

type AdminLayoutProps = {
  breadcrumb: readonly BreadcrumbItem[]
  children: React.ReactNode
}

export default function AdminLayout({ breadcrumb, children }: AdminLayoutProps) {
  const [sbMini, setSbMini] = useState(false)

  return (
    <div className="admin-shell">
      <AdminSidebar mini={sbMini} onToggle={() => setSbMini((v) => !v)} />
      <div className="admin-main">
        <AdminTopbar breadcrumb={breadcrumb} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  )
}
