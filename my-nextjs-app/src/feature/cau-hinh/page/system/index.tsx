"use client"

import { FormEvent, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import AdminLayout from "@component/admin/AdminLayout"
import SettingsSidebar from "@component/admin/SettingsSidebar"
import { settings } from "@/config/breadcrumb"
import configApi from "@feature/cau-hinh/configApi"
import { useToast } from "@/context/ToastContext"
import { MESSAGE_SERVER_ERROR_DEFAULT } from "@/config/validation"
import { PER_PAGE_OPTIONS_KEY, DEFAULT_PER_PAGE_KEY, TOAST_DURATION_KEY } from "@feature/cau-hinh/configKeys"

type Tab = "pagination" | "toast"

export default function SystemConfigPage() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()

  const tabParam = searchParams.get("tab")
  const tab: Tab = tabParam === "toast" ? "toast" : "pagination"

  function setTab(next: Tab) {
    const params = new URLSearchParams(searchParams)
    params.set("tab", next)
    replace(`${pathname}?${params.toString()}`)
  }

  const { data, isLoading } = useQuery({
    queryKey: ["config_list", "general"],
    queryFn: () => configApi.getList({ group: "general" }),
  })

  const [options, setOptions] = useState<number[]>([])
  const [defaultPerPage, setDefaultPerPage] = useState<number | "">("")
  const [newOption, setNewOption] = useState("")
  const [toastDuration, setToastDuration] = useState<number | "">("")

  // Nạp lại state form mỗi khi query trả dữ liệu mới (load lần đầu / sau khi lưu xong)
  useEffect(() => {
    if (!data) return
    const optionsConfig = data.find((c) => c.key === PER_PAGE_OPTIONS_KEY)
    const defaultConfig = data.find((c) => c.key === DEFAULT_PER_PAGE_KEY)
    const toastDurationConfig = data.find((c) => c.key === TOAST_DURATION_KEY)
    setOptions(Array.isArray(optionsConfig?.value) ? (optionsConfig.value as number[]) : [])
    setDefaultPerPage((defaultConfig?.value as number) ?? "")
    setToastDuration((toastDurationConfig?.value as number) ?? "")
  }, [data])

  function handleAddOption() {
    const n = Number(newOption)
    if (!n || n <= 0 || options.includes(n)) {
      setNewOption("")
      return
    }
    setOptions([...options, n].sort((a, b) => a - b))
    setNewOption("")
  }

  function handleRemoveOption(n: number) {
    setOptions(options.filter((o) => o !== n))
    if (defaultPerPage === n) setDefaultPerPage("")
  }

  const { mutate: savePagination, isPending: isPaginationPending } = useMutation({
    mutationFn: () => configApi.update({
      [PER_PAGE_OPTIONS_KEY]: options,
      [DEFAULT_PER_PAGE_KEY]: defaultPerPage,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config_list"] })
      showToast("success", "Lưu cấu hình thành công")
    },
    onError: (err: any) => {
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
    },
  })

  const { mutate: saveToast, isPending: isToastPending } = useMutation({
    mutationFn: () => configApi.update({
      [TOAST_DURATION_KEY]: toastDuration,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["config_list"] })
      showToast("success", "Lưu cấu hình thành công")
    },
    onError: (err: any) => {
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
    },
  })

  function handleSubmitPagination(e: FormEvent) {
    e.preventDefault()

    if (options.length === 0) {
      showToast("error", "Cần ít nhất 1 mức số dòng/trang")
      return
    }
    if (defaultPerPage === "" || !options.includes(defaultPerPage)) {
      showToast("error", "Mức mặc định phải nằm trong danh sách lựa chọn")
      return
    }

    savePagination()
  }

  function handleSubmitToast(e: FormEvent) {
    e.preventDefault()

    if (toastDuration === "" || toastDuration <= 0) {
      showToast("error", "Thời gian hiển thị phải lớn hơn 0")
      return
    }

    saveToast()
  }

  return (
    <AdminLayout breadcrumb={settings.system} sidebar={<SettingsSidebar />}>
      <div className="settings-layout">
        <div className="settings-subnav">
          <div className="settings-subnav-head">Cấu hình hệ thống</div>
          <div className={`settings-subnav-item ${tab === "pagination" ? "active" : ""}`} onClick={() => setTab("pagination")}>
            <i className="fa-solid fa-table-list" /> Phân trang
          </div>
          <div className={`settings-subnav-item ${tab === "toast" ? "active" : ""}`} onClick={() => setTab("toast")}>
            <i className="fa-solid fa-bell" /> Thông báo
          </div>
        </div>

        <div className="settings-content">
          {tab === "pagination" && (
            <form onSubmit={handleSubmitPagination}>
              <div className="card">
                <div className="card-head">
                  <h3><i className="fa-solid fa-table-list" style={{ color: "var(--primary)" }} /> Cấu hình phân trang</h3>
                </div>
                <div className="card-body">
                  <p className="text-light" style={{ marginBottom: 16 }}>
                    Các mức số dòng/trang cho phép chọn ở màn danh sách, và mức mặc định khi chưa chọn.
                  </p>

                  <div className="field">
                    <label>Các mức lựa chọn</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                      {!isLoading && options.map((n) => (
                        <span key={n} className="config-chip">
                          {n}
                          <button type="button" onClick={() => handleRemoveOption(n)}><i className="fa-solid fa-xmark" /></button>
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        type="number"
                        min={1}
                        placeholder="Nhập số rồi bấm Thêm"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        style={{ maxWidth: 200 }}
                      />
                      <button type="button" className="btn btn-outline" onClick={handleAddOption}>
                        <i className="fa-solid fa-plus" /> Thêm
                      </button>
                    </div>
                  </div>

                  <div className="field" style={{ maxWidth: 240 }}>
                    <label>Mặc định</label>
                    <select
                      value={defaultPerPage}
                      onChange={(e) => setDefaultPerPage(Number(e.target.value))}
                    >
                      <option value="">— Chọn —</option>
                      {options.map((n) => (
                        <option key={n} value={n}>{n} dòng/trang</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary" disabled={isPaginationPending}>
                    <i className="fa-solid fa-floppy-disk" /> {isPaginationPending ? "Đang lưu..." : "Lưu cấu hình"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {tab === "toast" && (
            <form onSubmit={handleSubmitToast}>
              <div className="card">
                <div className="card-head">
                  <h3><i className="fa-solid fa-bell" style={{ color: "var(--primary)" }} /> Cấu hình thông báo</h3>
                </div>
                <div className="card-body">
                  <p className="text-light" style={{ marginBottom: 16 }}>
                    Thời gian toast thông báo hiển thị trước khi tự động đóng.
                  </p>

                  <div className="field" style={{ maxWidth: 240 }}>
                    <label>Thời gian hiển thị (giây)</label>
                    <input
                      type="number"
                      min={1}
                      value={toastDuration}
                      onChange={(e) => setToastDuration(e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  </div>
                </div>
                <div className="card-footer">
                  <button type="submit" className="btn btn-primary" disabled={isToastPending}>
                    <i className="fa-solid fa-floppy-disk" /> {isToastPending ? "Đang lưu..." : "Lưu cấu hình"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
