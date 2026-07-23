"use client"

import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import LoginForm from "@feature/auth/page/login";
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {STORAGE_KEYS} from "@/config/constant";
import {ROUTES} from "@/config/route";
import {message} from 'antd';

export default function LoginPage() {
  const router = useRouter();
  const [toast, contextToast] = message.useMessage();

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      router.replace(ROUTES.HOME)
      return
    }
    const flashMessage = localStorage.getItem(STORAGE_KEYS.FLASH_MESSAGE);
    if (flashMessage) {
      toast.success(flashMessage);
      localStorage.removeItem(STORAGE_KEYS.FLASH_MESSAGE);
    }
  }, [router, toast]);

  return (
    <div className="auth-page login-page">
      {contextToast}
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}
