"use client"

import AdminLayout from "@component/admin/AdminLayout"
import { organization } from "@/config/breadcrumb"
import { useParams, useRouter } from "next/navigation"
import SubmitButton from "@component/admin/SubmitButton"
import { LENGTH } from "@/config/validate-length"
import { REGION_MOCK_LIST } from "@feature/organization/page/region/mock"

export default function EditRegionPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const data = REGION_MOCK_LIST.find((r) => r.id === Number(id))

  return (
    <AdminLayout breadcrumb={organization.region.edit}>
      <div className="card">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Tên vùng miền <span className="req">*</span></label>
                <input type="text" name="name" defaultValue={data?.name ?? ""} maxLength={LENGTH.region.name} placeholder="Nhập tên vùng miền"/>
              </div>
              <div className="field">
                <label>Mã</label>
                <input type="text" name="code" defaultValue={data?.code ?? ""} maxLength={LENGTH.region.code} placeholder="Nhập mã vùng miền"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Công ty</label>
                <select name="company_id" defaultValue="">
                  <option value="">— Không chọn —</option>
                  {data?.company_name && <option value={data.company_name}>{data.company_name}</option>}
                </select>
              </div>
              <div className="field">
                <label>Người quản lý</label>
                <select name="manager_id" defaultValue="">
                  <option value="">— Không chọn —</option>
                  {data?.manager_name && <option value={data.manager_name}>{data.manager_name}</option>}
                </select>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <input type="text" name="phone" defaultValue={data?.phone ?? ""} maxLength={LENGTH.region.phone} placeholder="Nhập số điện thoại"/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" defaultValue={data?.email ?? ""} maxLength={LENGTH.region.email} placeholder="Nhập email"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Địa chỉ</label>
                <input type="text" name="address" defaultValue={data?.address ?? ""} maxLength={LENGTH.region.address} placeholder="Nhập địa chỉ"/>
              </div>
              <div className="field">
                <label>Trạng thái</label>
                <select name="is_active" defaultValue={data?.is_active ? "1" : "0"}>
                  <option value="1">Hoạt động</option>
                  <option value="0">Ngừng hoạt động</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button type="button" className="btn btn-outline" onClick={() => router.back()}>
              <i className="fas fa-arrow-left"></i> Quay lại
            </button>
            <SubmitButton/>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
