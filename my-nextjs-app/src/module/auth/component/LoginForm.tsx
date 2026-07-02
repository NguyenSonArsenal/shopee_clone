"use client"

import FieldLabel from "@component/FieldLabel";
import {IconEmail, IconEye, IconEyeOff, IconLock, IconLogin} from "@icon";
import Link from "next/link";
import {useState} from "react";
import { useRouter } from 'next/navigation';
import { login } from "@module/auth/api/auth"
import DebugPanel from "@component/DebugPanel"
import Notification from "@component/Notification"

import {AUTH_CONFIG, ROUTES, STORAGE_KEYS} from "@/config/constant";

export default function LoginForm({}) {
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({ email: "", password: "" })
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")

  const validate = () => {
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email không được để trống"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không đúng định dạng"
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống"
    } else if (password.length < AUTH_CONFIG.MIN_PASSWORD_LENGTH) {
      newErrors.password = "Mật khẩu phải có ít nhất " +  AUTH_CONFIG.MIN_PASSWORD_LENGTH  + " ký tự"
    }

    setErrors(newErrors)

    // trả về true nếu không có lỗi nào
    return !newErrors.email && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log('// start validate')
    if (!validate()) return   // có lỗi → dừng lại
    console.log(email, password, '// input')

    setServerError("")
    setIsSubmitting(true)

    try {
      const data = await login({ email: email, password })
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token)
      localStorage.setItem(STORAGE_KEYS.USER_INFO, data.user.username)
      router.push(ROUTES.HOME)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Đăng nhập thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Đăng nhập</h1>

        <Notification type="error" message={serverError} />

        {/* Form */}
        <form className="login-form" noValidate onSubmit={handleSubmit}>

          {/* Email */}
          <div className="field-group">
            <FieldLabel htmlFor="email" required>Email</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconEmail/>
              </span>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          {/* Mật khẩu */}
          <div className="field-group">
            <FieldLabel htmlFor="password" required>Mật khẩu</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconLock/>
              </span>
              <input
                id="password"
                type={showPass ? "text" : "password"}
                className="field-input"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="field-eye"
                onClick={() => setShowPass(p => !p)}
                aria-label="Hiện/ẩn mật khẩu"
              >
                {showPass ? <IconEyeOff/> : <IconEye/>}
              </button>
            </div>
            {errors.password && <p className="field-error">{errors.password}</p>}
          </div>

          <div className="login-meta">
            <Link href="/forgot-password" className="forgot-link">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút đăng nhập */}
          <button type="submit" className="btn-login btn-primary" disabled={isSubmitting}>
            <IconLogin/>
            {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Link đăng ký */}
        <p className="login-register-link">
          Chưa có tài khoản?{" "}
          <Link href="/register">Đăng ký ngay</Link>
        </p>
        <p className="footer-text">banghang.net © 2026 &nbsp;·&nbsp; Tân Long Land</p>
      </div>

      <DebugPanel data={{ email, password, errors, isSubmitting, serverError }} />
    </div>
    )
}
