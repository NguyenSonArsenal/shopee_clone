import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import ResetPasswordForm from "@/feature/auth/page/forgot-password/reset";
import {cookies} from "next/headers";
import {STORAGE_KEYS} from "@/config/constant";
import {redirect} from "next/navigation";
import {ROUTES} from "@/config/route";

export default async function ForgotPasswordResetPage() {
  const cookieServer = await cookies()
  const reset_token = cookieServer.get(STORAGE_KEYS.RESET_TOKEN)?.value ?? "";

  console.log(reset_token, '// reset_token')

  if (!reset_token) {
    redirect(ROUTES.FORGOT_PASSWORD)
  }

  return (
    <div className="login-page">
      <AuthLeftPanel />
      <ResetPasswordForm />
    </div>
  )
}
