import myAxios from "@/lib/axios";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  login: `${baseApiUrl}/login`,
}

const authApi = {
  login(params: LoginRequest): Promise<LoginResponse> {
    return myAxios.post(API_URL.login, params)
      .then(res => res.data.data)
  }
}

export default authApi

