"use client" // Convert serve component to client component to using useState

import {useEffect, useState} from "react";
import {ROUTES, STORAGE_KEYS} from "@/config/constant";
import {useRouter} from "next/navigation";

export default function Home() {
  const [username, setUsername] = useState("")
  const router = useRouter();

  useEffect(() => {
    // 1. Kiểm tra token, nếu không có thì đá về Login
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }
    // 2. Lấy thông tin user để hiển thị
    const userInfoStr = localStorage.getItem(STORAGE_KEYS.USER_INFO);

    if (userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUsername(user || "User");
      } catch (error) {
        console.error("Lỗi parse user_info:", error);
      }
    }
  }, [router]);

  // 3. Xử lý Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    router.push(ROUTES.LOGIN);
  };

  return (
    <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
      <h1>Chào mừng bạn đến với Trang Chủ 🏠</h1>
      {username && (
        <p style={{ fontSize: 18, margin: "20px 0" }}>
          Xin chào, <strong>{username}</strong>!
        </p>
      )}
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
    </div>
  );
}
