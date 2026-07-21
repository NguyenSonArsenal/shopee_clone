import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import RegisterForm from "@feature/auth/page/register";

export default function RegisterPage() {
  return (
    <div className="auth-page register-page">
      <AuthLeftPanel />
      <RegisterForm />
    </div>
  )
}
