"use client"

import React, { useState } from "react";
import FieldLabel from "@component/FieldLabel";
import { IconSave, IconCamera, IconCopy, IconUser, IconLink } from "@icon";
import { message } from "antd";

export default function ProfilePage() {
  const [fullname, setFullname] = useState("Super Admin");
  const [phone, setPhone] = useState("0909000001");
  const [email] = useState("admin@propcam.com");
  const [role] = useState("Trợ lý - Admin, Super Admin");
  const [address, setAddress] = useState("");

  const refCode = "VU7Q7NHS";
  const refLink = `https://demo.banghang.net/register?ref=${refCode}`;

  const [toast, contextHolder] = message.useMessage();

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Đã lưu thay đổi thông tin cá nhân thành công!");
  };

  return (
    <div className="flex flex-col gap-6">
      {contextHolder}

      {/* ═══ PROFILE CARD ═══ */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#b20707] flex items-center justify-center">
            <IconUser className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
            Thông tin cá nhân
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-3xl border-4 border-white shadow-md relative group">
              {fullname[0]?.toUpperCase() || "A"}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <IconCamera className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="flex flex-col items-center sm:items-start gap-2">
              <button
                type="button"
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-xs"
              >
                <IconCamera className="w-4 h-4 text-gray-500" />
                Thay ảnh đại diện
              </button>
              <span className="text-gray-400 text-xs mt-1">
                PNG, JPG, JPEG. Tối đa 2MB.
              </span>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Họ và tên */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="fullname" required>Họ và tên</FieldLabel>
              <input
                id="fullname"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#b20707] transition-colors text-sm font-medium"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Số điện thoại */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="phone" required>Số điện thoại</FieldLabel>
              <input
                id="phone"
                type="tel"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#b20707] transition-colors text-sm font-medium"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 cursor-not-allowed text-sm font-medium"
                value={email}
                disabled
              />
            </div>

            {/* Vai trò */}
            <div className="flex flex-col gap-2">
              <FieldLabel htmlFor="role">Vai trò</FieldLabel>
              <input
                id="role"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/70 text-gray-500 cursor-not-allowed text-sm font-medium"
                value={role}
                disabled
              />
            </div>

            {/* Địa chỉ (Spans 2 columns) */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
              <input
                id="address"
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#b20707] transition-colors text-sm font-medium"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, quận..."
              />
            </div>

          </div>

          {/* Action Button */}
          <div className="flex justify-start border-t border-gray-100 pt-5 mt-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#b20707] hover:bg-[#9a0606] text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <IconSave className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>

        </form>

      </div>

      {/* ═══ REFERRAL PROGRAM CARD ═══ */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs flex flex-col gap-5">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#b20707] flex items-center justify-center">
            <IconLink className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-gray-800 text-base leading-snug">
              Chương trình giới thiệu đối tác
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Chia sẻ mã giới thiệu hoặc link đăng ký để giới thiệu thành viên mới và nhận hoa hồng.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-red-50/30 p-6 rounded-2xl border border-red-50">
          
          {/* Mã giới thiệu */}
          <div className="flex flex-col gap-2 md:col-span-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Mã giới thiệu</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-mono font-bold text-center text-[#b20707] text-sm select-all"
                value={refCode}
              />
              <button
                type="button"
                onClick={() => handleCopy(refCode, "Mã giới thiệu")}
                className="flex items-center justify-center px-4 py-2.5 bg-[#b20707] hover:bg-[#9a0606] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs transition-colors"
              >
                <IconCopy className="w-4 h-4 mr-1.5" />
                Copy
              </button>
            </div>
          </div>

          {/* Link giới thiệu */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Link giới thiệu</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white font-mono text-gray-600 text-sm select-all"
                value={refLink}
              />
              <button
                type="button"
                onClick={() => handleCopy(refLink, "Link giới thiệu")}
                className="flex items-center justify-center px-4 py-2.5 bg-[#b20707] hover:bg-[#9a0606] text-white rounded-xl font-semibold text-xs cursor-pointer shadow-xs transition-colors"
              >
                <IconCopy className="w-4 h-4 mr-1.5" />
                Copy
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
