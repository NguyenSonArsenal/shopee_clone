import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import ResetPasswordForm from "@/feature/auth/page/forgot-password/reset";

export default function ForgotPasswordResetPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <ResetPasswordForm />
    </div>
  )
}
