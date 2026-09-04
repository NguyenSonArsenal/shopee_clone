"use client"

import { FormEvent, useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminLayout from "@component/admin/AdminLayout"
import SettingsSidebar from "@component/admin/SettingsSidebar"
import { settings } from "@/config/breadcrumb"
import configApi from "@feature/settings/configApi"
import { useToast } from "@/context/ToastContext"
import { MESSAGE_SERVER_ERROR_DEFAULT } from "@/config/validation"
import { PER_PAGE_OPTIONS_KEY, DEFAULT_PER_PAGE_KEY } from "@feature/settings/configKeys"

export default function SystemConfigPage() {
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["config_list", "general"],
    queryFn: () => configApi.getList({ group: "general" }),
  })

  const [options, setOptions] = useState<number[]>([])
  const [defaultPerPage, setDefaultPerPage] = useState<number | "">("")
  const [newOption, setNewOption] = useState("")

  // Nạp lại state form mỗi khi query trả dữ liệu mới (load lần đầu / sau khi lưu xong)
  useEffect(() => {
    if (!data) return
    const optionsConfig = data.find((c) => c.key === PER_PAGE_OPTIONS_KEY)
    const defaultConfig = data.find((c) => c.key === DEFAULT_PER_PAGE_KEY)
    setOptions(Array.isArray(optionsConfig?.value) ? (optionsConfig.value as number[]) : [])
    setDefaultPerPage((defaultConfig?.value as number) ?? "")
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

  const { mutate: save, isPending } = useMutation({
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

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (options.length === 0) {
      showToast("error", "Cần ít nhất 1 mức số dòng/trang")
      return
    }
    if (defaultPerPage === "" || !options.includes(defaultPerPage)) {
      showToast("error", "Mức mặc định phải nằm trong danh sách lựa chọn")
      return
    }

    save()
  }

  return (
    <AdminLayout breadcrumb={settings.system} sidebar={<SettingsSidebar />}>
      <div className="settings-layout">
        <div className="settings-subnav">
          <div className="settings-subnav-head">Cấu hình hệ thống</div>
          <div className="settings-subnav-item active">
            <i className="fa-solid fa-table-list" /> Phân trang
          </div>
        </div>

        <div className="settings-content">
          <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary" disabled={isPending}>
                  <i className="fa-solid fa-floppy-disk" /> {isPending ? "Đang lưu..." : "Lưu cấu hình"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
