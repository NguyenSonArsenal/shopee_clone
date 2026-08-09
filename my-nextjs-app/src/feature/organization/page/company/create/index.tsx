"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useRouter} from "next/navigation";
import SubmitButton from "@component/admin/SubmitButton";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {trans, MESSAGE_SERVER_ERROR_DEFAULT, transMessage} from "@/config/validation";
import {LENGTH} from "@/config/validate-length";
import {isBlank} from "@/helper/helper";
import InputTextCounter from "@component/form/InputTextCounter";
import FieldError from "@component/form/FieldError";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import {ERROR_VALIDATE_FORM} from "@/config/http-status";
import {useToast} from "@/context/ToastContext";
import {ROUTES} from "@/config/route";

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
  description: z.string().max(LENGTH.company.description, trans('max', 'description', {max: LENGTH.company.description})).nullable().optional(),
  established_date: z.string().nullable().optional()
    .refine((v) => isBlank(v) || new Date(v) <= new Date(), trans('before_or_equal', 'established_date', {date: 'hôm nay'})),
  representative_id: z.number().nullable().optional(),
  manager_id: z.number().nullable().optional(),
})

type FormValues = z.infer<typeof schema>
export default function CreateCompanyPage() {
  const {showToast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {control, register, reset, handleSubmit, setError, formState: {errors}} = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const form = useWatch({control});

  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      return companyApi.store(formData)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["company_list"], refetchType: 'all'})
      router.push(ROUTES.ORGANIZATION_COMPANY)
      showToast("success", transMessage('store_success'))
    },
    onError: (err: any) => {
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
      } else { // Lỗi serve, network
        const errMsg = err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT;
        showToast("error", errMsg)
      }
    }
  });

  console.log(form, '// fiorm')

  return (
    <AdminLayout breadcrumb={organization.company.create}>
      <div className="card">
        <form onSubmit={handleSubmit(formData => mutate(formData))}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Tên công ty <span className="req">*</span></label>
                <input type="text" {...register('name')} maxLength={LENGTH.company.name} placeholder="Nhập tên công ty"/>
                <InputTextCounter maxLength={LENGTH.company.name} value={form['name']}/>
                <FieldError message={errors?.name?.message}/>
              </div>

              <div className="field">
                <label>Tên viết tắt</label>
                <input type="text" {...register("short_name")} maxLength={LENGTH.company.short_name} placeholder="Nhập tên viết tắt"/>
                <InputTextCounter maxLength={LENGTH.company.short_name} value={form.short_name}/>
                <FieldError message={errors?.short_name?.message}/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Mã số thuế</label>
                <input type="text" {...register('tax_code')} maxLength={LENGTH.company.tax_code} placeholder="Nhập mã số thuế"/>
                <InputTextCounter maxLength={LENGTH.company.tax_code} value={form.tax_code}/>
                <FieldError message={errors?.tax_code?.message}/>
              </div>
              <div className="field">
                <label>Ngày thành lập</label>
                <input type="date" name="established_date"/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <input type="text" {...register('phone')} maxLength={LENGTH.company.phone} placeholder="Nhập số điện thoại"/>
                <InputTextCounter maxLength={LENGTH.company.phone} value={form.phone}/>
                <FieldError message={errors?.phone?.message}/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" {...register('email')} maxLength={LENGTH.company.email} placeholder="Nhập email"/>
                <InputTextCounter maxLength={LENGTH.company.email} value={form.email}/>
                <FieldError message={errors?.email?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Website</label>
                <input type="text" {...register('website')} maxLength={LENGTH.company.website} placeholder="Nhập website"/>
                <InputTextCounter maxLength={LENGTH.company.website} value={form.website}/>
                <FieldError message={errors?.website?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <input type="text" {...register('address')} maxLength={LENGTH.company.address} placeholder="Nhập địa chỉ"/>
                <InputTextCounter maxLength={LENGTH.company.address} value={form.address}/>
                <FieldError message={errors?.address?.message}/>
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
                <textarea name="description" rows={3} {...register('description')} maxLength={LENGTH.company.description} />
                <InputTextCounter maxLength={LENGTH.company.description} value={form.description}/>
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
            <SubmitButton loading={isPending}/>
            {/*<button type="submit" className="btn btn-primary"><i className="fas fa-floppy-disk"></i> Lưu</button>*/}
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
