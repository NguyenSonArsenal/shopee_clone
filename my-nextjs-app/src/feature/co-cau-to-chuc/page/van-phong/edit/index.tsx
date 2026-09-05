"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {organization} from "@/config/breadcrumb";
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import branchApi from "@feature/co-cau-to-chuc/branchApi";
import SkeletonInputField from "@component/admin/Skeleton/SkeletonInputField";
import SkeletonField from "@component/admin/Skeleton/SkeletonField";
import {LENGTH} from "@/config/validate-length";
import InputTextCounter from "@component/form/InputTextCounter";
import {Controller, useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {useToast} from "@/context/ToastContext";
import FieldError from "@component/form/FieldError";
import {MESSAGE_SERVER_ERROR_DEFAULT} from "@/config/validation";
import {transMessage} from "@/lib/utils";
import {ROUTES} from "@/config/route";
import DebugPanel from "@component/DebugPanel";
import {ERROR_VALIDATE_FORM} from "@/config/http-status";
import {BranchFormValues, branchSchema} from "@feature/co-cau-to-chuc/branchSchema";

export default function EditOfficePage() {
  const {showToast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {id} = useParams<{ id: string }>()

  const {data, isLoading, isError} = useQuery({
    queryKey: ['branch-edit', id],
    queryFn: () => branchApi.getDetail(id),
  })

  const {control, reset, handleSubmit, setError, formState: {errors}} = useForm<BranchFormValues>({
    resolver: zodResolver(branchSchema),
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset]);

  const [name, code, phone, address] = useWatch({control, name: ['name', 'code', 'phone', 'address']})

  const breadcrumb = data?.name
    ? [
        organization.office.edit[0],
        organization.office.edit[1],
        { label: data.name, href: `${ROUTES.ORGANIZATION_OFFICE}/${id}` },
        organization.office.edit[2],
      ]
    : organization.office.edit

  const {mutate, isPending} = useMutation({
    mutationFn: (formData: BranchFormValues) => branchApi.update(Number(id), formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["branch_list"], refetchType: 'all'})
      queryClient.invalidateQueries({ queryKey: ['branch-edit', id] })
      router.push(ROUTES.ORGANIZATION_OFFICE)
      showToast("success", transMessage('update_success', {label: name}))
    },
    onError: (err: any) => {
      if (err.response?.status === ERROR_VALIDATE_FORM) {
        const serverErrors = err.response?.data?.errors
        if (serverErrors) {
          Object.entries(serverErrors).forEach(([field, messages]) => {
            setError(field as keyof BranchFormValues, {
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
    <AdminLayout breadcrumb={breadcrumb}>
      <div className="card">
        <form onSubmit={handleSubmit((formData) => mutate(formData))}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Tên chi nhánh <span className="req">*</span></label>
                <Controller
                  name="name"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên chi nhánh" {...field} maxLength={LENGTH.branch.name}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.branch.name} value={name}/>
                <FieldError message={errors?.name?.message}/>
              </div>
              <div className="field">
                <label>Mã</label>
                <Controller
                  name="code"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập mã chi nhánh" {...field} maxLength={LENGTH.branch.code}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.branch.code} value={code ?? ""}/>
                <FieldError message={errors?.code?.message}/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Điện thoại</label>
                <Controller
                  name="phone"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập số điện thoại" {...field} maxLength={LENGTH.branch.phone}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.branch.phone} value={phone ?? ""}/>
                <FieldError message={errors?.phone?.message}/>
              </div>
              <div className="field field-view">
                <label>Công ty</label>
                <SkeletonField isLoading={isLoading} value={data?.company?.name}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Địa chỉ</label>
                <Controller
                  name="address"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập địa chỉ" {...field} maxLength={LENGTH.branch.address}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.branch.address} value={address ?? ""}/>
                <FieldError message={errors?.address?.message}/>
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
