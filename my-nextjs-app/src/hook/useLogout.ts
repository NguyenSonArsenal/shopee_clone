'use client'

import { useRouter } from 'next/navigation'
import Cookies from "js-cookie";
import {STORAGE_KEYS, TOAST} from "@/config/constant";
import {ROUTES} from "@/config/route";
import {useToast} from "@/context/ToastContext";
import {useConfirm} from "@/context/ConfirmContext";

export function useLogout() {
  const {showToast} = useToast()
  const {confirm} = useConfirm()

  const router = useRouter()

  const handleLogout = () => {
    Cookies.remove(STORAGE_KEYS.ACCESS_TOKEN);
    Cookies.remove(STORAGE_KEYS.USER_INFO);
    showToast(TOAST.TYPE.SUCCESS, "Bạn đã đăng xuất")
    router.replace(ROUTES.LOGIN);
  }

  const logout = () => {
    confirm({
      title: "Đăng xuất",
      message: "Bạn có chắc chắn muốn đăng xuất?",
      okText: "Đăng xuất",
      onOk: () => handleLogout(),
    })
  }

  return logout
}
