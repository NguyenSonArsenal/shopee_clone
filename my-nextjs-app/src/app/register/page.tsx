import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import RegisterForm from "@/feature/auth/component/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <RegisterForm />
    </div>
  )
}
