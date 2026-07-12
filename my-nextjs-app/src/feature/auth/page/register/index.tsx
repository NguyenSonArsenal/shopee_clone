"use client"

import { useState } from "react";
import FieldLabel from "@component/form/FieldLabel";
import {
  IconEmail,
  IconLock,
  IconEye,
  IconEyeOff,
  IconUser,
  IconPhone,
  IconLink,
  IconBuilding
} from "@icon";
import Link from "next/link";
import { USER_ROLES } from "@/config/constant";
import { ROUTES } from "@/config/route";

export default function RegisterForm() {
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [refCode, setRefCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agree, setAgree] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit registration:", {
      role,
      companyName,
      fullname,
      phone,
      email,
      refCode,
      password,
      confirmPassword,
      agree
    });
  };

  return (
    <div className="right">
      <div className="login-card" style={{ maxWidth: 520 }}>
        <h1 className="login-title text-center">Tạo tài khoản mới</h1>

        <form className="login-form" noValidate onSubmit={handleSubmit}>

          {/* Vai trò */}
          <div className="field-group">
            <FieldLabel htmlFor="role" required>Vai trò</FieldLabel>
            <div className="field-wrap">
              <span className="field-icon">
                <IconUser />
              </span>
              <select
                id="role"
                className="field-input select-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ appearance: "none", background: "transparent" }}
              >
                <option value="" disabled>Chọn vai trò</option>
                {USER_ROLES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tên công ty (Chỉ hiển thị khi chọn Công ty F2 - 'f2') */}
          {role === "f2" && (
            <div className="field-group">
              <FieldLabel htmlFor="companyName" required>Tên công ty</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconBuilding />
                </span>
                <input
                  id="companyName"
                  type="text"
                  className="field-input"
                  placeholder="Nhập tên công ty"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Họ và tên & Số điện thoại (Grid layout nếu màn hình rộng) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Họ và tên */}
            <div className="field-group">
              <FieldLabel htmlFor="fullname" required>Họ và tên</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconUser />
                </span>
                <input
                  id="fullname"
                  type="text"
                  className="field-input"
                  placeholder="Nguyễn Văn A"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                />
              </div>
            </div>

            {/* Số điện thoại */}
            <div className="field-group">
              <FieldLabel htmlFor="phone" required>Số điện thoại</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconPhone />
                </span>
                <input
                  id="phone"
                  type="tel"
                  className="field-input"
                  placeholder="0901234567"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Email & Mã giới thiệu */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                  placeholder="email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Mã giới thiệu */}
            <div className="field-group">
              <FieldLabel htmlFor="refCode">Mã giới thiệu</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconLink />
                </span>
                <input
                  id="refCode"
                  type="text"
                  className="field-input"
                  placeholder="Nhập mã giới thiệu"
                  value={refCode}
                  onChange={(e) => setRefCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Mật khẩu & Xác nhận mật khẩu */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Xác nhận mật khẩu */}
            <div className="field-group">
              <FieldLabel htmlFor="confirmPassword" required>Xác nhận mật khẩu</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconLock />
                </span>
                <input
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  className="field-input"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="field-eye"
                  onClick={() => setShowConfirmPass(p => !p)}
                  aria-label="Hiện/ẩn mật khẩu"
                >
                  {showConfirmPass ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Điều khoản */}
          <div className="terms" style={{ display: "flex", alignItems: "center", gap: 8, margin: "16px 0", fontSize: 13 }}>
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={{ cursor: "pointer" }}
            />
            <label htmlFor="agree" style={{ cursor: "pointer", color: "#666" }}>
              Tôi đồng ý với{" "}
              <Link href="/terms" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Điều khoản dịch vụ
              </Link>{" "}
              và{" "}
              <Link href="/privacy" target="_blank" style={{ color: "var(--primary)", textDecoration: "underline" }}>
                Chính sách bảo mật
              </Link>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Tạo tài khoản
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          Đã có tài khoản?{" "}
          <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
