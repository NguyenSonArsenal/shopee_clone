"use client"

import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import LoginForm from "@module/auth/component/LoginForm";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {ROUTES, STORAGE_KEYS} from "@/config/constant";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      router.replace(ROUTES.HOME)
    }
  }, [router]);

  return (
    <div className="login-page">
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}
