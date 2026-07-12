type FieldLabelProps = {
  htmlFor: string
  children: React.ReactNode
  required?: boolean          // mặc định false → không hiện *
  className?: string
}

/**
 * Label dùng chung cho mọi form field.
 *
 * @example
 * <FieldLabel htmlFor="email" required>Email</FieldLabel>
 * <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>   // không bắt buộc → không có *
 */
export default function FieldLabel({
  htmlFor,
  children,
  required = false,
  className = "field-label",
}: FieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className={className}>
      {children} &nbsp;
      {required && <span className="required-star" aria-hidden="true">*</span>}
    </label>
  )
}
