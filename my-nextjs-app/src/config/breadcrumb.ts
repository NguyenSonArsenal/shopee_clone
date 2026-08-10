import { ROUTES } from "@/config/route"

export const organization = {
  company: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty" },
    ],
    detail: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Chi tiết" },
    ],
    edit: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Cập nhật" },
    ],
    create: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Thêm mới" },
    ],
  },
  region: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin vùng miền" },
    ],
    detail: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin vùng miền", href: ROUTES.ORGANIZATION_REGION },
      { label: "Chi tiết" },
    ],
    edit: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin vùng miền", href: ROUTES.ORGANIZATION_REGION },
      { label: "Cập nhật" },
    ],
    create: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin vùng miền", href: ROUTES.ORGANIZATION_REGION },
      { label: "Thêm mới" },
    ],
  }
} as const;
