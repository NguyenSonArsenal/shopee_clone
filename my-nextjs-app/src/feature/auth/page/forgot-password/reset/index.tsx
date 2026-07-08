"use client"

import FieldLabel from "@component/FieldLabel";
import {IconEye, IconLock, IconLogin} from "@icon";
import Link from "next/link";
import {ROUTES} from "@/config/constant";

export default function ResetPasswordForm() {
  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Đặt lại mật khẩu</h1>

        <form className="login-form" noValidate>

          {/* Mật khẩu */}
          <div className="field-group">
            <FieldLabel htmlFor="password" required>Mật khẩu mới</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconLock/>
              </span>
              <input
                id="password"
                type="password"
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="field-eye"
                aria-label="Hiện/ẩn mật khẩu"
              >
                <IconEye/>
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="field-group">
            <FieldLabel htmlFor="confirmPassword" required>Xác nhận mật khẩu</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconLock/>
              </span>
              <input
                id="confirmPassword"
                type="password"
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="field-eye"
                aria-label="Hiện/ẩn mật khẩu"
              >
                <IconEye/>
              </button>
            </div>
          </div>

          {/* Nút submit */}
          <button type="submit" className="btn btn-primary btn-submit">
            <IconLogin />
            Đặt lại mật khẩu
          </button>
        </form>

        <p className="login-register-link" style={{marginTop: 24}}>
          <Link href={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
