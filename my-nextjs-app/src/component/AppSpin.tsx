type AppSpinProps = {
  color?: string
  size?: "small" | "default"
}

/**
 * Spinner thuần CSS, không phụ thuộc antd — tránh vấn đề style antd không
 * inject đúng lúc SSR trong Next.js App Router.
 *
 * @example
 * <AppSpin size="small" color="var(--white)" />
 * <AppSpin color="var(--primary)" />
 */
export default function AppSpin({ color = "var(--white)", size = "default" }: AppSpinProps) {
  const dimension = size === "small" ? 14 : 20
  const borderWidth = size === "small" ? 2 : 3

  return (
    <span
      className="app-spin"
      style={{ width: dimension, height: dimension, borderWidth, color }}
    />
  )
}
