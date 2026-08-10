"use client"

import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/skeleton/SkeletonField"
import { useParams, useRouter } from "next/navigation"
import { organization } from "@/config/breadcrumb"
import { ROUTES } from "@/config/route"
import { REGION_MOCK_LIST } from "@feature/organization/page/region/mock"
import { LABEL_ACTIVE, LABEL_INACTIVE } from "@/config/constant"

export default function RegionDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const data = REGION_MOCK_LIST.find((r) => r.id === Number(id))

  return (
    <AdminLayout breadcrumb={organization.region.detail}>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field">
              <label>Tên vùng miền</label>
              <SkeletonField isLoading={false} value={data?.name}/>
            </div>
            <div className="field">
              <label>Mã</label>
              <SkeletonField isLoading={false} value={data?.code}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Công ty</label>
              <SkeletonField isLoading={false} value={data?.company_name}/>
            </div>
            <div className="field">
              <label>Người quản lý</label>
              <SkeletonField isLoading={false} value={data?.manager_name}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Điện thoại</label>
              <SkeletonField isLoading={false} value={data?.phone}/>
            </div>
            <div className="field">
              <label>Email</label>
              <SkeletonField isLoading={false} value={data?.email}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Địa chỉ</label>
              <SkeletonField isLoading={false} value={data?.address}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Số chi nhánh</label>
              <SkeletonField isLoading={false} value={data?.branch_count}/>
            </div>
            <div className="field">
              <label>Trạng thái</label>
              <SkeletonField isLoading={false} value={data?.is_active ? LABEL_ACTIVE : LABEL_INACTIVE}/>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>

          <button type="button" className="btn btn-primary" onClick={() => router.push(`${ROUTES.ORGANIZATION_REGION}/${data?.id}/edit`)}>
            <i className="fa-solid fa-pen"></i> Sửa
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
