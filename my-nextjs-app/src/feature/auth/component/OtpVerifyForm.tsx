"use client"

import Link from "next/link";

export default function OtpVerifyForm() {
  return (
    <div className="right">
      <div className="login-card">
        <h1 className="login-title text-center">Xác thực email</h1>

        <div className="flex justify-center gap-1.5 mb-6">
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
          <span className="w-6 h-1 bg-[#b20707] rounded-full"></span>
        </div>

        <p className="text-center text-sm text-gray-500 mb-8 leading-relaxed">
          Mã 6 số đã được gửi đến <strong>email@example.com</strong><br />
          Hết hạn sau <span className="font-mono font-bold text-[#b20707]">05:00</span>
          {" · "}
          <button type="button" className="font-semibold text-[#b20707] hover:text-[#9a0606] underline cursor-pointer">
            Gửi lại
          </button>
        </p>

        <form className="login-form" noValidate>
          <div className="flex justify-between gap-2 mb-8">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-mono font-bold border border-gray-200 rounded-xl focus:border-[#b20707] focus:outline-none transition-colors shadow-xs"
              />
            ))}
          </div>

          <button type="submit" className="btn btn-primary btn-submit">
            Xác nhận →
          </button>
        </form>

        <p className="login-register-link" style={{ marginTop: 24 }}>
          <Link href="/">← Quay lại</Link>
        </p>
      </div>
    </div>
  );
}
