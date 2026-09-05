"use client"

import { useState } from "react"
import AdminLayout from "@component/admin/AdminLayout"
import MyStyleSidebar from "@component/admin/MyStyleSidebar"
import AdminPagination from "@component/admin/Pagination"
import SelectSingle from "@component/form/SelectSingle"
import EmptyState from "@component/admin/EmptyState"
import ConfirmModal from "@modal/ConfirmModal"
import { useToast } from "@/context/ToastContext"
import { usePaginationConfig } from "@/hook/usePaginationConfig"
import { myStyle } from "@/config/breadcrumb"
import { MY_STYLE_ITEMS, STATUS_MAP, MyStyleItem, MyStyleStatus } from "@feature/my-style/mock"

const CATEGORY_OPTIONS = [
  { value: "", label: "— Danh mục —" },
  ...Array.from(new Set(MY_STYLE_ITEMS.map((i) => i.category))).map((c) => ({ value: c, label: c })),
]
const STATUS_OPTIONS = [
  { value: "", label: "— Trạng thái —" },
  ...(Object.keys(STATUS_MAP) as MyStyleStatus[]).map((s) => ({ value: s, label: STATUS_MAP[s].label })),
]
const TABS = [
  { key: "all", label: "Tất cả" },
  { key: "active", label: "Hoạt động" },
  { key: "locked", label: "Dừng hoạt động" },
] as const
type TabKey = typeof TABS[number]["key"]

const COL_TOGGLE_ITEMS = [
  { key: "category", label: "Danh mục" },
  { key: "branch", label: "Chi nhánh" },
  { key: "roles", label: "Nhóm quyền" },
  { key: "start_date", label: "Ngày bắt đầu" },
] as const
type ColKey = typeof COL_TOGGLE_ITEMS[number]["key"]

