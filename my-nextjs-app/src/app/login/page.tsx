"use client"

import Link from "next/link"
import FieldLabel from "@/component/FieldLabel"
import { useState } from "react"
import { IconLogin, IconEmail, IconLock, IconEye, IconEyeOff } from "@icon";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="login-page">

      {/* ══ CỘT TRÁI ════════════════════════════════════════════ */}
      <div className="left">
        {/* Logo */}
        <Link href="/" className="brand-logo">
          <div className="brand-icon-box">
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="brand-text">
            BANGHANG<span>.NET</span>
          </div>
        </Link>

        {/* Tagline */}
        <p className="brand-tagline">
          Nền tảng quản lý bảng hàng — kết nối nhà đầu tư, môi giới và khách hàng.
        </p>

        {/* Footer copyright */}
        <div className="left-footer">
          © 2026 Tân Long Land &nbsp;·&nbsp;
          <Link href="/">banghang.net</Link>
        </div>
      </div>

      {/* ══ CỘT PHẢI — Form đăng nhập ══════════════════════════════ */}
      <div className="right">
        <div className="login-card">

          {/* Tiêu đề */}
          <h1 className="login-title text-center">Đăng nhập</h1>

          {/* Form */}
          <form className="login-form" noValidate>

            {/* Email */}
            <div className="field-group">
              <FieldLabel htmlFor="email" required>Email</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconEmail />
                </span>
                <input
                  id="email"
                  type="email"
                  className="field-input"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mật khẩu */}
            <div className="field-group">
              <FieldLabel htmlFor="password" required>Mật khẩu</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconLock />
                </span>
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="field-input"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="field-eye"
                  onClick={() => setShowPass(p => !p)}
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <div className="login-meta">
              <Link href="/forgot-password" className="forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            {/* Nút đăng nhập */}
            <button type="submit" className="btn-login btn-primary">
              <IconLogin/>
              Đăng nhập
            </button>
          </form>

          {/* Link đăng ký */}
          <p className="login-register-link">
            Chưa có tài khoản?{" "}
            <Link href="/register">Đăng ký ngay</Link>
          </p>
          <p className="footer-text">banghang.net © 2026 &nbsp;·&nbsp; Tân Long Land</p>
        </div>
      </div>

    </div>
  )
}
