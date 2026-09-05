// Data giả lập cho màn /my-style — chỉ để tham khảo style, không gọi API thật.

export type MyStyleStatus = "moi" | "dang_xu_ly" | "hoan_thanh" | "da_huy"

export type MyStyleItem = {
  id: number
  name: string
  email: string
  employee_code: string
  category: string
  branch: string
  roles: string[]
  status: MyStyleStatus
  start_date: string
  is_active: boolean
}

export const STATUS_MAP: Record<MyStyleStatus, { label: string; className: string }> = {
  moi: { label: "Mới", className: "status-text status-info" },
  dang_xu_ly: { label: "Đang xử lý", className: "status-text status-warning" },
  hoan_thanh: { label: "Hoàn thành", className: "status-text status-success" },
  da_huy: { label: "Đã huỷ", className: "status-text status-danger" },
}

const FIRST_NAMES = ["Lê Đức", "Hồ Hoàng", "Lý Minh", "Đỗ Đức", "Nguyễn Ngọc", "Lưu Thị", "Hồ Thị", "Lý Quốc", "Vũ Văn", "Đỗ Văn", "Trần Thị", "Phan Văn"]
const LAST_NAMES = ["Hùng", "Phúc", "Tâm", "Lan", "Rạng", "Vân", "Minh", "Em", "Giang", "Yến", "Hoa", "Sơn"]
const CATEGORIES = ["Nhân sự", "Kinh doanh", "Kỹ thuật", "Tài chính", "Marketing"]
const ROLE_POOL = ["Marketing", "CSKH", "NV kinh doanh", "Kế toán trưởng", "Quản trị", "Tổng giám đốc", "Trợ lý Admin", "Giám đốc dự án"]
const STATUSES: MyStyleStatus[] = ["moi", "dang_xu_ly", "hoan_thanh", "da_huy"]

function pad(n: number) {
  return String(n).padStart(2, "0")
}

function buildDate(seed: number) {
  const day = (seed % 28) + 1
  const month = ((seed * 3) % 12) + 1
  const year = 2024 + (seed % 3)
  return `${pad(day)}/${pad(month)}/${year}`
}

function buildRoles(seed: number) {
  const count = (seed % 3) + 1
  const roles: string[] = []
  for (let i = 0; i < count; i++) {
    roles.push(ROLE_POOL[(seed + i * 2) % ROLE_POOL.length])
  }
  return Array.from(new Set(roles))
}

export const MY_STYLE_ITEMS: MyStyleItem[] = Array.from({ length: 62 }, (_, i) => {
  const seed = i + 1
  const first = FIRST_NAMES[i % FIRST_NAMES.length]
  const last = LAST_NAMES[(i * 5) % LAST_NAMES.length]
  return {
    id: seed,
    name: `${first} ${last}`,
    email: `user${seed}@demo5k.local`,
    employee_code: "NV-019F73",
    category: CATEGORIES[i % CATEGORIES.length],
    branch: "—",
    roles: buildRoles(seed),
    status: STATUSES[i % STATUSES.length],
    start_date: buildDate(seed),
    is_active: seed % 5 !== 0,
  }
})
