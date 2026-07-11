"use client"

import Link from "next/link";
import {useEffect, useRef, useState} from "react";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import Cookies from 'js-cookie'
import {STORAGE_KEYS} from "@/config/constant";

export default function OtpVerifyForm() {
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [countResend, setCountResend] = useState(0)

  useEffect(() => {
    console.log('useEffect')
    const expiresAt = Cookies.get(STORAGE_KEYS.OTP_TTL);
    const initTimeLeft = Math.floor(Math.max(0, (expiresAt - Date.now()) / 1000));
    setTimeLeft(initTimeLeft)
    let timer = setInterval(() => {
      console.log('timer')
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
    setIsSubmitDisabled(tmp.length != 6)
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

  const handleResend = () => {
    setCountResend(v => v + 1)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert(otp)
  }

  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Xác thực email</h1>

        <div className="flex justify-center gap-1.5 mb-6">
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
        </div>

        <p className="text-center text-sm text-gray-500 leading-relaxed">
          Mã 6 số đã được gửi đến <strong>email@example.com</strong><br />
          {
            timeLeft > 0 && <>Hết hạn sau <span className="font-bold text-[#b20707]">{timeLeft}</span> giây</>
          }
          {
            timeLeft == 0 &&
            <button type="button"
                    className="font-semibold text-[#b20707] hover:text-[#9a0606] cursor-pointer"
                    onClick={handleResend}
            >
              Gửi lại
            </button>
          }
        </p>

        <form className="mt-4" noValidate onSubmit={handleSubmit}>
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
                className="w-10 h-10 text-center text-sm font-bold border border-gray-200 rounded-xl focus:border-[#b20707]
                focus:outline-none transition-colors shadow-xs"
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-submit cursor-pointer disabled:cursor-not-allowed" disabled={isSubmitDisabled || timeLeft == 0}>
            Xác nhận →
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          <Link href={ROUTES.FORGOT_PASSWORD}>← Quay lại</Link>
        </p>
      </div>

      <DebugPanel data={{ otp, isSubmitDisabled, countResend, timeLeft }} />
    </div>
  );
}
