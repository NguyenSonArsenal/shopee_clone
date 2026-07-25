"use client"

import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import LoginForm from "@feature/auth/page/login";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {STORAGE_KEYS} from "@/config/constant";
import {ROUTES} from "@/config/route";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      router.replace(ROUTES.HOME)
      return
    }
  }, [router]);

  return (
    <div className="auth-page login-page">
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}
