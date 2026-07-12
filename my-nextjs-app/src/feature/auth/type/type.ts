type LoginRequest = {
  email: string
  password: string
}

type LoginResponse = {
  access_token: string
  refresh_token: string
  user: {
    username: string
  }
}

type ForgotPasswordSendOtpResponse = {
  otp_expires_at: number
  otp_expires_at_formated: string
}

type ForgotPasswordVerifyOtpResponse = {
  reset_token: string
  reset_token_expires_at: number
}
