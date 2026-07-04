"use client"

import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import LoginForm from "@module/auth/component/LoginForm";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect} from "react";
import {ROUTES, STORAGE_KEYS} from "@/config/constant";
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
    <div className="login-page">
      {contextToast}
      <AuthLeftPanel />
      <LoginForm />
    </div>
  )
}
