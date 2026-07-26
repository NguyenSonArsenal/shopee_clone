"use client"

import {useEffect, useState} from "react";
import {STORAGE_KEYS, TOAST} from "@/config/constant";
import {ROUTES} from "@/config/route";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import {useLogout} from "@/hook/useLogout";

export default function Home() {
  const handleLogout = useLogout()

  const [username, setUsername] = useState("")
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const token = Cookies.get(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsMounted(true);
      return;
    }
    // 2. Lấy thông tin user để hiển thị
    const userInfoStr = Cookies.get(STORAGE_KEYS.USER_INFO);
    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUsername(user?.username || "User");
      } catch (error) {
        console.error("Lỗi parse user_info:", error);
      }
    }
    setIsMounted(true);
  }, [router]);

  const renderAuthSection = () => {
    if (!isMounted) {
      return <p style={{ color: "#666" }}>Đang tải...</p>;
    }

    if (!username) {
      return (
        <Link href={ROUTES.LOGIN} className="">
          Login
        </Link>
      )
    }

    return (
      <>
        <p className={'text-[18px] mx-5'}>
          Xin chào, <strong>{username}</strong>!
        </p>
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          Đăng xuất
        </button>
      </>
    )
  }

  return (
    <div className={'p-10 text-center'}>
      <h1>Chào mừng bạn đến với Trang Chủ 🏠</h1>

      <Link href={ROUTES.ORGANIZATION_COMPANY}>Thông tin công ty</Link>
      <br/>

      {renderAuthSection()}
    </div>
  );
}
