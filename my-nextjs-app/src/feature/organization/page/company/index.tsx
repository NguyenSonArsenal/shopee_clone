"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/AdminPagination"
import { ROUTES } from "@/config/route"

type Company = {
  id: number
  name: string
  short_name: string
  tax_code: string
  representative: string
  manager: string
  offices: number
  active: boolean
}

const INITIAL_COMPANIES: Company[] = [
  { id: 1, name: "Công ty CP Dịch Vụ Và Đầu Tư Tân Long", short_name: "Tân Long Land", tax_code: "0101491611", representative: "—", manager: "—", offices: 125, active: true },
  { id: 2, name: "Công ty CP tập đoàn Gosun Group", short_name: "Gosun Group", tax_code: "0110625572", representative: "—", manager: "—", offices: 1, active: true },
]

export default function CompanyListPage() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return companies
    return companies.filter((c) => c.name.toLowerCase().includes(keyword) || c.tax_code.includes(keyword))
  }, [companies, search])

  const toggleActive = (id: number) => {
    setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)))
  }

  return (
    <AdminLayout breadcrumb={[{ label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION }, { label: "Thông tin công ty" }]}>
      <div className="card">
        <div className="card-head">
          <h3><i className="fa-solid fa-building"/> Danh sách công ty</h3>
          <Link href={`${ROUTES.ORGANIZATION_COMPANY}/create`} className="btn btn-primary" style={{ width: "auto", padding: "8px 16px" }}>
            <i className="fa-solid fa-plus"/> Thêm công ty
          </Link>
        </div>
        <div className="card-body">
          <div className="toolbar">
            <div className="search-wrap">
              <i className="fa-solid fa-magnifying-glass"/>
              <input
                type="text"
                placeholder="Tìm theo tên, mã số thuế..."
                autoComplete="off"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-check"><input type="checkbox"/></th>
                  <th className="col-stt">STT</th>
                  <th>Tên công ty</th>
                  <th>Mã số thuế</th>
                  <th>Người đại diện</th>
                  <th>Người quản lý</th>
                  <th>Số văn phòng</th>
                  <th>Trạng thái</th>
                  <th className="col-action">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((company, index) => (
                  <tr key={company.id}>
                    <td className="col-check"><input type="checkbox"/></td>
                    <td className="col-stt">{index + 1}</td>
                    <td>
                      <strong>{company.name}</strong>
                      <div className="company-name-sub">{company.short_name}</div>
                    </td>
                    <td>{company.tax_code}</td>
                    <td>{company.representative}</td>
                    <td>{company.manager}</td>
                    <td>{company.offices}</td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={company.active} onChange={() => toggleActive(company.id)}/>
                        <span className="switch-track"/>
                      </label>
                    </td>
                    <td className="col-action">
                      <div className="action-btns">
                        <Link href={`${ROUTES.ORGANIZATION_COMPANY}/${company.id}`} className="action-icon view" data-tooltip="Xem"><i className="fa-solid fa-eye"/></Link>
                        <Link href={`${ROUTES.ORGANIZATION_COMPANY}/${company.id}/edit`} className="action-icon edit" data-tooltip="Sửa"><i className="fa-solid fa-pen"/></Link>
                        <button type="button" className="action-icon view" data-tooltip="Lịch sử"><i className="fa-solid fa-clock"/></button>
                        <button type="button" className="action-icon delete tip-top-left" data-tooltip="Xoá"><i className="fa-solid fa-trash"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <AdminPagination page={page} totalPages={1} onPageChange={setPage} />
        </div>
      </div>
    </AdminLayout>
  )
}
