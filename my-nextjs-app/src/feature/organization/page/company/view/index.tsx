"use client"

import AdminLayout from "@component/admin/AdminLayout"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "antd"
import { organization } from "@/config/breadcrumb"
import companyApi from "@/feature/organization/companyApi"
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";

export default function ViewCompanyPage() {
  // useParams() đọc segment động [id] trên URL, ví dụ /co-cau-to-chuc/cong-ty/1 -> id = "1"
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["company", id], // key này đổi theo id -> đổi company khác sẽ tự gọi lại API, không bị dính cache cũ
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
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.name || "-"}</div>
              </Skeleton>
            </div>
            <div className="field">
              <label>Tên viết tắt</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.short_name || "-"}</div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Mã số thuế</label>

              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.tax_code || "-"}</div>
              </Skeleton>
            </div>
            <div className="field">
              <label>Ngày thành lập</label>



              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.established_date ? new Date(data?.established_date).toLocaleDateString("vi-VN") : "-"}</div>
              </Skeleton>

            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Điện thoại</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.phone || "-"}</div>
              </Skeleton>
            </div>
            <div className="field">
              <label>Email</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.email || "-"}</div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Website</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.website || "-"}</div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Địa chỉ</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.address || "-"}</div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Người đại diện</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.representative?.full_name || "-"}</div>
              </Skeleton>
            </div>
            <div className="field">
              <label>Người quản lý</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.manager?.full_name || "-"}</div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field">
              <label>Giới thiệu / Mô tả</label>
              <Skeleton loading={isLoading} active paragraph={false} title={{ width: 120 }}>
                <div>{data?.description || "-"}</div>
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <Link href={ROUTES.ORGANIZATION_COMPANY} className="btn btn-outline"><i
            className="fas fa-arrow-left"></i> Quay lại</Link>
          <button type="submit" className="btn btn-primary"><i className="fa-solid fa-pen"></i> Sửa</button>
        </div>
      </div>
    </AdminLayout>
  )
}
