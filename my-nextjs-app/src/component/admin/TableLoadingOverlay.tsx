"use client"

export default function TableLoadingOverlay({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className="dt-processing">
      {text}
      <div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  )
}
