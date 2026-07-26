import AdminLayout from "@component/admin/AdminLayout"
import Link from "next/link"
import { ROUTES } from "@/config/route"

export default function CreateCompanyPage() {
  return (
    <AdminLayout breadcrumb={[
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Thêm công ty" },
    ]}>
      <div className="card">
        <div className="card-head">
          <h3><i className="fa-solid fa-building"/> Thêm công ty</h3>
        </div>
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
          <Link href={ROUTES.ORGANIZATION_COMPANY} className="btn btn-outline btn-md">Huỷ</Link>
          <button type="button" className="btn btn-primary btn-md">Lưu công ty</button>
        </div>
      </div>
    </AdminLayout>
  )
}
