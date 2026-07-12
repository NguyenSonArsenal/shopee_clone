import myAxios from "@/lib/axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  login: `${baseApiUrl}/login`,
  forgot_password_send_otp: `${baseApiUrl}/forgot-password/send-otp`,
  forgot_password_verify_otp: `${baseApiUrl}/forgot-password/verify-otp`,
  forgot_password_reset: `${baseApiUrl}/forgot-password/reset`,
}

const authApi = {
  login(params: LoginRequest): Promise<LoginResponse> {
    return myAxios.post(API_URL.login, params)
      .then(res => res.data.data)
  },
  forgotPasswordSendOtp(email: string): Promise<ForgotPasswordSendOtpResponse> {
    return myAxios.post(API_URL.forgot_password_send_otp, {email: email})
      .then(res => res.data.data)
  },
  forgotPasswordVerifyOtp(email: string, otp: string): Promise<ForgotPasswordVerifyOtpResponse> {
    return myAxios.post(API_URL.forgot_password_verify_otp, {email: email, otp:otp})
      .then(res => res.data.data)
  },
  forgotPasswordReset(reset_token: string, password: string, password_confirmation: string): Promise<null> {
    return myAxios.post(API_URL.forgot_password_reset, {reset_token: reset_token, password: password, password_confirmation:password_confirmation})
      .then(res => res.data.data)
  },
}

export default authApi

