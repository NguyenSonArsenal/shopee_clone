"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES, STORAGE_KEYS } from "@/config/constant";
import {
  IconUser,
  IconDocument,
  IconCalendar,
  IconHeart,
  IconHistory,
  IconKey,
  IconUsers,
  IconLogout
} from "@icon";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("Super Admin");
  const [phone, setPhone] = useState("0909.000.001");

  useEffect(() => {
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUsername(user.username || "Super Admin");
        setPhone(user.phone || "0909.000.001");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.setItem(STORAGE_KEYS.FLASH_MESSAGE, "Bạn đã đăng xuất thành công");
    router.replace(ROUTES.LOGIN);
  };

  const menuItems = [
    { name: "Hồ sơ cá nhân", route: ROUTES.PROFILE, icon: <IconUser className="w-5 h-5" /> },
    { name: "Đơn hàng của tôi", route: "/tai-khoan/don-hang", icon: <IconDocument className="w-5 h-5" /> },
    { name: "Danh sách booking", route: "/tai-khoan/booking", icon: <IconCalendar className="w-5 h-5" /> },
    { name: "BĐS quan tâm", route: ROUTES.FAVORITES, icon: <IconHeart className="w-5 h-5" /> },
    { name: "Nhật ký hoạt động", route: "/tai-khoan/nhat-ky", icon: <IconHistory className="w-5 h-5" /> },
    { name: "Đổi mật khẩu", route: ROUTES.CHANGE_PASSWORD, icon: <IconKey className="w-5 h-5" /> },
    { name: "Thành viên giới thiệu", route: ROUTES.REFERRALS, icon: <IconUsers className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-xs h-16 flex items-center">
        <div className="max-w-7xl w-full mx-auto px-4 flex justify-between items-center">
          
          {/* Logo */}
          <Link href={ROUTES.HOME} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#b20707] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              BH
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-800">
              banghang<span className="text-[#b20707]">.net</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link href="#" className="hover:text-[#b20707] transition-colors">DỰ ÁN</Link>
            <Link href="#" className="hover:text-[#b20707] transition-colors">CHUYỂN NHƯỢNG</Link>
            <Link href="#" className="hover:text-[#b20707] transition-colors">CHO THUÊ</Link>
            <Link href="#" className="hover:text-[#b20707] transition-colors">KÝ GỬI BĐS</Link>
            <Link href="#" className="hover:text-[#b20707] transition-colors">TIN TỨC</Link>
            <Link href="#" className="hover:text-[#b20707] transition-colors">LIÊN HỆ</Link>
          </nav>

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm shadow-xs border border-emerald-200">
              {username[0]?.toUpperCase() || "A"}
            </div>
            <span className="font-medium text-gray-700 text-sm hidden sm:inline">{username}</span>
          </div>

        </div>
      </header>

      {/* ═══ MAIN LAYOUT ═══ */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 flex-1 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR */}
        <aside className="md:col-span-1 flex flex-col gap-6">
          
          {/* User Brief Card */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border-4 border-emerald-50 shadow-inner mb-4">
              {username[0]?.toUpperCase() || "A"}
            </div>
            <h3 className="font-bold text-gray-800 text-lg leading-snug">{username}</h3>
            <p className="text-gray-500 text-sm mt-1 font-mono">{phone}</p>
          </div>

          {/* Navigation Menu */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col gap-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.route;
              return (
                <Link
                  key={item.route}
                  href={item.route}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 text-[#b20707]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#b20707]"
                  }`}
                >
                  <span className={isActive ? "text-[#b20707]" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  {item.name}
                </Link>
              );
            })}
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all text-left cursor-pointer border-t border-gray-50 mt-2 pt-4"
            >
              <span className="text-gray-400 hover:text-red-500">
                <IconLogout className="w-5 h-5" />
              </span>
              Đăng xuất
            </button>
          </div>

        </aside>

        {/* RIGHT CONTENT PANEL */}
        <section className="md:col-span-3">
          {children}
        </section>

      </main>

    </div>
  );
}
