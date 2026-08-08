"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import SkeletonInputField from "@component/admin/skeleton/SkeletonInputField";
import SkeletonTextareaField from "@component/admin/skeleton/SkeletonTextareaField";
import {LENGTH} from "@/config/validate-length";
import InputTextCounter from "@component/form/InputTextCounter";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useEffect} from "react";
import {useToast} from "@/context/ToastContext";
import FieldError from "@component/form/FieldError";
import {trans, MESSAGE_SERVER_ERROR_DEFAULT, transMessage, transMessageNode} from "@/config/validation";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import {isBlank} from "@/helper/helper";
import {ERROR_VALIDATE_FORM} from "@/config/http-status";

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

  const {control, reset, handleSubmit, setError, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset]);

  const [name, short_name, tax_code, phone, website, email, address, description] =
    useWatch({control, name: ['name', 'short_name', 'tax_code', 'phone', 'website', 'email', 'address', 'description']})

  const {mutate, isPending} = useMutation({
    mutationFn: (formData: FormValues) => {
      console.log(formData, '// formData gửi lên API')
      return companyApi.update(id, formData)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["company-list"], refetchType: 'all'})
      queryClient.invalidateQueries({ queryKey: ['company-edit', id] })
      router.push(ROUTES.ORGANIZATION_COMPANY)
      showToast("success", transMessageNode('update_success', {label: short_name}))
    },
    onError: (err: any) => {
      console.log(err.response, '// err.response')
      if (err.response?.status === ERROR_VALIDATE_FORM) {
        const serverErrors = err.response?.data?.errors
        if (serverErrors) {
          Object.entries(serverErrors).forEach(([field, messages]) => {
            setError(field as keyof FormValues, {
              type: 'server',
              message: Array.isArray(messages) ? messages[0] : String(messages),
            })
          })
        }

        if (err.response.data.message) {
          showToast("error", err.response.data.message)
        }
      } else {
        const errMsg = err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT;
        showToast("error", errMsg)
      }
    },
  })

  return (
    <AdminLayout breadcrumb={organization.company.edit}>
      <div className="card">
        <form onSubmit={handleSubmit((formData) => mutate(formData))}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <Controller
                  name="name"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên công ty" {...field} maxLength={LENGTH.company.name}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.name} value={name}/>
                <FieldError message={errors?.name?.message}/>
              </div>
              <div className="field">
                <label>Tên viết tắt</label>
                <Controller
                  name="short_name"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên viết tắt" {...field} maxLength={LENGTH.company.short_name}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.short_name} value={short_name ?? ""}/>
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
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập mã số thuế" {...field} maxLength={LENGTH.company.tax_code}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.tax_code} value={tax_code ?? ""}/>
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
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập số điện thoại" {...field} maxLength={LENGTH.company.phone}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.phone} value={phone}/>
                <FieldError message={errors?.phone?.message}/>
              </div>
              <div className="field">
                <label>Email</label>
                <Controller
                  name="email"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} type="email" placeholder="Nhập email" {...field} maxLength={LENGTH.company.email}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.email} value={email}/>
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
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập website" {...field} maxLength={LENGTH.company.website}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.website} value={website}/>
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
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập địa chỉ" {...field} maxLength={LENGTH.company.address}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.address} value={address}/>
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
                    <SkeletonTextareaField maxLength={LENGTH.company.description} isLoading={isLoading} rows={3} {...field}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.company.description} value={description}/>
                <FieldError message={errors?.description?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Logo công ty</label>
                <input type="file" name="logo" accept="image/*"/>
              </div>
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
      <DebugPanel data={{isPending}}/>
    </AdminLayout>
  )
}
