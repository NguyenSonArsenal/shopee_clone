import { ROUTES } from "@/config/route"

export type ConfigLink = { label: string; href?: string }

export type ConfigGroup = {
  icon: string
  title: string
  links: ConfigLink[]
}

// Dùng chung cho cả hub (/cau-hinh) và sidebar (/cau-hinh-he-thong) để 2 nơi luôn khớp nhau.
// Link nào chưa có màn thật thì để trống href (hiện dạng text, không bấm được).
export const CONFIG_GROUPS: ConfigGroup[] = [
  {
    icon: "fa-sliders-h",
    title: "Cấu hình chung",
    links: [{ label: "Cấu hình hệ thống", href: ROUTES.SETTINGS_SYSTEM }],
  },
  {
    icon: "fa-user-shield",
    title: "Phân quyền & Tài khoản",
    links: [{ label: "Người dùng" }, { label: "Phân quyền" }],
  },
]
