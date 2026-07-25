"use client"

type AdminPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">Trang {page}/{totalPages || 1}</div>
      <div className="admin-pagination-nav">
        <button type="button" className="dt-paging-button" disabled={page <= 1} onClick={() => onPageChange(1)}>«</button>
        <button type="button" className="dt-paging-button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>
        <button type="button" className="dt-paging-button current">{page}</button>
        <button type="button" className="dt-paging-button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>›</button>
        <button type="button" className="dt-paging-button" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>»</button>
      </div>
    </div>
  )
}
