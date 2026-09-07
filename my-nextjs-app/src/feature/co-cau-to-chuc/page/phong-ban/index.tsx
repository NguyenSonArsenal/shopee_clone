"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/Pagination"
import TableLoadingOverlay from "@component/admin/TableLoadingOverlay"
import EmptyState from "@component/admin/EmptyState"
import { organization } from "@/config/breadcrumb"
import departmentApi from "@/feature/co-cau-to-chuc/departmentApi"
import {
  DEBOUNCED_SEARCH_TIMEOUT, LABEL_ACTIVE,
  LABEL_INACTIVE,
  NO_RECORD_DES,
  NO_RECORD_TITLE, TOOLTIP_ICON_DELETE
} from "@/config/constant";
import {MESSAGE_SERVER_ERROR_DEFAULT} from "@/config/validation";
import {transMessage} from "@/lib/utils";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useToast} from "@/context/ToastContext";
import ConfirmModal from "@modal/ConfirmModal";
import { usePaginationConfig } from "@/hook/usePaginationConfig";

export default function DepartmentListPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { showToast } = useToast()
  const queryClient = useQueryClient()
  const { perPageOptions, defaultPerPage, isLoading: isConfigLoading } = usePaginationConfig()

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('query') ?? ""
  const perPage = Number(searchParams.get('per_page')) || defaultPerPage

  const [inputValue, setInputValue] = useState(search)
  const [entity, setEntity] = useState<DepartmentListItem | null>(null)

  // Debounce: sau khi user ngừng gõ mới ghi vào URL (qua handleSearch)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) handleSearch(inputValue)
    }, DEBOUNCED_SEARCH_TIMEOUT)
    return () => clearTimeout(timer) // gõ tiếp -> huỷ timer cũ, không ghi URL
  }, [inputValue])

  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    params.set('page', '1') // search đổi -> quay về trang 1
    replace(`${pathname}?${params.toString()}`);
  }

  function handlePageChange(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    replace(`${pathname}?${params.toString()}`)
  }

  function handlePerPageChange(newPerPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('per_page', String(newPerPage))
    params.set('page', '1') // đổi số dòng/trang -> quay về trang 1
    replace(`${pathname}?${params.toString()}`)
  }

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["department_list", page, search, perPage],
    queryFn: () => departmentApi.getList({ page, search: search, per_page: perPage }),
    enabled: !isConfigLoading, // chờ có defaultPerPage từ config rồi mới gọi, tránh gọi 2 lần (fallback -> giá trị thật)
  })

  const departments = data?.data ?? []

  const { mutate: toggleActive, isPending: isToggling, variables: togglingVars } = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => departmentApi.update(id, { is_active }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["department_list"] })
      showToast("success", updated.is_active ? `Đã hoạt động phòng ban ${updated.name}!` : `Đã dừng hoạt động phòng ban ${updated.name}!`)
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: ["department_list"] })
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
    },
  })

  const { mutate: deleteDepartment, isPending: isDeleting } = useMutation({
    mutationFn: (entity: DepartmentListItem) => departmentApi.destroy(entity.id),
    onSuccess: (res, entity) => {
      queryClient.invalidateQueries({ queryKey: ["department_list"] })
      showToast("success", transMessage('delete_success', {label: entity.name}))
      setEntity(null)
    },
    onError: (err: any) => {
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
      setEntity(null)
    },
  })

  return (
    <AdminLayout breadcrumb={organization.department.list}>
      <div className="toolbar justify-between">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass"/>
          <input
            type="text"
            placeholder="Tìm theo tên, mã phòng ban..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          {(isFetching || isConfigLoading) && <TableLoadingOverlay />}
          <table className="data-table data-table--compact">
            <thead>
                <tr>
                  <th className="col-stt">STT</th>
                  <th>Tên phòng ban</th>
                  <th>Mã</th>
                  <th className="col-manager">Công ty</th>
                  <th className="col-manager">Chi nhánh</th>
                  <th className="ms-center">Kích hoạt</th>
                  <th className="col-action">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && !isConfigLoading && departments.length === 0 && (
                  <tr className="row-empty">
                    <td colSpan={7}>
                      <EmptyState
                        title={NO_RECORD_TITLE}
                        desc={NO_RECORD_DES}
                      />
                    </td>
                  </tr>
                )}
                {!isLoading && departments.map((department, index) => (
                  <tr key={department.id}>
                    <td className="col-stt">{(page - 1) * (data?.pagination.per_page ?? perPage) + index + 1}</td>
                    <td>
                      <span className={"font-bold"}>{department.name}</span>
                    </td>
                    <td>{department.code || "—"}</td>
                    <td className="col-manager">—</td>
                    <td className="col-manager">—</td>
                    <td className="text-center">
                      <label className="switch has-tip" data-tooltip={department.is_active ? LABEL_ACTIVE : LABEL_INACTIVE}>
                        <input
                          type="checkbox"
                          checked={department.is_active}
                          disabled={isToggling && togglingVars?.id === department.id} /* Chỉ disable toggle ứng vs dòng đang được chọn */
                          onChange={(e) => toggleActive({ id: department.id, is_active: e.target.checked })}
                        />
                        <span className="switch-track"></span>
                      </label>
                    </td>
                    <td className="col-action">
                      <div className="action-btns">
                        <button type="button" className="action-icon delete tip-top-left" data-tooltip={TOOLTIP_ICON_DELETE}
                                onClick={() => setEntity(department)}><i className="fa-solid fa-trash"/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {
          !isLoading && !isConfigLoading && departments.length > 0 &&
          <AdminPagination
            page={page}
            totalPages={data?.pagination.last_page ?? 1}
            onPageChange={handlePageChange}
            perPage={perPage}
            perPageOptions={perPageOptions}
            onPerPageChange={handlePerPageChange}
          />
        }
      </div>

      <ConfirmModal
        open={!!entity}
        message={<>Xoá &quot;<b>{entity?.name}</b>&quot;?</>}
        confirmLoading={isDeleting}
        onClose={() => setEntity(null)}
        onConfirm={() => entity && deleteDepartment(entity)}
      />
    </AdminLayout>
  )
}
