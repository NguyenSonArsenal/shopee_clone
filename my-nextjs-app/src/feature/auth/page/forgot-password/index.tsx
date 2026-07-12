"use client"

import Cookies from 'js-cookie'
import { useState } from "react";
import FieldLabel from "@component/form/FieldLabel";
import {IconEmail, IconLogin} from "@icon";
import Link from "next/link";
import {AUTH_CONFIG, STORAGE_KEYS} from "@/config/constant";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import {delay} from "@/helper/helper";
import axiosInstance from "@/lib/axios";
import {Spin} from "antd";
import {useRouter} from "next/navigation";
import Notification from "@component/Notification";
import authApi from "@feature/auth/authApi";
import AppSpin from "@component/AppSpin";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: ""})
  const [serverError, setServerError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Điều khiển màn hình chuyển đổi
  const router = useRouter()

  const validate = () => {
    return true
    const newErrors = { email: "", password: "" }

    if (!email) {
      newErrors.email = "Email không được để trống"
    } else if (!AUTH_CONFIG.EMAIL_REGEX.test(email)) {
      newErrors.email = "Email không đúng định dạng"
    }
    setErrors(newErrors)
    return !newErrors.email && !newErrors.password
  }

  const clearError = () => {
    setErrors({
      email: ""
    });
    setServerError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit forgot password with email:", email);
    setIsSubmitting(true)
    if (!validate()) {
      setIsSubmitting(false)
      return
    }
    clearError()
    try {
      const data = await authApi.forgotPasswordSendOtp(email)
      Cookies.set(STORAGE_KEYS.OTP_TTL, data.expires_at, { expires: new Date(data.expires_at) })
      Cookies.set(STORAGE_KEYS.OTP_IDENTIFIER_FIELD, email, {expires: new Date(data.expires_at)})
      return router.replace(ROUTES.FORGOT_PASSWORD_VERIFY)
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        setErrors({
          email: serverErrors.email ? serverErrors.email[0] : ""
        });
      } else {
        const errMsg = err.response?.data?.message || err.message || "Đăng nhập thất bại";
        setServerError(errMsg);
      }
      setIsSubmitting(false)
    }
  };

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Khôi phục mật khẩu</h1>

        <Notification type="error" message={serverError} />

        <form className="login-form" noValidate onSubmit={handleSubmit}>
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
                placeholder="email@company.vn"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-submit cursor-pointer disabled:cursor-not-allowed"
                  disabled={isSubmitting}>
            {isSubmitting ? <AppSpin size="small" /> : ""}
            {isSubmitting ? "Đang gửi mã OTP..." : "Gửi mã OTP"}
          </button>

        </form>

        <p className="login-register-link" style={{marginTop: 24}}>
          <Link href={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
        </p>
      </div>

      <DebugPanel data={{email, isSubmitting, errors, serverError}}/>
    </div>
  );
}
