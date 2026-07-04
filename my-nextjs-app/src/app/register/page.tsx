import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import RegisterForm from "@module/auth/component/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <RegisterForm />
    </div>
  )
}
