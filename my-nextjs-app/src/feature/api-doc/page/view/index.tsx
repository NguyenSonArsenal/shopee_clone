"use client"

import { Skeleton } from "antd"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/Skeleton/SkeletonField"
import { ROUTES } from "@/config/route"
import { apiDoc } from "@/config/breadcrumb"
import apiDocApi from "@feature/api-doc/apiDocApi"
import styles from "./index.module.scss"

const METHOD_CLASS: Record<string, string> = {
  GET: styles.methodGet,
  POST: styles.methodPost,
  PUT: styles.methodPut,
  PATCH: styles.methodPatch,
  DELETE: styles.methodDelete,
}

export default function ApiDocViewPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["api_doc_show", id],
    queryFn: () => apiDocApi.getDetail(Number(id)),
  })

  const breadcrumb = [
    apiDoc.view[0],
    { label: data?.url || "Chi tiết" },
  ]

  if (isError) {
    return (
      <AdminLayout breadcrumb={breadcrumb} hideSidebar>
        <div className="card"><div className="card-body">Không tải được thông tin API.</div></div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout breadcrumb={breadcrumb} hideSidebar>
      <div className="card">
        <div className="card-body">
          <div className="frow c2">
            <div className="field field-view">
              <label>Module</label>
              <SkeletonField isLoading={isLoading} value={data?.module} />
            </div>
            <div className="field field-view">
              <label>Endpoint</label>
              <Skeleton loading={isLoading} active title={{ width: 200 }} paragraph={false}>
                <div className="field-value">
                  <span className={`${styles.methodBadge} ${METHOD_CLASS[data?.method ?? ""] ?? ""}`}>{data?.method}</span>
                  <span className={styles.urlText}>{data?.url}</span>
                </div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Mô tả</label>
              <SkeletonField isLoading={isLoading} value={data?.description} />
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Tham số</label>
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                <pre className={styles.paramBlock}>{data?.parameters || "Không có tham số"}</pre>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>cURL</label>
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                <pre className={styles.codeBlock}>{data?.curl_example || "—"}</pre>
              </Skeleton>
            </div>
          </div>

          <div className="frow c1">
            <div className="field field-view">
              <label>Response mẫu</label>
              <Skeleton loading={isLoading} active paragraph={{ rows: 4 }}>
                <pre className={styles.codeBlock}>{data?.response_sample || "—"}</pre>
              </Skeleton>
            </div>
          </div>
        </div>
        <div className="card-footer">
          <button type="button" className="btn btn-outline" onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i> Quay lại
          </button>

          <button type="button" className="btn btn-primary" onClick={() => router.push(`${ROUTES.SWAGGER}/${data?.id}/edit`)}>
            <i className="fa-solid fa-pen"></i> Sửa
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
