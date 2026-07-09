import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import OtpVerifyForm from "@feature/auth/component/OtpVerifyForm";

export default function RegisterVerifyPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <OtpVerifyForm />
    </div>
  )
}
