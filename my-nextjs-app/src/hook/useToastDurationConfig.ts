"use client"

import { useQuery } from "@tanstack/react-query"
import configApi from "@feature/cau-hinh/configApi"
import { TOAST_DURATION_KEY } from "@feature/cau-hinh/configKeys"

const FALLBACK_DURATION_SECONDS = 5

// Đọc thời gian hiển thị toast (giây) từ Cài đặt > Thông báo, chưa load xong thì dùng fallback.
export function useToastDurationConfig() {
  const { data } = useQuery({
    queryKey: ["config_list", "general"],
    queryFn: () => configApi.getList({ group: "general" }),
  })

  const durationConfig = data?.find((c) => c.key === TOAST_DURATION_KEY)
  const seconds = (durationConfig?.value as number) || FALLBACK_DURATION_SECONDS

  return seconds * 1000
}
