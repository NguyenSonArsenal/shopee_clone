"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/AdminPagination"
import TableLoadingOverlay from "@component/admin/TableLoadingOverlay"
import EmptyState from "@component/admin/EmptyState"
import { ROUTES } from "@/config/route"
import { organization } from "@/config/breadcrumb"
import companyApi from "@/feature/organization/companyApi"
import {
  debounced_search_timeout, LABEL_ACTIVE,
  LABEL_CREATE, LABEL_INACTIVE,
  MESSAGE_SERVER_ERROR_DEFAULT,
  NO_RECORD_DES,
  NO_RECORD_TITLE
} from "@/config/constant";
import DebugPanel from "@component/DebugPanel";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useToast} from "@/context/ToastContext";

export default function CompanyListPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { showToast } = useToast()
  const queryClient = useQueryClient()

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('query') ?? ""

  const [inputValue, setInputValue] = useState(search)

  // Debounce: sau khi user ngừng gõ mới ghi vào URL (qua handleSearch)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== search) handleSearch(inputValue)
    }, debounced_search_timeout)
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

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["company-list", page, search],
    queryFn: () => companyApi.getList({ page, search: search }),
  })

  const companies = data?.data ?? []

  const { mutate: toggleActive, isPending: isToggling, variables: togglingVars } = useMutation({
    mutationFn: ({ id, is_active }: { id: number; is_active: boolean }) => companyApi.update(id, { is_active }),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["company-list"] })
      const label = updated.short_name || updated.name
      showToast("success", updated.is_active ? `Đã hoạt động công ty ${label}!` : `Đã dừng hoạt động công ty ${label}!`)
    },
    onError: (err: any) => {
      queryClient.invalidateQueries({ queryKey: ["company-list"] })
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
    },
  })

  return (
    <AdminLayout breadcrumb={organization.company.list}>
      <div className="toolbar justify-between">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass"/>
          <input
            type="text"
            placeholder="Tìm theo tên, mã số thuế..."
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className={"flex gap-[6px]"}>
          <Link href={ROUTES.ORGANIZATION_COMPANY} className="btn btn-primary" style={{ width: "auto"}}>
            <i className="fas fa-rotate-left"/>  Đặt lại
          </Link>
          <Link href={`${ROUTES.ORGANIZATION_COMPANY}/create`} className="btn btn-primary" style={{ width: "auto" }}>
            <i className="fa-solid fa-plus"/> Thêm mới
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          {(isFetching) && <TableLoadingOverlay />}
          <table className="data-table">
            <thead>
                <tr>
                  <th className="col-stt">STT</th>
                  <th>Tên công ty</th>
                  <th>Tên viết tắt</th>
                  <th className="ms-center">Kích hoạt</th>
                  <th className="col-action">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && companies.length === 0 && (
                  <tr className="row-empty">
                    <td colSpan={5}>
                      <EmptyState
                        title={NO_RECORD_TITLE}
                        desc={NO_RECORD_DES}
                        actionUrl={`${ROUTES.ORGANIZATION_COMPANY}/create`}
                        actionLabel={LABEL_CREATE}
                      />
                    </td>
                  </tr>
                )}
                {!isLoading && companies.map((company, index) => (
                  <tr key={company.id}>
                    <td className="col-stt">{(page - 1) * (data?.pagination.per_page ?? 10) + index + 1}</td>
                    <td>{company.name}</td>
                    <td>{company.short_name || "—"}</td>
                    <td className="ms-center">
                      <label className="switch has-tip" data-tooltip={company.is_active ? LABEL_ACTIVE : LABEL_INACTIVE}>
                        <input
                          type="checkbox"
                          checked={company.is_active}
                          disabled={isToggling && togglingVars?.id === company.id} /* Chỉ disable toggle ứng vs dòng đang được chọn */
                          onChange={(e) => toggleActive({ id: company.id, is_active: e.target.checked })}
                        />
                        <span className="switch-track"></span>
                      </label>
                    </td>
                    <td className="col-action">
                      <div className="action-btns">
                        <Link href={`${ROUTES.ORGANIZATION_COMPANY}/${company.id}`} className="action-icon view" data-tooltip="Xem"><i className="fa-solid fa-eye"/></Link>
                        <Link href={`${ROUTES.ORGANIZATION_COMPANY}/${company.id}/edit`} className="action-icon edit" data-tooltip="Sửa"><i className="fa-solid fa-pen"/></Link>
                        <button type="button" className="action-icon delete tip-top-left" data-tooltip="Xoá"><i className="fa-solid fa-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        {
          !isLoading && companies.length > 0 &&
          <AdminPagination page={page} totalPages={data?.pagination.last_page ?? 1} onPageChange={handlePageChange} />
        }
      </div>

      <DebugPanel data={{ isLoading, isFetching }} />
    </AdminLayout>
  )
}
