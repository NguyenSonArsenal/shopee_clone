"use client"

type AdminPaginationProps = {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

// Sinh danh sách nút số trang kiểu DataTables `full_numbers`: luôn có trang đầu/cuối,
// 1 dải 5 số liên tục quanh trang hiện tại, và "..." ở chỗ bị cắt khoảng cách.
function getPageNumbers(page: number, totalPages: number): (number | "...")[] {
  const windowSize = 5

  if (totalPages <= windowSize + 2) {
    // Ít trang thì hiện hết luôn, không cần "..."
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  let start = Math.max(1, page - Math.floor(windowSize / 2))
  let end = start + windowSize - 1

  if (end > totalPages) {
    end = totalPages
    start = end - windowSize + 1
  }

  const pages: (number | "...")[] = []

  if (start > 1) {
    pages.push(1)
    if (start > 2) pages.push("...")
  }

  for (let i = start; i <= end; i++) pages.push(i)

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...")
    pages.push(totalPages)
  }

  return pages
}

export default function AdminPagination({ page, totalPages, onPageChange }: AdminPaginationProps) {
  const pageNumbers = getPageNumbers(page, totalPages)

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-info">Trang {page}/{totalPages || 1}</div>
      <div className="admin-pagination-nav">
        <button type="button" className="dt-paging-button" disabled={page <= 1} onClick={() => onPageChange(1)}>«</button>
        <button type="button" className="dt-paging-button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>‹</button>

        {pageNumbers.map((p, index) =>
          p === "..." ? (
            <button key={`ellipsis-${index}`} type="button" className="dt-paging-button" disabled>…</button>
          ) : (
            <button
              key={p}
              type="button"
              className={`dt-paging-button${p === page ? " current" : ""}`}
              onClick={() => onPageChange(p)}
            >
              {p}
            </button>
          )
        )}

        <button type="button" className="dt-paging-button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>›</button>
        <button type="button" className="dt-paging-button" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>»</button>
      </div>
    </div>
  )
}
