"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useRouter} from "next/navigation";
import SubmitButton from "@component/admin/SubmitButton";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {trans, MESSAGE_SERVER_ERROR_DEFAULT, transMessage} from "@/config/validation";
import {LENGTH} from "@/config/validate-length";
import InputTextCounter from "@component/form/InputTextCounter";
import FieldError from "@component/form/FieldError";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import companyApi from "@feature/organization/companyApi";
import {ERROR_VALIDATE_FORM} from "@/config/http-status";
import {useToast} from "@/context/ToastContext";
import {ROUTES} from "@/config/route";
import {CompanyFormValues, companySchema} from "@feature/organization/companySchema";

export default function CreateCompanyPage() {
  const {showToast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {control, register, reset, handleSubmit, setError, formState: {errors}} = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
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
            setError(field as keyof CompanyFormValues, {
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
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
