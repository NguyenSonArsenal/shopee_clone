'use client'

import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";
import {STORAGE_KEYS, TOAST} from "@/config/constant";
import {ROUTES} from "@/config/route";
import {useToast} from "@/context/ToastContext";

export function useLogout() {
  const {showToast} = useToast()

  const router = useRouter()

  const logout = () => {
    Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
    Cookies.remove(STORAGE_KEYS.USER_INFO);
    showToast(TOAST.TYPE.SUCCESS, "Bạn đã đăng xuất")
    router.replace(ROUTES.LOGIN);
  }

  return logout
}
