import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import OtpVerifyForm from "@feature/auth/page/forgot-password/verify";

export default function RegisterVerifyPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <OtpVerifyForm />
    </div>
  )
}
