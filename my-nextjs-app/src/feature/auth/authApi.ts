import myAxios from "@/lib/axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  login: `${baseApiUrl}/login`,
  forgot_password_send_otp: `${baseApiUrl}/forgot-password/send-otp`,
}

const authApi = {
  login(params: LoginRequest): Promise<LoginResponse> {
    return myAxios.post(API_URL.login, params)
      .then(res => res.data.data)
  },
  forgotPasswordSendOtp(params) {
    return myAxios.post(API_URL.forgot_password_send_otp, params)
      .then(res => res.data.data)
  }
}

export default authApi

