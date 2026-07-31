"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useParams, useRouter} from "next/navigation";
import SubmitButton from "@component/admin/SubmitButton";
import {useQuery} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import SkeletonInputField from "@component/admin/skeleton/SkeletonInputField";
import SkeletonTextareaField from "@component/admin/skeleton/SkeletonTextareaField";
import {LENGTH} from "@/config/validate-length";
import InputTextCounter from "@component/form/InputTextCounter";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect, useState} from "react";
import authApi from "@feature/auth/authApi";
import {MESSAGE_SERVER_ERROR_DEFAULT} from "@/config/constant";
import {useToast} from "@/context/ToastContext";
import DebugPanel from "@component/DebugPanel";
import FieldError from "@component/form/FieldError";
import {trans} from "@/config/validation";
import {delay} from "@/helper/helper";

// 1. Khai báo schema validate — khớp LENGTH đang có sẵn
const schema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên công ty").max(LENGTH.company.name, trans('max', '111111', { max: LENGTH.company.name })),
  short_name: z.string().max(LENGTH.company.short_name, trans('max', 'short_name', { max: LENGTH.company.short_name })).optional(),
  tax_code: z.string().optional(),
  // phone: z.string().optional(),
  // email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
  // website: z.string().optional(),
  // address: z.string().optional(),
  // description: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditCompanyPage() {
  const { showToast } = useToast()
  const router = useRouter()

  const { id } = useParams<{ id: string }>()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['company-edit', id],
    queryFn: () => companyApi.getDetail(id),
  })

  // 2. useForm — control dùng cho Controller, register dùng cho input thuần
  const { control, register, reset, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset]);

  const [name_value, short_name_value, tax_code_value] = useWatch({ control, name: ['name', 'short_name', 'tax_code'] })

  const postUpdate = async (formData) => {
    console.log(formData, '// formData')
    setIsSubmitting(true)
    try {
      delay(5000).then(r => console.log('waited 4000s'))
      const data = await companyApi.update(id, formData);
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        const fields = ["full_name", "gender", "type", "company_name", "phone", "password", "password_confirmation1"];
        // setErrors((prev) => ({
        //   ...prev, ...Object.fromEntries(fields.map((f) => [f, serverErrors[f]?.[0] ?? ""])),
        // }))
        if (err.response.data.message) {
          showToast("error", err.response.data.message)
        }
      } else {
        const errMsg = err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT;
        showToast("error", errMsg)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

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
        <div className="card-body">
          <form onSubmit={handleSubmit(postUpdate, (errs) => console.log('validate errors:', errs))}>
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <SkeletonInputField isLoading={isLoading} name={"name"} placeholder={"Nhập tên công ty"}
                                    value={data?.name ?? ""}/>
                {/*<input type="text" {...register('name')} placeholder={"Nhập tên công ty"}*/}
                {/*       maxLength={LENGTH.company.name}/>*/}
                <InputTextCounter maxLength={LENGTH.company.name} value={name_value}/>
              </div>
              <div className="field">
                <label>Tên viết tắt</label>
                <Controller
                  name="short_name"
                  control={control}
                  render={({field}) => {
                    return <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên viết tắt" {...field}
                                               maxLength={LENGTH.company.short_name}/>
                  }}
                />
                <InputTextCounter maxLength={LENGTH.company.short_name} value={short_name_value}/>
                <FieldError message={errors?.short_name?.message}/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Mã số thuế</label>
                <Controller
                  name="tax_code"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập mã số thuế" {...field}
                                        maxLength={LENGTH.company.tax_code}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.tax_code} value={tax_code_value}/>
              </div>
              <div className="field">
                <label>Ngày thành lập</label>
                <input type="date" name="established_date"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <SkeletonInputField isLoading={isLoading} name={"phone"} placeholder={"Nhập số điện thoại"}
                                    value={data?.phone ?? ""}/>
              </div>
              <div className="field">
                <label>Email</label>
                <SkeletonInputField isLoading={isLoading} type={"email"} name={"email"} placeholder={"Nhập email"}
                                    value={data?.email ?? ""}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Website</label>
                <SkeletonInputField isLoading={isLoading} name={"website"} placeholder={"Nhập website"}
                                    value={data?.website ?? ""}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <SkeletonInputField isLoading={isLoading} name={"address"} placeholder={"Nhập địa chỉ"}
                                    value={data?.address ?? ""}/>
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
                <SkeletonTextareaField isLoading={isLoading} name="description" rows={3}
                                       value={data?.description ?? ""}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Logo công ty</label>
                <input type="file" name="logo" accept="image/*"/>
              </div>
            </div>

            <div className="card-footer">
              <button type="button" className="btn btn-outline" onClick={() => router.back()}>
                <i className="fas fa-arrow-left"></i> Quay lại
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                <i className="fas fa-floppy-disk"></i> {isSubmitting ? "Đang lưu..." : "Lưu"}
              </button>
              {/*<SubmitButton/>*/}
            </div>
          </form>
        </div>
      </div>

      {/*<DebugPanel data={{ isSubmitting }} />*/}
    </AdminLayout>

  )
}
