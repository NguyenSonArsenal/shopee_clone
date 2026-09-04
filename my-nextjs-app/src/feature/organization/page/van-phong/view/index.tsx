"use client"

import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/Skeleton/SkeletonField";
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { organization } from "@/config/breadcrumb"
import branchApi from "@/feature/organization/branchApi"
import { useRouter } from 'next/navigation'
import { ROUTES } from "@/config/route"

export default function OfficeDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["branch_show", id],
    queryFn: () => branchApi.getDetail(id),
  })

  const breadcrumb = [
    organization.office.detail[0],
    organization.office.detail[1],
    { label: data?.name || "Chi tiết" },
  ]

  if (isError) {
    return (
      <AdminLayout breadcrumb={breadcrumb}>
        <div className="card"><div className="card-body">Không tải được thông tin văn phòng.</div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout breadcrumb={breadcrumb}>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field field-view">
              <label>Tên chi nhánh</label>
              <SkeletonField isLoading={isLoading} value={data?.name}/>
            </div>
            <div className="field field-view">
              <label>Mã</label>
              <SkeletonField isLoading={isLoading} value={data?.code}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field field-view">
              <label>Công ty</label>
              <SkeletonField isLoading={isLoading} value={data?.company?.name}/>
            </div>
            <div className="field field-view">
              <label>Điện thoại</label>
              <SkeletonField isLoading={isLoading} value={data?.phone}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field field-view">
              <label>Người quản lý</label>
              <SkeletonField isLoading={isLoading} value={data?.manager?.full_name}/>
            </div>
            <div className="field field-view">
              <label>Lễ tân</label>
              <SkeletonField isLoading={isLoading} value={data?.receptionist?.full_name}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Địa chỉ</label>
              <SkeletonField isLoading={isLoading} value={data?.address}/>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>

          <button type="button" className="btn btn-primary" onClick={() => router.push(`${ROUTES.ORGANIZATION_OFFICE}/${data?.id}/edit`)}>
            <i className="fa-solid fa-pen"></i> Sửa
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
