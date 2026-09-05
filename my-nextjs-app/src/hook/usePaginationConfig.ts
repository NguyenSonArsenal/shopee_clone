"use client"

import { useQuery } from "@tanstack/react-query"
import configApi from "@feature/cau-hinh/configApi"
import { PER_PAGE_OPTIONS_KEY, DEFAULT_PER_PAGE_KEY } from "@feature/cau-hinh/configKeys"

const FALLBACK_OPTIONS = [10, 20, 50, 100]
const FALLBACK_DEFAULT = 10

// Dùng chung cho mọi màn list: đọc mức số dòng/trang + mặc định từ Cài đặt > Cấu hình phân trang,
// chưa load xong thì tạm dùng fallback để tránh nháy UI trước khi có dữ liệu.
export function usePaginationConfig() {
  const { data, isLoading } = useQuery({
    queryKey: ["config_list", "general"],
    queryFn: () => configApi.getList({ group: "general" }),
  })

  const optionsConfig = data?.find((c) => c.key === PER_PAGE_OPTIONS_KEY)
  const defaultConfig = data?.find((c) => c.key === DEFAULT_PER_PAGE_KEY)

  const perPageOptions = Array.isArray(optionsConfig?.value) ? (optionsConfig.value as number[]) : FALLBACK_OPTIONS
  const defaultPerPage = (defaultConfig?.value as number) || FALLBACK_DEFAULT

  return { perPageOptions, defaultPerPage, isLoading }
}
