"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/Pagination"
import TableLoadingOverlay from "@component/admin/TableLoadingOverlay"
import EmptyState from "@component/admin/EmptyState"
import ConfirmModal from "@modal/ConfirmModal"
import { ROUTES } from "@/config/route"
import { apiDoc } from "@/config/breadcrumb"
import {
  DEBOUNCED_SEARCH_TIMEOUT, NO_RECORD_DES, NO_RECORD_TITLE,
  TOOLTIP_ICON_DELETE, TOOLTIP_ICON_EDIT, TOOLTIP_ICON_VIEW,
} from "@/config/constant"
import { MESSAGE_SERVER_ERROR_DEFAULT } from "@/config/validation"
import { transMessage } from "@/lib/utils"
import { useToast } from "@/context/ToastContext"
import { usePaginationConfig } from "@/hook/usePaginationConfig"
import apiDocApi from "@feature/api-doc/apiDocApi"
import styles from "./index.module.scss"

const METHOD_CLASS: Record<string, string> = {
  GET: styles.methodGet,
  POST: styles.methodPost,
  PUT: styles.methodPut,
  PATCH: styles.methodPatch,
  DELETE: styles.methodDelete,
}

export default function ApiDocListPage() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { perPageOptions, defaultPerPage, isLoading: isConfigLoading } = usePaginationConfig()

  const page = Number(searchParams.get("page")) || 1
  const search = searchParams.get("query") ?? ""
  const perPage = Number(searchParams.get("per_page")) || defaultPerPage

  const [inputValue, setInputValue] = useState(search)
  const [entity, setEntity] = useState<ApiDocItem | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) handleSearch(inputValue)
    }, DEBOUNCED_SEARCH_TIMEOUT)
    return () => clearTimeout(timer)
  }, [inputValue])

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("query", term)
    } else {
      params.delete("query")
    }
    params.set("page", "1")
    replace(`${pathname}?${params.toString()}`)
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(newPage))
    replace(`${pathname}?${params.toString()}`)
  }

  function handlePerPageChange(newPerPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set("per_page", String(newPerPage))
    params.set("page", "1")
    replace(`${pathname}?${params.toString()}`)
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["api_doc_list", page, search, perPage],
    queryFn: () => apiDocApi.getList({ page, search, per_page: perPage }),
    enabled: !isConfigLoading,
  })

  const items = data?.data ?? []

  const { mutate: deleteApiDoc, isPending: isDeleting } = useMutation({
    mutationFn: (entity: ApiDocItem) => apiDocApi.destroy(entity.id),
    onSuccess: (res, entity) => {
      queryClient.invalidateQueries({ queryKey: ["api_doc_list"] })
      showToast("success", transMessage("delete_success", { label: entity.url }))
      setEntity(null)
    },
    onError: (err: any) => {
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
      setEntity(null)
    },
  })

  return (
    <AdminLayout breadcrumb={apiDoc.list} hideSidebar>
      <p className="text-light" style={{ marginBottom: 12 }}>
        <i className="fa-solid fa-circle-info" /> Mọi API đều có tiền tố <code>/api/</code> — ví dụ endpoint <code>login</code> nghĩa là <code>domain/api/login</code>.
      </p>

      <div className="toolbar justify-between">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass" />
          <input
            type="text"
            placeholder="Tìm theo url, mô tả, module..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <Link href={`${ROUTES.SWAGGER}/create`} className="btn btn-primary" style={{ width: "auto" }}>
          <i className="fa-solid fa-plus" /> Thêm mới
        </Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          {(isFetching || isConfigLoading) && <TableLoadingOverlay />}
          <table className="data-table data-table--compact">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th>Module</th>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Mô tả</th>
                <th className="col-action">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && !isConfigLoading && items.length === 0 && (
                <tr className="row-empty">
                  <td colSpan={6}>
                    <EmptyState title={NO_RECORD_TITLE} desc={NO_RECORD_DES} />
                  </td>
                </tr>
              )}
              {!isLoading && !isConfigLoading && items.map((item, index) => (
                <tr key={item.id}>
                  <td className="col-stt">{(page - 1) * (data?.pagination.per_page ?? perPage) + index + 1}</td>
                  <td>{item.module}</td>
                  <td>
                    <span className={`${styles.methodBadge} ${METHOD_CLASS[item.method] ?? ""}`}>{item.method}</span>
                  </td>
                  <td>
                    <span className={styles.urlText}>{item.url}</span>
                  </td>
                  <td>{item.description || "—"}</td>
                  <td className="col-action">
                    <div className="action-btns">
                      <Link href={`${ROUTES.SWAGGER}/${item.id}`} className="action-icon view" data-tooltip={TOOLTIP_ICON_VIEW}>
                        <i className="fa-solid fa-eye" />
                      </Link>
                      <Link href={`${ROUTES.SWAGGER}/${item.id}/edit`} className="action-icon edit" data-tooltip={TOOLTIP_ICON_EDIT}>
                        <i className="fa-solid fa-pen" />
                      </Link>
                      <button type="button" className="action-icon delete tip-top-left" data-tooltip={TOOLTIP_ICON_DELETE}
                              onClick={() => setEntity(item)}><i className="fa-solid fa-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && !isConfigLoading && items.length > 0 && (
          <AdminPagination
            page={page}
            totalPages={data?.pagination.last_page ?? 1}
            onPageChange={handlePageChange}
            perPage={perPage}
            perPageOptions={perPageOptions}
            onPerPageChange={handlePerPageChange}
          />
        )}
      </div>

      <ConfirmModal
        open={!!entity}
        message={<>Xoá &quot;<b>{entity?.url}</b>&quot;?</>}
        confirmLoading={isDeleting}
        onClose={() => setEntity(null)}
        onConfirm={() => entity && deleteApiDoc(entity)}
      />
    </AdminLayout>
  )
}
