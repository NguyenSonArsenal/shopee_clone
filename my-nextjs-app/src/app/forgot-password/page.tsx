import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import ForgotPasswordForm from "@module/auth/component/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <ForgotPasswordForm />
    </div>
  )
}
