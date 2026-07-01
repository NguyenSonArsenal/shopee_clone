type NotificationProps = {
  type: "success" | "error"
  message: string
}

export default function Notification({ type, message }: NotificationProps) {
  if (!message) return null

  return (
    <div className={type === "error" ? "alert alert-danger" : "alert alert-success"}>
      {message}
    </div>
  )
}
