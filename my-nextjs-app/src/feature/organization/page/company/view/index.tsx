"use client"

import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/SkeletonField";
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { organization } from "@/config/breadcrumb"
import companyApi from "@/feature/organization/companyApi"
import { useRouter } from 'next/navigation'

export default function CompanyDetailPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company", id],
    queryFn: () => companyApi.getDetail(id),
  })

  if (isError) {
    return (
      <AdminLayout breadcrumb={organization.company.detail}>
        <div className="card"><div className="card-body">Không tải được thông tin công ty.</div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout breadcrumb={organization.company.detail}>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field">
              <label>Tên công ty</label>
              <SkeletonField isLoading={isLoading} value={data?.name}/>
            </div>
            <div className="field">
              <label>Tên viết tắt</label>
              <SkeletonField isLoading={isLoading} value={data?.short_name}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Mã số thuế</label>
              <SkeletonField isLoading={isLoading} value={data?.tax_code}/>
            </div>
            <div className="field">
              <label>Ngày thành lập</label>
              <SkeletonField isLoading={isLoading} value={data?.established_date ? new Date(data?.established_date).toLocaleDateString("vi-VN") : ""}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Điện thoại</label>
              <SkeletonField isLoading={isLoading} value={data?.phone}/>
            </div>
            <div className="field">
              <label>Email</label>
              <SkeletonField isLoading={isLoading} value={data?.email}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Website</label>
              <SkeletonField isLoading={isLoading} value={data?.website}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Địa chỉ</label>
              <SkeletonField isLoading={isLoading} value={data?.address}/>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Người đại diện</label>
              <SkeletonField isLoading={isLoading} value={data?.representative?.full_name}/>
            </div>
            <div className="field">
              <label>Người quản lý</label>
              <SkeletonField isLoading={isLoading} value={data?.manager?.full_name}/>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Giới thiệu / Mô tả</label>
              <SkeletonField isLoading={isLoading} value={data?.description}/>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>
          <button type="submit" className="btn btn-primary">
            <i className="fa-solid fa-pen"></i> Sửa
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
