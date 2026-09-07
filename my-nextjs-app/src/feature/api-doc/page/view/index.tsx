"use client"

import { useState } from "react"
import { Skeleton } from "antd"
import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import AdminLayout from "@component/admin/AdminLayout"
import SkeletonField from "@component/admin/Skeleton/SkeletonField"
import { ROUTES } from "@/config/route"
import { apiDoc } from "@/config/breadcrumb"
import { TOAST } from "@/config/constant"
import { useToast } from "@/context/ToastContext"
import { IconCopy } from "@icon"
import apiDocApi from "@feature/api-doc/apiDocApi"
import styles from "./index.module.scss"

const METHOD_CLASS: Record<string, string> = {
  GET: styles.methodGet,
  POST: styles.methodPost,
  PUT: styles.methodPut,
  PATCH: styles.methodPatch,
  DELETE: styles.methodDelete,
}

type ParamRow = { name: string; type: string; required: string; description: string }

function parseParameters(raw?: string | null): ParamRow[] {
  if (!raw) return []
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(/^(.+?)\s*\(([^)]*)\)\s*:\s*(.*)$/)
      if (!match) return { name: line, type: "", required: "", description: "" }
      const [, name, meta, description] = match
      const commaIdx = meta.indexOf(",")
      const type = commaIdx === -1 ? meta.trim() : meta.slice(0, commaIdx).trim()
      const required = commaIdx === -1 ? "" : meta.slice(commaIdx + 1).trim()
      return { name: name.trim(), type, required, description: description.trim() }
    })
}

function requiredClass(required: string) {
  if (required === "required") return styles.reqRequired
  if (required === "optional") return styles.reqOptional
  if (required) return styles.reqConditional
  return ""
}

function resolveHost(curl?: string | null, appUrl?: string | null): string {
  if (!curl) return ""
  if (!appUrl) return curl
  return curl.replace(/\{\{\s*host\s*\}\}/gi, appUrl)
}

export default function ApiDocViewPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["api_doc_show", id],
    queryFn: () => apiDocApi.getDetail(Number(id)),
  })

  const paramRows = parseParameters(data?.parameters)
  const curlText = resolveHost(data?.curl_example, data?.app_url)

  const handleCopyCurl = async () => {
    if (!curlText) return
    try {
      await navigator.clipboard.writeText(curlText)
      setCopied(true)
      showToast(TOAST.TYPE.SUCCESS, "Đã copy cURL")
      setTimeout(() => setCopied(false), 1500)
    } catch {
      showToast(TOAST.TYPE.ERROR, "Không thể copy")
    }
  }

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
            <div className="field">
              <label>cURL</label>
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                <div className={styles.codeWrap}>
                  <pre className={styles.codeBlock}>{curlText || "—"}</pre>
                  {curlText && (
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={handleCopyCurl}
                      title={copied ? "Đã copy" : "Copy"}
                    >
                      <IconCopy className={styles.copyIcon} />
                    </button>
                  )}
                </div>
              </Skeleton>
            </div>
          </div>

          <div className="frow c2">
            <div className="field">
              <label>Tham số</label>
              <Skeleton loading={isLoading} active paragraph={{ rows: 3 }}>
                {paramRows.length === 0 ? (
                  <div className={styles.paramEmpty}>Không có tham số</div>
                ) : (
                  <div className="table-wrap">
                    <table className="data-table data-table--compact">
                      <thead>
                        <tr>
                          <th>Tham số</th>
                          <th>Kiểu</th>
                          <th>Bắt buộc</th>
                          <th>Mô tả</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paramRows.map((row, idx) => (
                          <tr key={idx}>
                            <td><code>{row.name}</code></td>
                            <td>{row.type}</td>
                            <td>
                              {row.required && (
                                <span className={`${styles.reqBadge} ${requiredClass(row.required)}`}>{row.required}</span>
                              )}
                            </td>
                            <td>{row.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Skeleton>
            </div>

            <div className="field">
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
