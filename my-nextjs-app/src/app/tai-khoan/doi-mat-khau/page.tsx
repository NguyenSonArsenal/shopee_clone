"use client"

import React, { useState } from "react";
import FieldLabel from "@component/FieldLabel";
import { IconSave, IconLock, IconEye, IconEyeOff, IconKey } from "@icon";
import { message } from "antd";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [toast, contextHolder] = message.useMessage();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng nhập đầy đủ các trường mật khẩu!");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp nhau!");
      return;
    }

    toast.success("Đổi mật khẩu thành công!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs">
      {contextHolder}

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
        <div className="w-10 h-10 rounded-full bg-red-50 text-[#b20707] flex items-center justify-center">
          <IconKey className="w-5 h-5" />
        </div>
        <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
          Đổi mật khẩu
        </h2>
      </div>

      {/* Form */}
      <form onSubmit={handleUpdatePassword} className="flex flex-col gap-6 max-w-xl">
        
        {/* Mật khẩu hiện tại */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="currentPassword" required>Mật khẩu hiện tại</FieldLabel>
          <div className="field-wrap">
            <span className="field-icon">
              <IconLock />
            </span>
            <input
              id="currentPassword"
              type={showCurrentPass ? "text" : "password"}
              className="field-input"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              className="field-eye"
              onClick={() => setShowCurrentPass(p => !p)}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showCurrentPass ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        {/* Mật khẩu mới */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="newPassword" required>Mật khẩu mới</FieldLabel>
          <div className="field-wrap">
            <span className="field-icon">
              <IconLock />
            </span>
            <input
              id="newPassword"
              type={showNewPass ? "text" : "password"}
              className="field-input"
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              className="field-eye"
              onClick={() => setShowNewPass(p => !p)}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showNewPass ? <IconEyeOff /> : <IconEye />}
            </button>
          </div>
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div className="flex flex-col gap-2">
          <FieldLabel htmlFor="confirmPassword" required>Xác nhận mật khẩu mới</FieldLabel>
          <div className="field-wrap">
            <span className="field-icon">
              <IconLock />
            </span>
            <input
              id="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              className="field-input"
              placeholder="••••••••"
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

        {/* Action Button */}
        <div className="flex justify-start border-t border-gray-100 pt-5 mt-2">
          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#b20707] hover:bg-[#9a0606] text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
          >
            <IconSave className="w-4 h-4" />
            Cập nhật mật khẩu
          </button>
        </div>

      </form>
    </div>
  );
}
