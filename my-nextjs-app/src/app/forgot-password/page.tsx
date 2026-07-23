import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import ForgotPasswordForm from "@/feature/auth/page/forgot-password";

export default function ForgotPasswordPage() {

  return (
    <div className="auth-page login-page">
      <AuthLeftPanel />
      <ForgotPasswordForm />
    </div>
  )
}
