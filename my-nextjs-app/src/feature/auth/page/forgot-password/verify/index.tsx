"use client"

import {useEffect, useRef, useState} from "react";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import Cookies from 'js-cookie'
import {STORAGE_KEYS} from "@/config/constant";
import authApi from "@feature/auth/authApi";
import {useRouter} from "next/navigation";
import Notification from "@component/Notification";
import AppSpin from "@component/AppSpin";
import {OTP_MAX_ATTEMPTS} from "@/config/error-code";
import FieldError from "@component/form/FieldError";

type OtpVerifyFormProps = {
  email: string
  initialTimeLeft: number
}

export default function OtpVerifyForm({ email, initialTimeLeft }: OtpVerifyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false)
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [countResend, setCountResend] = useState(0)
  const router = useRouter();
  const [serverError, setServerError] = useState("")
  const [errors, setErrors] = useState({otp: ""})


  useEffect(() => {
    let timer = setInterval(() => {
      setTimeLeft(timeLeft => {
        if (timeLeft <= 0) {
          clearInterval(timer)
          return 0
        }
        return timeLeft - 1
      })
    }, 1000);
    return () => clearInterval(timer)
  }, [countResend]);

  // Refs to control each digit input element
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handlePaste = (e) => {
    const pastedCode = e.clipboardData.getData('text');
    if (pastedCode.length === 6) {
      setOtp(pastedCode);
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = pastedCode.charAt(index);
      });
    }
  }

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) {
      e.target.value = "";
      return;
    }
    const arr = otp.split('')
    arr[index] = value
    const tmp = arr.join('')
    setOtp(tmp)
    if (value && index < inputRefs.length - 1) {
      inputRefs[index+1].current.focus()
    }
  }

  // delete back
  const handleKeyDown = (e, index) => {
    if (e.key == "Backspace" && e.target.value == "" && index > 0) {
      inputRefs[index-1].current.focus()
    }
  }

  const handleResend = async () => {
    setIsSubmitting(false)
    setOtp("")
    setServerError("")
    setIsResending(true)
    try {
      const data = await authApi.forgotPasswordSendOtp(email)
      Cookies.set(STORAGE_KEYS.OTP_TTL, data.otp_expires_at, { expires: new Date(data.otp_expires_at) })
      Cookies.set(STORAGE_KEYS.OTP_IDENTIFIER_FIELD, email, {expires: new Date(data.otp_expires_at)})
      const initialTimeLeft = Math.floor(Math.max(0, (data.expires_at - Date.now()) / 1000));
      setTimeLeft(initialTimeLeft)
      setCountResend(v => v + 1)
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Đăng nhập thất bại";
      setServerError(errMsg);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setServerError('');
    try {
      const data = await authApi.forgotPasswordVerifyOtp(email, otp);
      Cookies.set(STORAGE_KEYS.RESET_TOKEN, data.reset_token, { expires: new Date(data.reset_token_expires_at) })
      setIsSubmitting(false)
      return router.replace(ROUTES.FORGOT_PASSWORD_FORM_RESET)
    } catch (err) {
      const res = err.response?.data
      inputRefs.forEach((inputRef, index) => {
        inputRef.current.value = "";
      });
      if (res?.error_code == OTP_MAX_ATTEMPTS) {
        // Cookies.remove(STORAGE_KEYS.OTP_TTL)
        // Cookies.remove(STORAGE_KEYS.OTP_IDENTIFIER_FIELD)
        setTimeLeft(0)
      } else {
        inputRefs[0].current.focus()
      }
      const errMsg = res?.message || err.message || "Lỗi hệ thống";
      setServerError(errMsg);
      setIsSubmitting(false)
      setOtp("")

    }
  }

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Xác thực email</h1>

        <div className="flex justify-center gap-1.5 mb-6">
          <span className="w-6 h-1 bg-(--red) rounded-full"></span>
          <span className="w-6 h-1 bg-(--red) rounded-full"></span>
        </div>

        <p className="text-center text-sm text-gray-500 leading-relaxed mb-2">
          {
            timeLeft > 0 ?
            <>Mã 6 số đã được gửi đến <strong>{email}</strong><br />. Hết hạn sau <span className="font-bold text-(--red)">{timeLeft}</span> giây</>
            :
            <button type="button" disabled={isResending}
                    className="btn-submit font-semibold text-(--red) hover:text-(--red-dark) cursor-pointer disabled:cursor-not-allowed"
                    onClick={handleResend}
            >
              Gửi lại <>{isResending ? <AppSpin size="small" color="var(--red)" /> : ""}</>
            </button>
          }

        </p>

        <Notification type="error" message={serverError} />

        <form className="mt-4" noValidate onSubmit={handleSubmit}>
          <div className="field-group">
            <div className="flex justify-between gap-2 mb-6">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                  key={index}
                  onChange={(e) => handleChange(e, index)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  ref={inputRefs[index]}
                  onPaste={handlePaste}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  autoFocus={index === 0}
                  className="w-10 h-10 text-center text-sm font-bold border border-gray-200 rounded-xl focus:border-(--red)
                focus:outline-none transition-colors shadow-xs"
                />
              ))}
            </div>
            <FieldError message={errors.otp} />
          </div>

            <button type="submit" className="btn btn-primary btn-submit cursor-pointer disabled:cursor-not-allowed"
                    disabled={otp.length !== 6 || timeLeft <= 0 || isSubmitting}>
              {isSubmitting ? <AppSpin size="small" /> : ""}
              {isSubmitting ? "Đang xác nhận..." : "Xác nhận"}
            </button>
        </form>
      </div>

      <DebugPanel data={{otp, isSubmitting, countResend, timeLeft}}/>
    </div>
  );
}
