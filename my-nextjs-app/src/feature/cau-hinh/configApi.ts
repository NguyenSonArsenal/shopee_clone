import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/settings/config`,
}

const configApi = {
  getList(params: { keys?: string[]; group?: string } = {}): Promise<ConfigItem[]> {
    return myAxios.get(API_URL.list, { params }).then(res => res.data.data)
  },
  update(data: Record<string, unknown>): Promise<void> {
    return myAxios.put(API_URL.list, { data }).then(() => undefined)
  },
}

export default configApi
