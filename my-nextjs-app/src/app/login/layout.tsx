import "./login.scss"   // ← import CSS ở đây, không phải trong page.tsx

export default function LoginLayout({
                                      children,
                                    }: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
