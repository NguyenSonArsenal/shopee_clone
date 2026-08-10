// Data mẫu tạm cho giao diện — thay bằng regionApi khi nối logic thật
export type RegionMockItem = {
  id: number
  name: string
  code: string | null
  company_name: string | null
  manager_name: string | null
  phone: string | null
  email: string | null
  address: string | null
  branch_count: number
  is_active: boolean
}

export const REGION_MOCK_LIST: RegionMockItem[] = [
  {
    id: 1,
    name: "Miền Bắc",
    code: "MB",
    company_name: "Công ty CP Dịch Vụ Và Đầu Tư Tân Long",
    manager_name: null,
    phone: null,
    email: null,
    address: null,
    branch_count: 0,
    is_active: true,
  },
  {
    id: 2,
    name: "Miền Nam",
    code: null,
    company_name: null,
    manager_name: null,
    phone: null,
    email: null,
    address: null,
    branch_count: 0,
    is_active: true,
  },
  {
    id: 3,
    name: "Miền Trung",
    code: null,
    company_name: null,
    manager_name: null,
    phone: null,
    email: null,
    address: null,
    branch_count: 0,
    is_active: true,
  },
]
