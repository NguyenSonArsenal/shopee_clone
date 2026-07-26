import AdminLayout from "@component/admin/AdminLayout"
import Link from "next/link"
import { ROUTES } from "@/config/route"

export default function ViewCompanyPage() {
  return (
    <AdminLayout breadcrumb={[
      { label: "Cơ cấu tổ chức", href: ROUTES.ORGANIZATION },
      { label: "Thông tin công ty", href: ROUTES.ORGANIZATION_COMPANY },
      { label: "Chi tiết công ty" },
    ]}>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field">
              <label>Tên công ty</label>
              <div>—</div>
            </div>
            <div className="field">
              <label>Tên viết tắt</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Mã số thuế</label>
              <div>—</div>
            </div>
            <div className="field">
              <label>Ngày thành lập</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Điện thoại</label>
              <div>—</div>
            </div>
            <div className="field">
              <label>Email</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Website</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Địa chỉ</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Người đại diện</label>
              <div>—</div>
            </div>
            <div className="field">
              <label>Người quản lý</label>
              <div>—</div>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Giới thiệu / Mô tả</label>
              <div>—</div>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <Link href={ROUTES.ORGANIZATION_COMPANY} className="btn btn-outline btn-md">Quay lại</Link>
          <Link href={ROUTES.ORGANIZATION_COMPANY} className="btn btn-primary btn-md">
            <i className="fa-solid fa-pen"/> Sửa
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
