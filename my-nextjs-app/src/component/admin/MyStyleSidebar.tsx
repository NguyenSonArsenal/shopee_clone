"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ROUTES } from "@/config/route"

const MY_STYLE_MENU = [
  { label: "Danh sách", href: ROUTES.MY_STYLE },
  { label: "Thêm mới", href: null },
]

export default function MyStyleSidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      <div className="sb-logo">
        <div className="sb-logo-icon">
          <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
        <div className="sb-logo-text">
          <div className="sb-logo-name">CRM</div>
          <div className="sb-logo-sub">TÂN LONG LAND</div>
        </div>
      </div>

      <div className="sb-layers">
        <div className="sp-head">
          <span className="sp-head-title">
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Giao diện mẫu
          </span>
        </div>
        {MY_STYLE_MENU.map((item) =>
          item.href ? (
            <Link key={item.href} href={item.href} className={`sb-a ${pathname === item.href ? "active" : ""}`}>
              <span className="sb-a-label">{item.label}</span>
            </Link>
          ) : (
            <span key={item.label} className="sb-a disabled">
              <span className="sb-a-label">{item.label}</span>
            </span>
          )
        )}
      </div>
    </aside>
  )
}
