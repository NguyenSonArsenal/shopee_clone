"use client"

import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/Skeleton/SkeletonField";
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { organization } from "@/config/breadcrumb"
import companyApi from "@/feature/organization/companyApi"
import { useRouter } from 'next/navigation'
import {ROUTES} from "@/config/route";

export default function CompanyDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company_show", id],
    queryFn: () => companyApi.getDetail(id),
  })

  const breadcrumb = [
    organization.company.detail[0],
    organization.company.detail[1],
    { label: data?.name || "Chi tiết" },
  ]

  if (isError) {
    return (
      <AdminLayout breadcrumb={breadcrumb}>
        <div className="card"><div className="card-body">Không tải được thông tin công ty.</div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout breadcrumb={breadcrumb}>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field field-view">
              <label>Tên công ty</label>
              <SkeletonField isLoading={isLoading} value={data?.name}/>
            </div>
            <div className="field field-view">
              <label>Tên viết tắt</label>
              <SkeletonField isLoading={isLoading} value={data?.short_name}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field field-view">
              <label>Mã số thuế</label>
              <SkeletonField isLoading={isLoading} value={data?.tax_code}/>
            </div>
            <div className="field field-view">
              <label>Ngày thành lập</label>
              <SkeletonField isLoading={isLoading} value={data?.established_date ? new Date(data?.established_date).toLocaleDateString("vi-VN") : ""}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field field-view">
              <label>Điện thoại</label>
              <SkeletonField isLoading={isLoading} value={data?.phone}/>
            </div>
            <div className="field field-view">
              <label>Email</label>
              <SkeletonField isLoading={isLoading} value={data?.email}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field field-view">
              <label>Người đại diện</label>
              <SkeletonField isLoading={isLoading} value={data?.representative?.full_name}/>
            </div>
            <div className="field field-view">
              <label>Người quản lý</label>
              <SkeletonField isLoading={isLoading} value={data?.manager?.full_name}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Website</label>
              <SkeletonField isLoading={isLoading} value={data?.website}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Địa chỉ</label>
              <SkeletonField isLoading={isLoading} value={data?.address}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Giới thiệu / Mô tả</label>
              <SkeletonField isLoading={isLoading} value={data?.description}/>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>

          <button type="submit" className="btn btn-primary" onClick={() => router.push(`${ROUTES.ORGANIZATION_COMPANY}/${data?.id}/edit`)}>
            <i className="fa-solid fa-pen"></i> Sửa
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
