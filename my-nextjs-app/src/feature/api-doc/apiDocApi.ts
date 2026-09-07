import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/api-doc`,
  detail: (id: number) => `${baseApiUrl}/api-doc/${id}`,
  store: `${baseApiUrl}/api-doc`,
  update: (id: number) => `${baseApiUrl}/api-doc/${id}`,
  destroy: (id: number) => `${baseApiUrl}/api-doc/${id}`,
}

const apiDocApi = {
  getList(params: { page: number; search: string; per_page?: number }): Promise<ApiDocListResponse> {
    return myAxios.get(API_URL.list, { params }).then(res => res.data)
  },
  getDetail(id: number): Promise<ApiDocItem> {
    return myAxios.get(API_URL.detail(id)).then(res => res.data.data)
  },
  store(params: Partial<ApiDocItem>): Promise<ApiDocItem> {
    return myAxios.post(API_URL.store, params).then(res => res.data.data)
  },
  update(id: number, params: Partial<ApiDocItem>): Promise<ApiDocItem> {
    return myAxios.put(API_URL.update(id), params).then(res => res.data.data)
  },
  destroy(id: number): Promise<void> {
    return myAxios.delete(API_URL.destroy(id)).then(() => undefined)
  },
}

export default apiDocApi
