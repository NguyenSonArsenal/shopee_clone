"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/AdminPagination"
import TableLoadingOverlay from "@component/admin/TableLoadingOverlay"
import EmptyState from "@component/admin/EmptyState"
import { ROUTES } from "@/config/route"
import { organization } from "@/config/breadcrumb"
import companyApi from "@/feature/organization/companyApi"
import {debounced_search_timeout} from "@/config/constant";
import DebugPanel from "@component/DebugPanel";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

export default function CompanyListPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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

      <div className="card">
        <div className="card-body">
          <div className="table-wrap">
            {(isFetching) && <TableLoadingOverlay />}
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-stt">STT</th>
                  <th>Tên công ty</th>
                  <th>Tên viết tắt</th>
                  <th className="col-action">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {!isLoading && companies.length === 0 && (
                  <tr className="row-empty">
                    <td colSpan={4}>
                      <EmptyState
                        title="Chưa có dữ liệu"
                        desc="Hãy bắt đầu bằng cách thêm mới"
                        actionUrl={`${ROUTES.ORGANIZATION_COMPANY}/create`}
                        actionLabel="Thêm mới"
                      />
                    </td>
                  </tr>
                )}
                {!isLoading && companies.map((company, index) => (
                  <tr key={company.id}>
                    <td className="col-stt">{(page - 1) * (data?.pagination.per_page ?? 10) + index + 1}</td>
                    <td>{company.name}</td>
                    <td>{company.short_name || "—"}</td>
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
      </div>

      <DebugPanel data={{ isLoading, isFetching }} />
    </AdminLayout>
  )
}
