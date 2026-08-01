import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/user`,
}

const userApi = {
  getList(): Promise<UserListItem[]> {
    return myAxios.get(API_URL.list).then(res => res.data.data)
  },
}

export default userApi
