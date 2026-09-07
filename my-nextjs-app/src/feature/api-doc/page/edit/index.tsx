"use client"

import AdminLayout from "@component/admin/AdminLayout"
import {apiDoc} from "@/config/breadcrumb"
import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import apiDocApi from "@feature/api-doc/apiDocApi";
import SkeletonInputField from "@component/admin/Skeleton/SkeletonInputField";
import SkeletonTextareaField from "@component/admin/Skeleton/SkeletonTextareaField";
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
import {ERROR_VALIDATE_FORM} from "@/config/http-status";
import {ApiDocFormValues, apiDocSchema, HTTP_METHODS} from "@feature/api-doc/apiDocSchema";
import styles from "./index.module.scss";

export default function ApiDocEditPage() {
  const {showToast} = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

  const {id} = useParams<{ id: string }>()

  const {data, isLoading, isError} = useQuery({
    queryKey: ['api_doc_show', id],
    queryFn: () => apiDocApi.getDetail(Number(id)),
  })

  const {control, reset, handleSubmit, setError, formState: {errors}} = useForm<ApiDocFormValues>({
    resolver: zodResolver(apiDocSchema),
  })

  useEffect(() => {
    if (data) {
      reset({...data, method: data.method as ApiDocFormValues['method']})
    }
  }, [data, reset]);

  const [module, url, description] = useWatch({control, name: ['module', 'url', 'description']})

  const breadcrumb = data?.url
    ? [
        apiDoc.edit[0],
        { label: data.url, href: `${ROUTES.SWAGGER}/${id}` },
        apiDoc.edit[1],
      ]
    : apiDoc.edit

  const {mutate, isPending} = useMutation({
    mutationFn: (formData: ApiDocFormValues) => apiDocApi.update(Number(id), formData),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["api_doc_list"], refetchType: 'all'})
      queryClient.invalidateQueries({ queryKey: ['api_doc_show', id] })
      router.push(`${ROUTES.SWAGGER}/${id}`)
      showToast("success", transMessage('update_success', {label: url}))
    },
    onError: (err: any) => {
      if (err.response?.status === ERROR_VALIDATE_FORM) {
        const serverErrors = err.response?.data?.errors
        if (serverErrors) {
          Object.entries(serverErrors).forEach(([field, messages]) => {
            setError(field as keyof ApiDocFormValues, {
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
    <AdminLayout breadcrumb={breadcrumb} hideSidebar>
      <div className="card">
        <form onSubmit={handleSubmit((formData) => mutate(formData))}>
          <div className="card-body">
            <div className="frow c2">
              <div className="field">
                <label>Module <span className="req">*</span></label>
                <Controller
                  name="module"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập tên module" {...field} maxLength={LENGTH.api_doc.module}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.api_doc.module} value={module}/>
                <FieldError message={errors?.module?.message}/>
              </div>
              <div className="field">
                <label>Method <span className="req">*</span></label>
                <Controller
                  name="method"
                  control={control}
                  render={({field}) => (
                    <select {...field}>
                      {HTTP_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  )}
                />
                <FieldError message={errors?.method?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Url <span className="req">*</span></label>
                <Controller
                  name="url"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập url, ví dụ: login" {...field} maxLength={LENGTH.api_doc.url}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.api_doc.url} value={url}/>
                <FieldError message={errors?.url?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>Mô tả</label>
                <Controller
                  name="description"
                  control={control}
                  render={({field}) => (
                    <SkeletonInputField isLoading={isLoading} placeholder="Nhập mô tả" {...field} value={field.value ?? ""} maxLength={LENGTH.api_doc.description}/>
                  )}
                />
                <InputTextCounter maxLength={LENGTH.api_doc.description} value={description ?? ""}/>
                <FieldError message={errors?.description?.message}/>
              </div>
            </div>

            <div className="frow c1">
              <div className="field">
                <label>cURL mẫu</label>
                <Controller
                  name="curl_example"
                  control={control}
                  render={({field}) => (
                    <SkeletonTextareaField isLoading={isLoading} name={field.name} placeholder="Nhập curl mẫu" rows={4} className={styles.codeTextarea} value={field.value} onChange={field.onChange} onBlur={field.onBlur}/>
                  )}
                />
                <FieldError message={errors?.curl_example?.message}/>
              </div>
            </div>

            <div className="frow c2">
              <div className="field">
                <label>Tham số</label>
                <Controller
                  name="parameters"
                  control={control}
                  render={({field}) => (
                    <SkeletonTextareaField isLoading={isLoading} name={field.name} placeholder="Nhập tham số" rows={4} className={styles.codeTextarea} value={field.value} onChange={field.onChange} onBlur={field.onBlur}/>
                  )}
                />
                <FieldError message={errors?.parameters?.message}/>
              </div>

              <div className="field">
                <label>Response mẫu</label>
                <Controller
                  name="response_sample"
                  control={control}
                  render={({field}) => (
                    <SkeletonTextareaField isLoading={isLoading} name={field.name} placeholder="Nhập response mẫu" rows={6} className={styles.codeTextarea} value={field.value} onChange={field.onChange} onBlur={field.onBlur}/>
                  )}
                />
                <FieldError message={errors?.response_sample?.message}/>
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
    </AdminLayout>
  )
}
