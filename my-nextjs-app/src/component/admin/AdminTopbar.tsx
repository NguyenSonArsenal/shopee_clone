"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { STORAGE_KEYS } from "@/config/constant"
import { ROUTES } from "@/config/route"

export type BreadcrumbItem = { label: string; href?: string }

type AdminTopbarProps = {
  breadcrumb: BreadcrumbItem[]
}

export default function AdminTopbar({ breadcrumb }: AdminTopbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [username, setUsername] = useState("Super Admin")
  const [role, setRole] = useState("super_admin")
  const [email, setEmail] = useState("admin@propcam.com")
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO)
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr)
        setUsername(user.full_name || user.username || "Super Admin")
        setRole(user.role || "super_admin")
        setEmail(user.email || "admin@propcam.com")
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_INFO)
    router.replace(ROUTES.LOGIN)
  }

  return (
    <header className="topbar">
      <div className="breadcrumb">
        {breadcrumb.map((item, index) => {
          const isLast = index === breadcrumb.length - 1
          return (
            <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {isLast || !item.href ? (
                <span className={isLast ? "current" : ""}>{item.label}</span>
              ) : (
                <Link href={item.href}>{item.label}</Link>
              )}
              {!isLast && <span>/</span>}
            </span>
          )
        })}
      </div>

      <div className="topbar-right">
        <Link href={ROUTES.HOME} className={`tb-btn ${pathname === ROUTES.HOME ? "active" : ""}`} title="Dashboard">
          <i className="fa-solid fa-house"/>
        </Link>

        <button type="button" className="tb-btn" title="Thông báo" style={{ position: "relative" }}>
          <i className="fa-solid fa-bell"/>
          <span className="notif-dot"/>
        </button>

        <button type="button" className="tb-btn" title="Cá nhân">
          <i className="fa-solid fa-user"/>
        </button>

        <button type="button" className="tb-btn" title="Modules">
          <svg viewBox="0 -960 960 960" style={{ width: 24, height: 24, fill: "currentColor", stroke: "none", opacity: .85 }}>
            <path d="M183.5-183.5Q160-207 160-240t23.5-56.5Q207-320 240-320t56.5 23.5Q320-273 320-240t-23.5 56.5Q273-160 240-160t-56.5-23.5Zm240 0Q400-207 400-240t23.5-56.5Q447-320 480-320t56.5 23.5Q560-273 560-240t-23.5 56.5Q513-160 480-160t-56.5-23.5Zm240 0Q640-207 640-240t23.5-56.5Q687-320 720-320t56.5 23.5Q800-273 800-240t-23.5 56.5Q753-160 720-160t-56.5-23.5Zm-480-240Q160-447 160-480t23.5-56.5Q207-560 240-560t56.5 23.5Q320-513 320-480t-23.5 56.5Q273-400 240-400t-56.5-23.5Zm240 0Q400-447 400-480t23.5-56.5Q447-560 480-560t56.5 23.5Q560-513 560-480t-23.5 56.5Q513-400 480-400t-56.5-23.5Zm240 0Q640-447 640-480t23.5-56.5Q687-560 720-560t56.5 23.5Q800-513 800-480t-23.5 56.5Q753-400 720-400t-56.5-23.5Zm-480-240Q160-687 160-720t23.5-56.5Q207-800 240-800t56.5 23.5Q320-753 320-720t-23.5 56.5Q273-640 240-640t-56.5-23.5Zm240 0Q400-687 400-720t23.5-56.5Q447-800 480-800t56.5 23.5Q560-753 560-720t-23.5 56.5Q513-640 480-640t-56.5-23.5Zm240 0Q640-687 640-720t23.5-56.5Q687-800 720-800t56.5 23.5Q800-753 800-720t-23.5 56.5Q753-640 720-640t-56.5-23.5Z"/>
          </svg>
        </button>

        <button type="button" className="tb-btn" title="Cài đặt">
          <i className="fa-solid fa-gear"/>
        </button>

        <button type="button" className="tb-btn" title="Thông tin cá nhân">
          <i className="fa-solid fa-circle-info"/>
        </button>

        <div ref={profileRef} style={{ position: "relative" }}>
          <button type="button" className={`profile-btn ${profileOpen ? "open" : ""}`} onClick={() => setProfileOpen((v) => !v)}>
            <span className="profile-greet">
              <span className="profile-hello">Xin chào <b>{username}</b></span>
              <span className="profile-sub">{role}</span>
            </span>
            <div className="profile-av">{username[0]?.toUpperCase() || "A"}</div>
            <svg className="profile-chev" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </button>

          <div className={`profile-dd ${profileOpen ? "open" : ""}`}>
            <div className="pd-head">
              <div className="pd-av" style={{ position: "relative" }}>
                {username[0]?.toUpperCase() || "U"}
                <span className="pd-online"/>
              </div>
              <div className="pd-info">
                <div className="pd-name">{username}</div>
                <div className="pd-email">{email}</div>
                <span className="pd-role">{role}</span>
              </div>
            </div>
            <div className="pd-menu">
              <Link href={ROUTES.PROFILE} className="pd-item" onClick={() => setProfileOpen(false)}>
                <div className="pd-ico"><i className="fa-solid fa-user" style={{ color: "var(--primary)", fontSize: 14 }}/></div>
                Thông tin của tôi
              </Link>
              <Link href="#" className="pd-item" onClick={() => setProfileOpen(false)}>
                <div className="pd-ico"><i className="fa-solid fa-id-card" style={{ color: "#16a34a", fontSize: 14 }}/></div>
                Danh thiếp
              </Link>
              <Link href={ROUTES.CHANGE_PASSWORD} className="pd-item" onClick={() => setProfileOpen(false)}>
                <div className="pd-ico"><i className="fa-solid fa-lock" style={{ color: "#2563eb", fontSize: 14 }}/></div>
                Mật khẩu, xác thực
              </Link>
              <div className="pd-sep"/>
              <button type="button" className="pd-item out" onClick={handleLogout}>
                <div className="pd-ico"><i className="fa-solid fa-right-from-bracket" style={{ color: "#dc2626", fontSize: 14 }}/></div>
                Thoát
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
