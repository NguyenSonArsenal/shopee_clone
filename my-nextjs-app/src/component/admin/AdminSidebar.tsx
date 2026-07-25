"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/config/route"

type AdminSidebarProps = {
  mini: boolean
  onToggle: () => void
}

const ORG_MENU = [
  { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
  { label: "Thông tin Văn phòng", href: ROUTES.ORGANIZATION_OFFICE },
  { label: "Thông tin Nhánh", href: ROUTES.ORGANIZATION_BRANCH },
  { label: "Thông tin Phòng ban", href: ROUTES.ORGANIZATION_DEPARTMENT },
  { label: "Đội nhóm", href: ROUTES.ORGANIZATION_TEAM },
  { label: "Chức vụ", href: ROUTES.ORGANIZATION_POSITION },
  { label: "Sơ đồ tổ chức", href: ROUTES.ORGANIZATION_CHART },
  { label: "Cấu hình", href: ROUTES.ORGANIZATION_CONFIG },
]

export default function AdminSidebar({ mini, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className={`sidebar ${mini ? "mini" : ""}`}>
      <div className="sb-logo">
        <div className="sb-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div className="sb-logo-text">
          <div className="sb-logo-name">CRM</div>
          <div className="sb-logo-sub">TÂN LONG LAND</div>
        </div>
        <button className="sb-toggle" onClick={onToggle} title="Thu gọn / Mở rộng menu">
          <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      </div>

      <div className="sb-layers">
        <div className="sp-head">
          <span className="sp-head-title">
            <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h1m4 0h1m-6 4h1m4 0h1m-6 4h1m4 0h1"/></svg>
            Cơ cấu tổ chức
          </span>
        </div>
        {ORG_MENU.map((item) => {
          const isActive = pathname === item.href || (item.href !== ROUTES.ORGANIZATION_COMPANY && pathname?.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} className={`sb-a ${isActive ? "active" : ""}`}>
              <span className="sb-a-label">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
