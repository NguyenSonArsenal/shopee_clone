"use client"

import { useEffect, useRef, useState } from "react"

type SelectSingleOption = {
  value: string | number
  label: string
}

type SelectSingleProps = {
  options: SelectSingleOption[]
  value: string | number
  onChange: (value: string | number) => void
  dropUp?: boolean // Panel bung LÊN thay vì xuống — dùng cho ô nằm ở hàng chân bảng
}

export default function Index({ options, value, onChange, dropUp }: SelectSingleProps) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  // Bấm ra ngoài -> đóng panel
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleSelect(option: SelectSingleOption) {
    setOpen(false)
    if (option.value !== value) onChange(option.value)
  }

  return (
    <div ref={wrapRef} className={`select-single${open ? " open" : ""}${dropUp ? " select-single--up" : ""}`}>
      <div className="select-single-trigger" onClick={() => setOpen((o) => !o)}>
        <span className={`select-single-value${value === "" ? " is-placeholder" : ""}`}>{current?.label ?? ""}</span>
        <span className="select-single-arrow"/>
      </div>
      <div className="select-single-panel">
        <div className="select-single-options">
          {options.map((option) => (
            <div
              key={option.value}
              className={`select-single-option${option.value === value ? " checked" : ""}`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