export default function MyStylePage() {
  const { showToast } = useToast()
  const { perPageOptions, defaultPerPage } = usePaginationConfig()

  const [items, setItems] = useState<MyStyleItem[]>(MY_STYLE_ITEMS)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [dateTime, setDateTime] = useState("")
  const [month, setMonth] = useState("")
  const [time, setTime] = useState("")
  const [tab, setTab] = useState<TabKey>("all")
  const [page, setPage] = useState(1)
  const [perPageOverride, setPerPageOverride] = useState<number | null>(null)
  const perPage = perPageOverride ?? defaultPerPage
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [colVisible, setColVisible] = useState<Record<ColKey, boolean>>({
    category: true, branch: true, roles: true, start_date: true,
  })
  const [colPanelOpen, setColPanelOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<MyStyleItem | null>(null)

  const searchLower = search.trim().toLowerCase()
  const filtered = items.filter((i) => {
    if (searchLower && !i.name.toLowerCase().includes(searchLower) && !i.email.toLowerCase().includes(searchLower)) return false
    if (category && i.category !== category) return false
    if (status && i.status !== status) return false
    return true
  })
  const counts = {
    all: filtered.length,
    active: filtered.filter((i) => i.is_active).length,
    locked: filtered.filter((i) => !i.is_active).length,
  }
  const tabFiltered = tab === "all" ? filtered : filtered.filter((i) => (tab === "active" ? i.is_active : !i.is_active))
  const totalPages = Math.max(1, Math.ceil(tabFiltered.length / perPage))
  const pageItems = tabFiltered.slice((page - 1) * perPage, page * perPage)
  const colSpanCount = 8 + Object.values(colVisible).filter(Boolean).length

  function resetFilters() {
    setSearch(""); setCategory(""); setStatus(""); setStartDate(""); setDateTime(""); setMonth(""); setTime("")
    setTab("all"); setPage(1); setSelectedIds(new Set())
  }

  function handleSearch(v: string) { setSearch(v); setPage(1) }
  function handleCategory(v: string | number) { setCategory(String(v)); setPage(1) }
  function handleStatus(v: string | number) { setStatus(String(v)); setPage(1) }
  function handleTab(key: TabKey) { setTab(key); setPage(1); setSelectedIds(new Set()) }
  function handlePerPageChange(n: number) { setPerPageOverride(n); setPage(1) }

  function toggleActive(id: number) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_active: !i.is_active } : i)))
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      pageItems.forEach((i) => (checked ? next.add(i.id) : next.delete(i.id)))
      return next
    })
  }
  function toggleSelectRow(id: number, checked: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      checked ? next.add(id) : next.delete(id)
      return next
    })
  }
  const allPageChecked = pageItems.length > 0 && pageItems.every((i) => selectedIds.has(i.id))

  function bulkSetActive(value: boolean) {
    setItems((prev) => prev.map((i) => (selectedIds.has(i.id) ? { ...i, is_active: value } : i)))
    showToast("success", value ? "Đã kích hoạt các bản ghi đã chọn!" : "Đã vô hiệu hoá các bản ghi đã chọn!")
    setSelectedIds(new Set())
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return
    setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id))
    showToast("success", `Đã xoá "${deleteTarget.name}"!`)
    setDeleteTarget(null)
  }

  function demo(label: string) {
    showToast("info", `Demo: ${label}`)
  }

  return (
    <AdminLayout breadcrumb={myStyle.list} sidebar={<MyStyleSidebar />}>
      <div className="toolbar">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            autoComplete="off"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="min-w-[170px]">
          <SelectSingle options={CATEGORY_OPTIONS} value={category} onChange={handleCategory} />
        </div>
        <div className="min-w-[170px]">
          <SelectSingle options={STATUS_OPTIONS} value={status} onChange={handleStatus} />
        </div>
        <input type="text" placeholder="Style date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-[140px] h-[38px] px-2.5 rounded-[10px] border border-(--border) text-(length:--fs-primary) bg-white box-border focus:outline-none focus:border-(--primary)" />
        <input type="text" placeholder="Style date + time" value={dateTime} onChange={(e) => setDateTime(e.target.value)} className="w-[160px] h-[38px] px-2.5 rounded-[10px] border border-(--border) text-(length:--fs-primary) bg-white box-border focus:outline-none focus:border-(--primary)" />
        <input type="text" placeholder="Chọn tháng/năm" value={month} onChange={(e) => setMonth(e.target.value)} className="w-[140px] h-[38px] px-2.5 rounded-[10px] border border-(--border) text-(length:--fs-primary) bg-white box-border focus:outline-none focus:border-(--primary)" />
        <input type="text" placeholder="Chọn giờ" value={time} onChange={(e) => setTime(e.target.value)} className="w-[120px] h-[38px] px-2.5 rounded-[10px] border border-(--border) text-(length:--fs-primary) bg-white box-border focus:outline-none focus:border-(--primary)" />
      </div>

      <div className="toolbar">
        <button type="button" className="btn btn-primary w-auto" onClick={resetFilters}>
          <i className="fa-solid fa-rotate-left" /> Đặt lại
        </button>
        <button type="button" className="btn btn-primary w-auto" onClick={() => demo("Thêm mới")}>
          <i className="fa-solid fa-plus" /> Thêm mới
        </button>
        <div className="col-toggle-wrap">
          <button type="button" className="btn btn-primary w-auto" onClick={() => setColPanelOpen((v) => !v)}>
            <i className="fa-solid fa-gear" /> DS cột
          </button>
          <div className={`col-toggle-panel ${colPanelOpen ? "open" : ""}`}>
            {COL_TOGGLE_ITEMS.map((c) => (
              <label key={c.key} className="col-toggle-item">
                <input
                  type="checkbox"
                  checked={colVisible[c.key]}
                  onChange={(e) => setColVisible((prev) => ({ ...prev, [c.key]: e.target.checked }))}
                />
                {c.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mb-3.5 flex-wrap">
        <div className="tabs flex-1">
          {TABS.map((t) => (
            <button key={t.key} type="button" className={`tab ${tab === t.key ? "active" : ""}`} onClick={() => handleTab(t.key)}>
              <span className="tab-label">{t.label} <span className="cnt">({counts[t.key]})</span></span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button type="button" className="btn btn-outline w-auto" onClick={() => showToast("success", "Thao tác thành công!")}>
            <i className="fa-solid fa-circle-check text-(--success)" /> Toast success
          </button>
          <button type="button" className="btn btn-outline w-auto" onClick={() => showToast("error", "Đã có lỗi xảy ra!")}>
            <i className="fa-solid fa-circle-xmark text-(--primary)" /> Toast error
          </button>
        </div>
      </div>

      <div className={`ms-bulk-bar ${selectedIds.size > 0 ? "show" : ""}`}>
        <span>Đã chọn <span className="count">{selectedIds.size}</span> bản ghi</span>
        <button type="button" className="btn btn-outline w-auto" onClick={() => bulkSetActive(true)}>
          <i className="fa-solid fa-circle-check" /> Kích hoạt
        </button>
        <button type="button" className="btn btn-outline w-auto" onClick={() => bulkSetActive(false)}>
          <i className="fa-solid fa-ban" /> Vô hiệu hoá
        </button>
        <span className="spacer" />
        <button type="button" className="btn btn-outline w-auto" onClick={() => setSelectedIds(new Set())}>
          Bỏ chọn
        </button>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-check">
                  <input type="checkbox" checked={allPageChecked} onChange={(e) => toggleSelectAll(e.target.checked)} title="Chọn tất cả (trang hiện tại)" />
                </th>
                <th className="col-stt">STT</th>
                <th>Họ và tên</th>
                <th>Mã nhân viên</th>
                {colVisible.category && <th>Danh mục</th>}
                {colVisible.branch && <th>Chi nhánh</th>}
                {colVisible.roles && <th>Nhóm quyền</th>}
                <th>Trạng thái</th>
                {colVisible.start_date && <th className="ms-center">Ngày bắt đầu</th>}
                <th className="ms-center">Kích hoạt</th>
                <th className="col-action ms-center">Thao tác (1 icon)</th>
                <th className="col-action col-action-multi">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr className="row-empty">
                  <td colSpan={colSpanCount}>
                    <EmptyState title="Chưa có dữ liệu" desc="Không tìm thấy bản ghi phù hợp với bộ lọc hiện tại." />
                  </td>
                </tr>
              )}
              {pageItems.map((item, index) => (
                <tr key={item.id}>
                  <td className="col-check">
                    <input type="checkbox" checked={selectedIds.has(item.id)} onChange={(e) => toggleSelectRow(item.id, e.target.checked)} />
                  </td>
                  <td className="col-stt">{(page - 1) * perPage + index + 1}</td>
                  <td>
                    <div className="ms-id-cell">
                      <span className="ms-id-info">
                        <span className="ms-id-name">{item.name}</span>
                        <span className="ms-id-sub">{item.email}</span>
                      </span>
                    </div>
                  </td>
                  <td>{item.employee_code}</td>
                  {colVisible.category && <td>{item.category}</td>}
                  {colVisible.branch && <td>{item.branch}</td>}
                  {colVisible.roles && (
                    <td>
                      <div className="ms-roles">
                        {item.roles.map((r) => <span key={r} className="badge badge-group">{r}</span>)}
                      </div>
                    </td>
                  )}
                  <td><span className={STATUS_MAP[item.status].className}>{STATUS_MAP[item.status].label}</span></td>
                  {colVisible.start_date && <td className="ms-center">{item.start_date}</td>}
                  <td className="ms-center">
                    <label className="switch has-tip" data-tooltip={item.is_active ? "Hoạt động" : "Dừng hoạt động"}>
                      <input type="checkbox" checked={item.is_active} onChange={() => toggleActive(item.id)} />
                      <span className="switch-track" />
                    </label>
                  </td>
                  <td className="col-action ms-center">
                    <div className="action-btns">
                      <button type="button" className="action-icon view" data-tooltip="Xem chi tiết" onClick={() => demo(`Xem chi tiết ${item.name}`)}>
                        <i className="fa-solid fa-eye" />
                      </button>
                    </div>
                  </td>
                  <td className="col-action col-action-multi">
                    <div className="action-btns">
                      <button type="button" className="action-icon edit" data-tooltip="Sửa" onClick={() => demo(`Sửa ${item.name}`)}>
                        <i className="fa-solid fa-pen" />
                      </button>
                      <button type="button" className="action-icon permission" data-tooltip="Gán nhóm quyền" onClick={() => demo(`Gán nhóm quyền ${item.name}`)}>
                        <i className="fa-solid fa-shield-halved" />
                      </button>
                      <button type="button" className="action-icon assign" data-tooltip="Gán người dùng" onClick={() => demo(`Gán người dùng ${item.name}`)}>
                        <i className="fa-solid fa-user-plus" />
                      </button>
                      <button type="button" className="action-icon delete tip-top-left" data-tooltip="Xoá" onClick={() => setDeleteTarget(item)}>
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pageItems.length > 0 && (
          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            perPage={perPage}
            perPageOptions={perPageOptions}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      <SecondTableExample />
      <EmptyTableExample />

      <ConfirmModal
        open={!!deleteTarget}
        message={<>Xoá &quot;<b>{deleteTarget?.name}</b>&quot;?</>}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </AdminLayout>
  )
}

// Hàng chân 2 phần: không truyền onPerPageChange -> Pagination tự rút gọn còn info trái + phân trang phải.
// Chỉ demo riêng component Pagination (không kèm bảng) để đặt liền kề ngay dưới phân trang 3 phần ở trên.
function SecondTableExample() {
  const [page, setPage] = useState(1)

  return (
    <div className="card">
      <AdminPagination page={page} totalPages={2} onPageChange={setPage} />
    </div>
  )
}

// Trạng thái không có bản ghi: header đầy đủ cột, phần thân chỉ 1 dòng colspan chứa EmptyState.
function EmptyTableExample() {
  return (
    <div>
      <h3 style={{ fontSize: "var(--fs-md)", fontWeight: 500, marginBottom: 4 }}>Trạng thái không có bản ghi (Empty state)</h3>
      <p className="text-light" style={{ marginBottom: 12 }}>Bảng vẫn hiện đầy đủ header cột; phần thân là 1 dòng colspan chứa component EmptyState.</p>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-check"><input type="checkbox" disabled /></th>
                <th className="col-stt">STT</th>
                <th>Họ và tên</th>
                <th>Mã nhân viên</th>
                <th>Danh mục</th>
                <th>Chi nhánh</th>
                <th>Nhóm quyền</th>
                <th>Trạng thái</th>
                <th className="ms-center">Ngày bắt đầu</th>
                <th className="ms-center">Kích hoạt</th>
                <th className="col-action">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr className="row-empty">
                <td colSpan={11}>
                  <EmptyState title="Chưa có dữ liệu" desc="Bắt đầu bằng cách thêm bản ghi đầu tiên của bạn." actionUrl="#" actionLabel="Thêm mới" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
