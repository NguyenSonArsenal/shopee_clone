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
  IconBuilding,
  IconCheckCircle,
  IconXCircle
} from "@icon";
import Link from "next/link";
import { Radio } from "antd";
import { ROUTES } from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import LegalAgreement from "@feature/auth/page/register/modal/LegalAgreement";
import {USER_ROLES} from "@/config/enum/user-role";
import AppSpin from "@component/AppSpin";
import {MESSAGE_SERVER_ERROR_DEFAULT, STORAGE_KEYS} from "@/config/constant";
import authApi from "@feature/auth/authApi";
import {USER_GENDER} from "@/config/enum/user-gender";
import {LENGTH} from "@/config/validate-length";
import {useRouter} from "next/navigation";
import Notification from "@component/Notification";
import FieldError from "@component/form/FieldError";
import InputTextCounter from "@component/form/InputTextCounter";
import { ToastContainer, useToast } from "@component/Toast";

export default function RegisterForm() {
  const [form, setForm] = useState(
    { type: "", company_name: "", full_name: "", phone: "", email: "", ref_code: "", password: "", password_confirmation: "", gender: "" }
  )
  const [errors, setErrors] = useState(
    { type: "", company_name: "", full_name: "", phone: "", email: "", ref_code: "", password: "", password_confirmation: "", gender: "" }
  )

  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agree, setAgree] = useState(false);

  const [openTermModal, setOpenTermModal] = useState(false)
  const [openPolicyModal, setOpenPolicyModal] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")
  const { toasts, showToast, closeToast } = useToast()

  const validate = () => {
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submit registration:", form);

    if (!validate()) return
    _clear()
    setIsSubmitting(true)
    try {
      const res = await authApi.register(toRegisterRequest(form));
      localStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, res?.message);
      router.push(ROUTES.LOGIN)
    } catch (err) {
      console.log(err.response, '// err.response?')
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        const fields = ["full_name", "gender", "type", "company_name", "phone", "password", "confirm_password"];
        setErrors((prev) => ({
          ...prev, ...Object.fromEntries(fields.map((f) => [f, serverErrors[f]?.[0] ?? ""])),
        }))
      } else {
        const errMsg = err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT;
        setServerError(errMsg);
      }
      setIsSubmitting(false)
    }
  };

  const _clear = () => {
    // setErrors({ email: "", password: "" })
    setServerError('')
  }

  const onChangeInputForm = (field) => (e) => {
    const newValue = e.target.value
    setForm(old => ({...old, [field]: newValue}))
  };

  const toRegisterRequest = (form) => {
    return {
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      password_confirmation: form.password_confirmation,
      gender: form.gender ? Number(form.gender) : "",
      type: form.type,
      company_name: form.role === USER_ROLES.F2.value ? form.company_name : undefined,
    }
  }


  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Tạo tài khoản mới</h1>

        <div style={{ display: "flex", justifyContent: "center", gap: 16, margin: "8px 0 16px" }}>
          <button
            type="button"
            onClick={() => showToast("success", "Thành công!")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--success)" }}
          >
            <IconCheckCircle className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => showToast("error", "Có lỗi xảy ra!")}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}
          >
            <IconXCircle className="w-6 h-6" />
          </button>
        </div>

        <Notification type="error" message={serverError} />

        <form className="login-form" noValidate onSubmit={handleSubmit}>
          {/* Vai trò */}
          <div>
            <div className="flex flex-row items-center gap-3">
              <FieldLabel htmlFor="type" required>Vai trò</FieldLabel>
              <Radio.Group
                id="type"
                className="role-radio-group"
                value={form.type}
                onChange={onChangeInputForm('type')}
                options={Object.values(USER_ROLES).map((item) => ({value: item.value, label: item.label}))}
              />
            </div>
            <FieldError message={errors.type}/>
          </div>

          {/* Tên công ty (Chỉ hiển thị khi chọn Công ty F2 - 'f2') */}
          {form.type === USER_ROLES.F2.value && (
            <div className="field-group">
              <FieldLabel htmlFor="companyName" required>Tên công ty</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconBuilding/>
                </span>
                <input
                  id="companyName"
                  type="text"
                  className="field-input"
                  placeholder="Nhập tên công ty"
                  value={form.company_name}
                  onChange={onChangeInputForm('company_name')}
                  maxLength={LENGTH.user.company_name}
                />
              </div>
              <InputTextCounter maxLength={LENGTH.user.company_name} value={form.company_name}/>
              <FieldError message={errors.company_name} />
            </div>
          )}

          {/* Họ và tên & Số điện thoại (Grid layout nếu màn hình rộng) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Họ và tên */}
            <div className="field-group">
              <FieldLabel htmlFor="full_name" required>Họ và tên</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconUser/>
                </span>
                <input
                  id="full_name"
                  type="text"
                  className="field-input"
                  placeholder="Nguyễn Văn A"
                  value={form.full_name}
                  onChange={onChangeInputForm('full_name')}
                  maxLength={LENGTH.user.full_name}
                />
              </div>
              <InputTextCounter maxLength={LENGTH.user.full_name} value={form.full_name}/>
              <FieldError message={errors.full_name}/>
            </div>

            {/* Số điện thoại */}
            <div className="field-group">
              <FieldLabel htmlFor="phone" required>Số điện thoại</FieldLabel>
              <div className="field-wrap">
                <span className="field-icon">
                  <IconPhone/>
                </span>
                <input
                  id="phone"
                  type="tel"
                  className="field-input"
                  placeholder="0901234567"
                  maxLength={LENGTH.user.phone}
                  value={form.phone}
                  onChange={onChangeInputForm('phone')}
                />
              </div>
              <InputTextCounter maxLength={LENGTH.user.phone} value={form.phone}/>
              <FieldError message={errors.phone}/>
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
                  maxLength={LENGTH.user.email}
                />
              </div>
              <InputTextCounter maxLength={LENGTH.user.email} value={form.email}/>
              <FieldError message={errors.email}/>
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
                  maxLength={LENGTH.user.ref_code}
                  onChange={onChangeInputForm('ref_code')}
                />
              </div>
              <InputTextCounter maxLength={LENGTH.user.ref_code} value={form.ref_code}/>
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
                  maxLength={LENGTH.user.password}
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
              <InputTextCounter maxLength={LENGTH.user.password} value={form.password}/>
              <FieldError message={errors.password}/>
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
                  value={form.password_confirmation}
                  maxLength={LENGTH.user.password_confirmation}
                  onChange={onChangeInputForm('password_confirmation')}
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
              <InputTextCounter maxLength={LENGTH.user.password_confirmation} value={form.password_confirmation}/>
              <FieldError message={errors.password_confirmation}/>
            </div>

            {/* Vai trò */}
            <div className="field-group">
              <div className="flex flex-row items-center gap-3">
                <FieldLabel htmlFor="role" required>Giới tính</FieldLabel>
                <Radio.Group
                  id="gender"
                  className="role-radio-group"
                  value={form.gender}
                  onChange={onChangeInputForm('gender')}
                  options={Object.values(USER_GENDER).map((item) => ({value: item.value, label: item.label}))}
                />
              </div>
              <FieldError message={errors.gender}/>
            </div>
          </div>

          <LegalAgreement checked={agree} setAgree={setAgree} />

          <button type="submit" className="btn btn-primary btn-submit disabled:cursor-not-allowed" disabled={isSubmitting}>
            {isSubmitting ? <AppSpin size="small" /> : ""}  Tạo tài khoản
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          Đã có tài khoản?{" "}
          <Link href={ROUTES.LOGIN}>Đăng nhập</Link>
        </p>
      </div>

      <DebugPanel data={{ openTermModal, openPolicyModal, agree, form  }} />
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}
