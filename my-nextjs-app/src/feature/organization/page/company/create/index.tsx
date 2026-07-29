"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useRouter} from "next/navigation";
import SubmitButton from "@component/admin/SubmitButton";

export default function CreateCompanyPage() {
  const router = useRouter()

  return (
    <AdminLayout breadcrumb={organization.company.create}>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <input type="text" name="name" placeholder="Nhập tên công ty"/>
              </div>
              <div className="field">
                <label>Tên viết tắt</label>
                <input type="text" name="short_name" placeholder="Nhập tên viết tắt"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Mã số thuế</label>
                <input type="text" name="tax_code" placeholder="Nhập mã số thuế"/>
              </div>
              <div className="field">
                <label>Ngày thành lập</label>
                <input type="date" name="established_date"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <input type="text" name="phone" placeholder="Nhập số điện thoại"/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" name="email" placeholder="Nhập email"/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Website</label>
                <input type="text" name="website" placeholder="Nhập website"/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <input type="text" name="address" placeholder="Nhập địa chỉ"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Người đại diện</label>
                <select name="representative_id">
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

            <div className="frow c1">
              <div className="field">
                <label>Giới thiệu / Mô tả</label>
                <textarea name="description" rows={3}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Logo công ty</label>
                <input type="file" name="logo" accept="image/*"/>
              </div>
            </div>
          </form>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <SubmitButton />
          {/*<button type="submit" className="btn btn-primary"><i className="fas fa-floppy-disk"></i> Lưu</button>*/}
        </div>
      </div>
    </AdminLayout>
  )
}
