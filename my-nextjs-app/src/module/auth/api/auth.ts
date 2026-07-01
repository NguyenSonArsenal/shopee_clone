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
