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
import { Radio } from "antd";
import { ROUTES } from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import LegalAgreement from "@feature/auth/page/register/modal/LegalAgreement";
import {USER_ROLES} from "@/config/enum/user-role";

export default function RegisterForm() {
  const [form, setForm] = useState(
    { role: "", company_name: "", full_name: "", phone: "", email: "", ref_code: "", password: "", confirm_password: "" }
  )

  console.log('Component RegisterForm re-render')

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agree, setAgree] = useState(false);

  const [openTermModal, setOpenTermModal] = useState(false)
  const [openPolicyModal, setOpenPolicyModal] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit registration:", form);
  };

  const onChangeInputForm = (field) => (e) => {
    setForm(old => ({...old, [field]: e.target.value}))
  };

  return (
    <div className="right">
      <div className="login-card" style={{ maxWidth: 600 }}>
        <h1 className="login-title text-center">Tạo tài khoản mới</h1>

        <form className="login-form" noValidate onSubmit={handleSubmit}>

          {/* Vai trò */}
          <div className="flex flex-row items-center gap-3">
            <FieldLabel htmlFor="role" required>Vai trò</FieldLabel>
            <Radio.Group
              id="role"
              className="role-radio-group"
              value={form.role}
              onChange={onChangeInputForm('role')}
              options={Object.values(USER_ROLES).map((item) => ({ value: item.value, label: item.label }))}
            />
          </div>

          {/* Tên công ty (Chỉ hiển thị khi chọn Công ty F2 - 'f2') */}
          {form.role === USER_ROLES.F2.value && (
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
                  value={form.company_name}
                  onChange={onChangeInputForm('company_name')}
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
                  value={form.full_name}
                  onChange={onChangeInputForm('full_name')}
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
                  value={form.phone}
                  onChange={onChangeInputForm('phone')}
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
                  value={form.email}
                  onChange={onChangeInputForm('email')}
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
                  value={form.ref_code}
                  onChange={onChangeInputForm('ref_code')}
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
                  value={form.password}
                  onChange={onChangeInputForm('password')}
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
                  value={form.confirm_password}
                  onChange={onChangeInputForm('confirm_password')}
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

          <LegalAgreement checked={agree} setAgree={setAgree} />

          <button type="submit" className="btn btn-primary btn-submit">
            Tạo tài khoản
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          Đã có tài khoản?{" "}
          <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
      </div>

      <DebugPanel data={{ openTermModal, openPolicyModal, agree, form  }} />
    </div>
  );
}
