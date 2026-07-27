import { ROUTES } from "@/config/route"

export const organization = {
  company: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Danh sách công ty" },
    ],
    detail: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Danh sách công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Chi tiết" },
    ],
    edit: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Danh sách công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Cập nhật" },
    ],
    create: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Danh sách công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Thêm mới" },
    ],
  }
} as const;
