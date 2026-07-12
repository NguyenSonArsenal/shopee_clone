"use client"

import FieldLabel from "@component/form/FieldLabel";
import {IconEye, IconEyeOff, IconLock} from "@icon";
import Link from "next/link";
import {ROUTES} from "@/config/route";
import {useState} from "react";
import DebugPanel from "@component/DebugPanel";
import {STORAGE_KEYS} from "@/config/constant";
import AppSpin from "@component/AppSpin";
import FieldError from "@component/form/FieldError";
import authApi from "@feature/auth/authApi";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation";
import Notification from "@component/Notification";

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState<string>("")
  const [password_confirmation, setPasswordConfirmation] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState<boolean>(false)

  const [errors, setErrors] = useState({ password: "", password_confirmation: ""})
  const [serverError, setServerError] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const validate = () => {
    return true
    const newErrors = { password: "", password_confirmation: "" }

    if (!password) {
      newErrors.password = "Trường mật khẩu mới không được để trống"
    }
    if (!password_confirmation) {
      newErrors.password_confirmation = "Trường xác nhận mật khẩu không được để trống"
    }
    setErrors(newErrors)
    return !newErrors.password_confirmation && !newErrors.password
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return
    }
    reset()
    setIsSubmitting(true)
    try {
      const res = await authApi.forgotPasswordReset(Cookies.get(STORAGE_KEYS.RESET_TOKEN), password, password_confirmation)
      console.log(res, '// res')
      Cookies.remove(STORAGE_KEYS.RESET_TOKEN)
      localStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, "Đổi mật khẩu thành công. Vui lòng đăng nhập lại.")
      return router.replace(ROUTES.LOGIN)
    } catch (err) {
      const serverErrors = err.response?.data?.errors;
      if (serverErrors) {
        setErrors({
          password: serverErrors.password ? serverErrors.password[0] : "",
          password_confirmation: serverErrors.password_confirmation ? serverErrors.password_confirmation[0] : "",
        });
      } else {
        const errMsg = err.response?.data?.message || err.message || "Đặt lại mật khẩu thất bại";
        setServerError(errMsg);
      }
      setIsSubmitting(false)
    }
  }

  const reset = () => {
    setServerError("")
    setErrors({password: "", password_confirmation: ""})
  }

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Đặt lại mật khẩu</h1>

        <Notification type="error" message={serverError} />

        <form className="login-form" noValidate onSubmit={handleSubmit}>

          {/* Mật khẩu mới*/}
          <div className="field-group">
            <FieldLabel htmlFor="password" required>Mật khẩu mới</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconLock/>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
                autoFocus={true}
              />
              <button
                type="button"
                className="field-eye"
                aria-label="Hiện/ẩn mật khẩu"
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <IconEyeOff/> : <IconEye/>}
              </button>
            </div>
            <FieldError message={errors.password}/>
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
                type={showPasswordConfirmation ? "text" : "password"}
                className="field-input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={password_confirmation}
                onChange={e => setPasswordConfirmation(e.target.value)}
              />
              <button
                type="button"
                className="field-eye"
                aria-label="Hiện/ẩn mật khẩu"
                onClick={() => setShowPasswordConfirmation(p => !p)}
              >
                {showPasswordConfirmation ? <IconEyeOff/> : <IconEye/>}
              </button>
            </div>
            <FieldError message={errors.password_confirmation}/>
          </div>

          <button type="submit" className="btn btn-primary btn-submit cursor-pointer disabled:cursor-not-allowed"
                  disabled={isSubmitting}>
            {isSubmitting ? <AppSpin size="small"/> : ""}
            {isSubmitting ? "Đang đặt lại mật khẩu..." : "Đặt lại mật khẩu"}
          </button>
        </form>

        <p className="login-register-link" style={{marginTop: 24}}>
          <Link href={ROUTES.LOGIN}>Quay lại đăng nhập</Link>
        </p>


        <DebugPanel data={{password, password_confirmation, showPassword, showPasswordConfirmation, isSubmitting, errors, serverError}}/>
      </div>
    </div>
  )
}
