import AuthLeftPanel from "@module/auth/component/AuthLeftPanel";
import OtpVerifyForm from "@module/auth/component/OtpVerifyForm";

export default function RegisterVerifyPage() {
  return (
    <div className="login-page">
      <AuthLeftPanel />
      <OtpVerifyForm />
    </div>
  )
}
