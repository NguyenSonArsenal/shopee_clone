"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useParams, useRouter} from "next/navigation";
import SubmitButton from "@component/admin/SubmitButton";
import {useQuery} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import DebugPanel from "@component/DebugPanel";
import {Skeleton} from "antd";
import SkeletonInputField from "@component/admin/skeleton/SkeletonInputField";
import SkeletonTextareaField from "@component/admin/skeleton/SkeletonTextareaField";

export default function EditCompanyPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-edit', id],
    queryFn: () => companyApi.getDetail(id),
  })

  if (isError) {
    return (
      <AdminLayout breadcrumb={organization.company.edit}>
        <div className="card"><div className="card-body">Không tải được thông tin công ty.</div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout breadcrumb={organization.company.edit}>
      <div className="card">
        <div className="card-head">
          <h3><i className="fa-solid fa-building"/> Sửa công ty</h3>
        </div>
        <div className="card-body">
          <form>
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <SkeletonInputField isLoading={isLoading} name={"name"} placeholder={"Nhập tên công ty"} value={data?.name ?? ""} />
              </div>
              <div className="field">
                <label>Tên viết tắt</label>
                <SkeletonInputField isLoading={isLoading} name={"short_name"} placeholder={"Nhập tên viết tắt"} value={data?.short_name ?? ""} />
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Mã số thuế</label>
                <SkeletonInputField isLoading={isLoading} name={"tax_code"} placeholder={"Nhập mã số thuế"} value={data?.tax_code ?? ""} />
              </div>
              <div className="field">
                <label>Ngày thành lập</label>
                <input type="date" name="established_date"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <SkeletonInputField isLoading={isLoading} name={"phone"} placeholder={"Nhập số điện thoại"} value={data?.phone ?? ""} />
              </div>
              <div className="field">
                <label>Email</label>
                <SkeletonInputField isLoading={isLoading} type={"email"} name={"email"} placeholder={"Nhập email"} value={data?.email ?? ""} />
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Website</label>
                <SkeletonInputField isLoading={isLoading} name={"website"} placeholder={"Nhập website"} value={data?.website ?? ""} />
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <SkeletonInputField isLoading={isLoading} name={"address"} placeholder={"Nhập địa chỉ"} value={data?.address ?? ""} />
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
                <SkeletonTextareaField isLoading={isLoading} name="description" rows={3} value={data?.description ?? ""} />
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
        </div>
      </div>

      <DebugPanel data={{ data, isLoading }} />
    </AdminLayout>
  )
}
