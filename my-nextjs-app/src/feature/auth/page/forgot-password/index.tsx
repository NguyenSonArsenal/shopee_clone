"use client"

import { useState } from "react";
import FieldLabel from "@component/FieldLabel";
import { IconEmail } from "@icon";
import Link from "next/link";
import {AUTH_CONFIG, ROUTES} from "@/config/constant";
import DebugPanel from "@component/DebugPanel";
import {delay} from "@/helper/helper";
import axiosInstance from "@/lib/axios";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Điều khiển màn hình chuyển đổi

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
    const response = await axiosInstance.post('forgot-password/send-otp', {
      email: email,
    });
    console.log(response, '// response')
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
                <IconEmail />
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

          <button type="submit" className="btn btn-primary btn-submit" style={{ marginTop: 8 }}>
            Gửi mã OTP
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          <Link href={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
        </p>
      </div>

      <DebugPanel data={{ email, isSubmitting, errors }} />
    </div>
  );
}
