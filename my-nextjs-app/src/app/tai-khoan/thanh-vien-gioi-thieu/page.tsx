"use client"

import React from "react";
import { IconUsers } from "@icon";

type ReferralMember = {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  role: string;
  status: "active" | "pending";
};

const REFERRAL_MEMBERS_MOCK: ReferralMember[] = [
  { id: "1", name: "Nguyễn Văn A", phone: "0912.345.678", joinDate: "12/06/2026", role: "Công ty (F2)", status: "active" },
  { id: "2", name: "Trần Thị B", phone: "0988.777.666", joinDate: "20/06/2026", role: "CTV", status: "active" },
  { id: "3", name: "Lê Văn C", phone: "0905.111.222", joinDate: "28/06/2026", role: "Khách hàng", status: "pending" },
  { id: "4", name: "Phạm Hồng D", phone: "0934.555.444", joinDate: "01/07/2026", role: "CTV", status: "active" },
  { id: "5", name: "Hoàng Minh E", phone: "0976.222.333", joinDate: "03/07/2026", role: "Khách hàng", status: "pending" },
];

export default function ReferralsPage() {
  const stats = [
    { label: "Tổng số thành viên", value: "5", desc: "Thành viên đã đăng ký qua link" },
    { label: "Hoa hồng tích lũy", value: "3.500.000 đ", desc: "Tổng thu nhập từ trước đến nay" },
    { label: "Số dư khả dụng", value: "1.200.000 đ", desc: "Số dư khả dụng để rút tiền" },
  ];

  return (
    <div className="flex flex-col gap-6">
      
      {/* ═══ STATS SUMMARY ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col">
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</span>
            <span className="text-2xl font-bold text-gray-800 mt-2 font-mono">{stat.value}</span>
            <span className="text-gray-400 text-xs mt-1.5">{stat.desc}</span>
          </div>
        ))}
      </div>

      {/* ═══ MEMBERS LIST ═══ */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-xs">
        
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 pb-5 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-50 text-[#b20707] flex items-center justify-center">
            <IconUsers className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-gray-800 text-lg uppercase tracking-wide">
            Thành viên giới thiệu
          </h2>
        </div>

        {/* Table wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Họ và tên</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Số điện thoại</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Vai trò</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Ngày tham gia</th>
                <th className="pb-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {REFERRAL_MEMBERS_MOCK.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 text-sm font-semibold text-gray-800">{member.name}</td>
                  <td className="py-4 text-sm font-mono text-gray-600">{member.phone}</td>
                  <td className="py-4 text-sm text-gray-600">{member.role}</td>
                  <td className="py-4 text-sm text-gray-500">{member.joinDate}</td>
                  <td className="py-4 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        member.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {member.status === "active" ? "Đã kích hoạt" : "Đang chờ"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
