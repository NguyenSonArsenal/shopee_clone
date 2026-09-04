"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CONFIG_GROUPS } from "@feature/settings/configGroups"

export default function SettingsSidebar() {
  const pathname = usePathname()

  // Mở sẵn nhóm chứa trang đang xem, không có thì mở nhóm đầu tiên
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    const activeGroup = CONFIG_GROUPS.find((g) => g.links.some((l) => l.href && pathname?.startsWith(l.href)))
    return activeGroup?.title ?? CONFIG_GROUPS[0]?.title ?? null
  })

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
            <svg viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            Cài đặt hệ thống
          </span>
        </div>

        {CONFIG_GROUPS.map((group) => {
          const isOpen = openGroup === group.title
          const hasActive = group.links.some((l) => l.href && pathname?.startsWith(l.href))
          return (
            <div key={group.title} className={`sb-group ${isOpen ? "open" : ""} ${hasActive ? "has-active" : ""}`}>
              <button type="button" className="sb-group-head" onClick={() => setOpenGroup(isOpen ? null : group.title)}>
                <span>{group.title}</span>
                <svg className="sb-group-chev" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>

              {isOpen && (
                <div className="sb-group-items">
                  {group.links.map((link) => {
                    const isActive = !!link.href && pathname?.startsWith(link.href)
                    return link.href ? (
                      <Link key={link.label} href={link.href} className={`sb-sub-a ${isActive ? "active" : ""}`}>
                        {link.label}
                      </Link>
                    ) : (
                      <span key={link.label} className="sb-sub-a disabled">{link.label}</span>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </aside>
  )
}
