"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import SkeletonInputField from "@component/admin/skeleton/SkeletonInputField";
import SkeletonTextareaField from "@component/admin/skeleton/SkeletonTextareaField";
import UserSelect from "@component/admin/UserSelect";
import {LENGTH} from "@/config/validate-length";
import InputTextCounter from "@component/form/InputTextCounter";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect} from "react";
import {MESSAGE_SERVER_ERROR_DEFAULT} from "@/config/constant";
import {useToast} from "@/context/ToastContext";
import FieldError from "@component/form/FieldError";
import {trans} from "@/config/validation";
import {ROUTES} from "@/config/route";

// "" / null / undefined đều coi như "chưa nhập" — bỏ qua check định dạng cho field optional khi chưa có giá trị
const isBlank = (v: string | null | undefined) => v === null || v === undefined || v === ""

const schema = z.object({
  name: z.string().min(1, trans('required', 'name')).max(LENGTH.company.name, trans('max', 'name', {max: LENGTH.company.name})),
  short_name: z.string().max(LENGTH.company.short_name, trans('max', 'short_name', {max: LENGTH.company.short_name})).nullable().optional(),
  tax_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional()
    .refine((v) => isBlank(v) || /^0[0-9]{9}$/.test(v), trans('regex', 'phone')),
  email: z.string().max(LENGTH.company.email, trans('max', 'email', {max: LENGTH.company.email})).nullable().optional()
    .refine((v) => isBlank(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), trans('email', 'email')),
  website: z.string().max(LENGTH.company.website, trans('max', 'website', {max: LENGTH.company.website})).nullable().optional()
    .refine((v) => isBlank(v) || /^https?:\/\/.+/.test(v), trans('url', 'website')),
  address: z.string().max(LENGTH.company.address, trans('max', 'address', {max: LENGTH.company.address})).nullable().optional(),
  description: z.string().nullable().optional(),
  established_date: z.string().nullable().optional()
    .refine((v) => isBlank(v) || new Date(v) <= new Date(), trans('before_or_equal', 'established_date', {date: 'hôm nay'})),
  representative_id: z.number().nullable().optional(),
  manager_id: z.number().nullable().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditCompanyPage() {
  const {showToast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {id} = useParams<{ id: string }>()

  const {data, isLoading, isError} = useQuery({
    queryKey: ['company-edit', id],
    queryFn: () => companyApi.getDetail(id),
  })

  const {control, reset, handleSubmit, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset]);

  const [name_value, short_name_value, tax_code_value] = useWatch({control, name: ['name', 'short_name', 'tax_code']})

  const {mutate, isPending} = useMutation({
    mutationFn: (formData: FormValues) => companyApi.update(id, formData),
    onSuccess: () => {
      showToast("success", "Cập nhật công ty thành công")
      queryClient.invalidateQueries({queryKey: ["company-list"]})
      router.push(ROUTES.ORGANIZATION_COMPANY)
    },
    onError: (err: any) => {
      if (err.response?.status === 422) {
        if (err.response.data.message) {
          showToast("error", err.response.data.message)
        }
      } else {
        const errMsg = err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT;
        showToast("error", errMsg)
      }
    },
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
        <div className="card-body">
          <form onSubmit={handleSubmit((formData) => mutate(formData))}>
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <Controller
                  name="name"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên công ty" {...field}
                                        maxLength={LENGTH.company.name}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.name} value={name_value}/>
                <FieldError message={errors?.name?.message}/>
              </div>
              <div className="field">
                <label>Tên viết tắt</label>
                <Controller
                  name="short_name"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên viết tắt" {...field}
                                        maxLength={LENGTH.company.short_name}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.short_name} value={short_name_value ?? ""}/>
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
                <InputTextCounter maxLength={LENGTH.company.tax_code} value={tax_code_value ?? ""}/>
                <FieldError message={errors?.tax_code?.message}/>
              </div>
              <div className="field">
                <label>Ngày thành lập</label>
                <Controller
                  name="established_date"
                  control={control}
                  render={({field}) => (
                    <input type="date" {...field} value={field.value ? String(field.value).slice(0, 10) : ""}/>
                  )}
                />
                <FieldError message={errors?.established_date?.message}/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <Controller
                  name="phone"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập số điện thoại" {...field}
                                        maxLength={LENGTH.company.phone}/>
                  )}
                />
                <FieldError message={errors?.phone?.message}/>
              </div>
              <div className="field">
                <label>Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} type="email" placeholder="Nhập email" {...field}
                                        maxLength={LENGTH.company.email}/>
                  )}
                />
                <FieldError message={errors?.email?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Website</label>
                <Controller
                  name="website"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập website" {...field}
                                        maxLength={LENGTH.company.website}/>
                  )}
                />
                <FieldError message={errors?.website?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <Controller
                  name="address"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập địa chỉ" {...field}
                                        maxLength={LENGTH.company.address}/>
                  )}
                />
                <FieldError message={errors?.address?.message}/>
              </div>
            </div>

            {/*<div className="frow c2">*/}
            {/*  <div className="field">*/}
            {/*    <label>Người đại diện</label>*/}
            {/*    <UserSelect control={control} name="representative_id"/>*/}
            {/*  </div>*/}
            {/*  <div className="field">*/}
            {/*    <label>Người quản lý</label>*/}
            {/*    <UserSelect control={control} name="manager_id"/>*/}
            {/*  </div>*/}
            {/*</div>*/}

            <div className="frow c1">
              <div className="field">
                <label>Giới thiệu / Mô tả</label>
                <Controller
                  name="description"
                  control={control}
                  render={({field}) => (
                    <SkeletonTextareaField isLoading={isLoading} rows={3} {...field}/>
                  )}
                />
                <FieldError message={errors?.description?.message}/>
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
              <button type="submit" className="btn btn-primary" disabled={isPending}>
                <i className="fas fa-floppy-disk"></i> {isPending ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
