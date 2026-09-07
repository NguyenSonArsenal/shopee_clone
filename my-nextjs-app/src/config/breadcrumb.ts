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
  department: {
    list: [
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Phòng ban" },
    ],
  },
} as const;

export const settings = {
  list: [
    { label: "Cài đặt hệ thống" },
  ],
  system: [
    { label: "Cài đặt", href: ROUTES.SETTINGS },
    { label: "Cấu hình hệ thống" },
  ],
} as const;

export const myStyle = {
  list: [
    { label: "Giao diện mẫu", href: ROUTES.MY_STYLE },
    { label: "Danh sách" },
  ],
} as const;

export const apiDoc = {
  list: [
    { label: "Swagger - Danh sách API" },
  ],
  view: [
    { label: "Swagger - Danh sách API", href: ROUTES.SWAGGER },
    { label: "Chi tiết" },
  ],
  edit: [
    { label: "Swagger - Danh sách API", href: ROUTES.SWAGGER },
    { label: "Cập nhật" },
  ],
  create: [
    { label: "Swagger - Danh sách API", href: ROUTES.SWAGGER },
    { label: "Thêm mới" },
  ],
} as const;
