import { ROUTES } from "@/config/route"

export const organization = {
  company: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Công ty" },
    ],
    detail: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Chi tiết" },
    ],
    edit: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Cập nhật" },
    ],
    create: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Thêm mới" },
    ],
  },
  office: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Chi nhánh" },
    ],
    detail: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Chi nhánh", href: ROUTES.ORGANIZATION_OFFICE },
      { label: "Chi tiết" },
    ],
    edit: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Chi nhánh", href: ROUTES.ORGANIZATION_OFFICE },
      { label: "Cập nhật" },
    ],
  },
} as const;
