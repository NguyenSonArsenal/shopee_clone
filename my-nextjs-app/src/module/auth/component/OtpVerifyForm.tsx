"use client"

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ROUTES, STORAGE_KEYS } from "@/config/constant";
import { message } from "antd";

export default function OtpVerifyForm() {
  const router = useRouter();
  const [toast, contextHolder] = message.useMessage();
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes countdown
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const emailMock = "admin@propcam.com";

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendDisabled(false);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (value: string, index: number) => {
    // Only allow numbers
    if (/[^0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto submit if all 6 digits entered
    if (newOtp.join("").length === 6) {
      verifyOtp(newOtp.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Clear previous input and focus it
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;

    const newOtp = [...otp];
    pasteData.split("").forEach((char, i) => {
      newOtp[i] = char;
      if (inputRefs.current[i]) {
        inputRefs.current[i]!.value = char;
      }
    });
    setOtp(newOtp);

    // Focus last filled input
    const focusIndex = Math.min(pasteData.length, 5);
    inputRefs.current[focusIndex]?.focus();

    if (pasteData.length === 6) {
      verifyOtp(pasteData);
    }
  };

  const verifyOtp = (code: string) => {
    setIsSubmitting(true);
    // Mock verify
    setTimeout(() => {
      setIsSubmitting(false);
      if (code === "123456" || code.length === 6) {
        toast.success("Xác thực thành công!");
        localStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, "Xác thực thành công! Hãy đăng nhập");
        router.replace(ROUTES.LOGIN);
      } else {
        toast.error("Mã OTP không đúng!");
      }
    }, 1000);
  };

  const handleResend = () => {
    if (isResendDisabled) return;
    setIsResendDisabled(true);
    setTimeLeft(120);
    setOtp(new Array(6).fill(""));
    inputRefs.current[0]?.focus();
    toast.success("Đã gửi lại mã OTP!");
  };

  return (
    <div className="right">
      {contextHolder}
      <div className="login-card">
        <h1 className="login-title text-center">Xác thực email</h1>
        
        {/* Progress step visual */}
        <div className="flex justify-center gap-1.5 mb-6">
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
        </div>

        <p className="text-center text-sm text-gray-500 mb-8 leading-relaxed">
          Mã 6 số đã được gửi đến <strong>{emailMock}</strong><br />
          Hết hạn sau{" "}
          <span className="font-mono font-bold text-[#b20707]">
            {timeLeft > 0 ? formatTime(timeLeft) : "Hết hạn"}
          </span>
          {" · "}
          <button
            type="button"
            disabled={isResendDisabled}
            onClick={handleResend}
            className={`font-semibold cursor-pointer transition-colors ${
              isResendDisabled
                ? "text-gray-300 cursor-not-allowed"
                : "text-[#b20707] hover:text-[#9a0606] underline"
            }`}
          >
            Gửi lại
          </button>
        </p>

        <form
          className="login-form"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            verifyOtp(otp.join(""));
          }}
        >
          {/* OTP Input Inputs Row */}
          <div className="flex justify-between gap-2 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl font-mono font-bold border border-gray-200 rounded-xl focus:border-[#b20707] focus:outline-none transition-colors shadow-xs"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || otp.join("").length < 6}
            className="btn btn-primary btn-submit"
          >
            {isSubmitting ? "Đang xác minh..." : "Xác nhận →"}
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          <Link href={ROUTES.REGISTER}>← Quay lại đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
