"use client"

import { useState } from "react";
import FieldLabel from "@component/FieldLabel";
import {IconEmail, IconLogin} from "@icon";
import Link from "next/link";
import {AUTH_CONFIG} from "@/config/constant";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import {delay} from "@/helper/helper";
import axiosInstance from "@/lib/axios";
import {Spin} from "antd";
import {useRouter} from "next/navigation";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" })
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit forgot password with email:", email);
    setIsSubmitting(true)
    delay(1000)
    if (!validate()) {
      setIsSubmitting(false)
      return
    }
    console.log('pass validate')
    try {
      return router.push('/forgot-password/verify')
      const response = await axiosInstance.post('forgot-password/send-otp', {
        email: email,
      });
      console.log(response, '// response')
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        setErrors({
          email: serverErrors.email ? serverErrors.email[0] : "",
          password: serverErrors.password ? serverErrors.password[0] : "",
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
                placeholder="email@company.vn"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <p className="field-error">{errors.email}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
            {isSubmitting ? <Spin size="small"/> : ""}
            {isSubmitting ? "Đang gửi mã OTP..." : "Gửi mã OTP"}
          </button>

        </form>

        <p className="login-register-link" style={{marginTop: 24}}>
          <Link href={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
        </p>
      </div>

      <DebugPanel data={{email, isSubmitting, errors}}/>
    </div>
  );
}
