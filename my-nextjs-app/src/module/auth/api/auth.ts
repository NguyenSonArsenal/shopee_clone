type LoginPayload = {
  email: string
  password: string
}

type LoginResult = {
  access_token: string
  refresh_token: string
  user: {
    username: string
  }
}

export async function login({ email, password }: LoginPayload): Promise<LoginResult> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })
  const json = await response.json()
  console.log(json, '// json')
  if (!json.success) {
    throw new Error(json.message)
  }
  return json.data
}

type SendOtpPayload = {
  email: string
}

type VerifyOtpPayload = {
  email: string
  otp: string
}

type VerifyOtpResult = {
  reset_token: string
}

export async function sendForgotPasswordOtp({ email }: SendOtpPayload): Promise<boolean> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password/send-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier: email }),
  })
  const json = await response.json()
  if (!json.success) {
    throw new Error(json.message)
  }
  return json.success
}

export async function verifyForgotPasswordOtp({ email, otp }: VerifyOtpPayload): Promise<VerifyOtpResult> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ identifier: email, otp }),
  })
  const json = await response.json()
  if (!json.success) {
    throw new Error(json.message)
  }
  return json.data
}

