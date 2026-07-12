import myAxios from "@/lib/axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  login: `${baseApiUrl}/login`,
  forgot_password_send_otp: `${baseApiUrl}/forgot-password/send-otp`,
  forgot_password_verify_otp: `${baseApiUrl}/forgot-password/verify-otp`,
}

const authApi = {
  login(params: LoginRequest): Promise<LoginResponse> {
    return myAxios.post(API_URL.login, params)
      .then(res => res.data.data)
  },
  forgotPasswordSendOtp(email) {
    return myAxios.post(API_URL.forgot_password_send_otp, {email: email})
      .then(res => res.data.data)
  },
  forgotPasswordVerifyOtp(email, otp) {
    return myAxios.post(API_URL.forgot_password_verify_otp, {email: email, otp:otp})
      .then(res => res.data.data)
  },
}

export default authApi

