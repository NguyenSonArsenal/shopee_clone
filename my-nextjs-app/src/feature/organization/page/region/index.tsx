"use client"

import Link from "next/link"
import AdminLayout from "@component/admin/AdminLayout"
import AdminPagination from "@component/admin/AdminPagination"
import EmptyState from "@component/admin/EmptyState"
import { ROUTES } from "@/config/route"
import { organization } from "@/config/breadcrumb"
import {
  LABEL_ACTIVE, LABEL_CREATE, LABEL_INACTIVE,
  NO_RECORD_DES, NO_RECORD_TITLE,
  TOOLTIP_ICON_DELETE, TOOLTIP_ICON_EDIT, TOOLTIP_ICON_VIEW
} from "@/config/constant"
import ConfirmModal from "@modal/ConfirmModal"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useSearchParams} from "next/navigation";
import regionApi from "@feature/organization/regionApi";
import TableLoadingOverlay from "@component/admin/TableLoadingOverlay";
import {MESSAGE_SERVER_ERROR_DEFAULT, transMessage} from "@/config/validation";
import {useToast} from "@/context/ToastContext";
import {useState} from "react";

export default function RegionListPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { showToast } = useToast()
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page")) || 1;
  const [entity, setEntity] = useState();

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["region_list", page, search],
    queryFn: () => regionApi.getList({ page, search: search }),
  })

  const regionList =  data?.data || []

  const {mutation, mutate, isPending, variables} = useMutation({
    mutationFn: ({ id, is_active }) => regionApi.update(id, { is_active }),
    onSuccess: (updated) => {
      console.log(updated, '// updated')
      queryClient.invalidateQueries({ queryKey: ["region_list"] })
      const label = updated.name
      showToast("success", transMessage(updated.is_active ? 'activate_success' : 'deactivate_success', { label }))
    },
    onError: (err: any) => {
      console.log(err?.data, 'onError')
      showToast("error", err.response?.data?.message || err.message || MESSAGE_SERVER_ERROR_DEFAULT)
    },
  });

  return (
    <AdminLayout breadcrumb={organization.region.list}>
      <div className="toolbar justify-between">
        <div className="search-wrap">
          <i className="fa-solid fa-magnifying-glass"/>
          <input
            type="text"
            placeholder="Tìm theo tên, mã Vùng miền..."
            autoComplete="off"
          />
        </div>
        <div className={"flex gap-[6px]"}>
          <Link href={ROUTES.ORGANIZATION_REGION} className="btn btn-primary" style={{ width: "auto" }}>
            <i className="fas fa-rotate-left"/> Đặt lại
          </Link>
          <Link href={`${ROUTES.ORGANIZATION_REGION}/create`} className="btn btn-primary" style={{ width: "auto" }}>
            <i className="fa-solid fa-plus"/> Thêm mới
          </Link>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          {(isFetching) && <TableLoadingOverlay />}
          <table className="data-table">
            <thead>
              <tr>
                <th className="col-stt">STT</th>
                <th>Tên vùng miền</th>
                <th>Mã</th>
                <th>Công ty</th>
                <th>Người quản lý</th>
                <th className="text-center">Số chi nhánh</th>
                <th className="ms-center">Trạng thái</th>
                <th className="col-action">Thao tác</th>
              </tr>
            </thead>
            <tbody>

              {!isLoading && regionList.length === 0 && (
                <tr className="row-empty">
                  <td colSpan={9}>
                    <EmptyState
                      title={NO_RECORD_TITLE}
                      desc={NO_RECORD_DES}
                      actionUrl={`${ROUTES.ORGANIZATION_REGION}/create`}
                      actionLabel={LABEL_CREATE}
                    />
                  </td>
                </tr>
              )}
              {regionList.map((region, index) => (
                <tr key={region.id}>
                  <td className="col-stt">{(page - 1) * (data?.pagination.per_page ?? 10) + index + 1}</td>
                  <td className={"font-bold"}>{region.name}</td>
                  <td>{region.code || "—"}</td>
                  <td>{region.company_name || "—"}</td>
                  <td>{region.manager_name || "—"}</td>
                  <td className="text-center">{region.branch_count}</td>
                  <td className="text-center">
                    <label className="switch has-tip" data-x={region.is_active} data-tooltip={region.is_active ? LABEL_ACTIVE : LABEL_INACTIVE}>
                      <input type="checkbox" checked={region.is_active} disabled={variables?.id == region.id && isPending}
                             onChange={() => mutate({id: region?.id, is_active: !region?.is_active})}
                      />

                      <span className="switch-track"></span>
                    </label>
                  </td>
                  <td className="col-action">
                    <div className="action-btns">
                      <Link href={`${ROUTES.ORGANIZATION_REGION}/${region.id}`} className="action-icon view"
                            data-tooltip={TOOLTIP_ICON_VIEW}>
                        <i className="fa-solid fa-eye"/>
                      </Link>
                      <Link href={`${ROUTES.ORGANIZATION_REGION}/${region.id}/edit`} className="action-icon edit"
                            data-tooltip={TOOLTIP_ICON_EDIT}>
                        <i className="fa-solid fa-pen"/>
                      </Link>
                      <button type="button" className="action-icon delete tip-top-left"
                              data-tooltip={TOOLTIP_ICON_DELETE}
                              onClick={() => setEntity(region)}>
                        <i className="fa-solid fa-trash"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {regionList.length > 0 && (
          <AdminPagination page={1} totalPages={1} onPageChange={() => {}}/>
        )}
      </div>

      <ConfirmModal
        open={!!entity}
        message={<>Xoá &quot;<b>{entity?.name}</b>&quot;?</>}
        onClose={() => setEntity(null)}
        onConfirm={() => setEntity(null)}
      />
    </AdminLayout>
  )
}
