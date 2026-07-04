"use client"

import { useState } from "react";
import FieldLabel from "@component/FieldLabel";
import { IconEmail } from "@icon";
import Link from "next/link";
import { ROUTES } from "@/config/constant";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit forgot password with email:", email);
  };

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Khôi phục mật khẩu</h1>
        <p className="text-center" style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
          Nhập email của bạn để nhận liên kết khôi phục mật khẩu.
        </p>

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
          </div>

          <button type="submit" className="btn btn-primary btn-submit" style={{ marginTop: 8 }}>
            Gửi mã OTP
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          <Link href={ROUTES.LOGIN}>← Quay lại đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
