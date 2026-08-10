"use client"

import AdminLayout from "@component/admin/AdminLayout"
import { organization } from "@/config/breadcrumb"
import { useRouter } from "next/navigation"
import SubmitButton from "@component/admin/SubmitButton"
import { LENGTH } from "@/config/validate-length"

export default function CreateRegionPage() {
  const router = useRouter()

  return (
    <AdminLayout breadcrumb={organization.region.create}>
      <div className="card">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Tên vùng miền <span className="req">*</span></label>
                <input type="text" name="name" maxLength={LENGTH.region.name} placeholder="Nhập tên vùng miền"/>
              </div>
              <div className="field">
                <label>Mã</label>
                <input type="text" name="code" maxLength={LENGTH.region.code} placeholder="Nhập mã vùng miền"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Công ty</label>
                <select name="company_id">
                  <option value="">— Không chọn —</option>
                </select>
              </div>
              <div className="field">
                <label>Người quản lý</label>
                <select name="manager_id">
                  <option value="">— Không chọn —</option>
                </select>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <input type="text" name="phone" maxLength={LENGTH.region.phone} placeholder="Nhập số điện thoại"/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" maxLength={LENGTH.region.email} placeholder="Nhập email"/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <input type="text" name="address" maxLength={LENGTH.region.address} placeholder="Nhập địa chỉ"/>
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
