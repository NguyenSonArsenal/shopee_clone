// Server component

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AuthLeftPanel from "@/feature/auth/component/AuthLeftPanel";
import OtpVerifyForm from "@feature/auth/page/forgot-password/verify";
import {STORAGE_KEYS} from "@/config/constant";
import {ROUTES} from "@/config/route";

export default async function RegisterVerifyPage() {
  const cookieServer = await cookies()
  const email = cookieServer.get(STORAGE_KEYS.OTP_IDENTIFIER_FIELD)?.value ?? "";
  if (!email) {
    redirect(ROUTES.FORGOT_PASSWORD)
  }
  const expiresAt = cookieServer.get(STORAGE_KEYS.OTP_TTL)?.value;
  const initialTimeLeft = Math.floor(Math.max(0, (expiresAt - Date.now()) / 1000));

  return (
    <div className="login-page">
      <AuthLeftPanel />
      <OtpVerifyForm initialTimeLeft={initialTimeLeft} email={email}/>
    </div>
  )
}
