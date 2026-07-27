type Props = {
  label?: string
  loading?: boolean
}

export default function SubmitButton({ label = "Lưu", loading = false }: Props) {
  return (
    <button type="submit" className="btn btn-primary" disabled={loading}>
      <i className="fas fa-floppy-disk"></i> {loading ? "Đang lưu..." : label}
    </button>
  )
}
