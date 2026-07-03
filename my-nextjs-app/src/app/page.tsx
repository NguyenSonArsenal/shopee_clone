"use client" // Convert serve component to client component to using useState

import {useEffect, useState} from "react";
import {ROUTES, STORAGE_KEYS} from "@/config/constant";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("")
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      setIsMounted(true);
      return;
    }
    // 2. Lấy thông tin user để hiển thị
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);

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

  // 3. Xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    router.push(ROUTES.LOGIN);
    setUsername("");
  };

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

      {renderAuthSection()}
    </div>
  );
}
