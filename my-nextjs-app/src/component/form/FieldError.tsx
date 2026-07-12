type FieldErrorProps = {
  message?: string
}

/**
 * Dòng báo lỗi dùng chung cho mọi form field. Tự ẩn khi không có message.
 *
 * @example
 * <FieldError message={errors.email} />
 */
export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null

  return <p className="field-error">{message}</p>
}
