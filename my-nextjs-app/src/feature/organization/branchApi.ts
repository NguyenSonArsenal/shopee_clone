import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/organization/branch`,
  detail: (id: string) => `${baseApiUrl}/organization/branch/${id}`,
  update: (id: number) => `${baseApiUrl}/organization/branch/${id}`,
  destroy: (id: number) => `${baseApiUrl}/organization/branch/${id}`,
}

const branchApi = {
  // Trả nguyên res.data (gồm cả data + pagination), khác getDetail vì UI cần pagination.last_page để render số trang
  getList(params: { page: number; search: string; per_page?: number }): Promise<BranchListResponse> {
    return myAxios.get(API_URL.list, { params }).then(res => res.data)
  },
  getDetail(id: string): Promise<Branch> {
    return myAxios.get(API_URL.detail(id)).then(res => res.data.data)
  },
  update(id: number, params: Partial<Branch>): Promise<Branch> {
    return myAxios.put(API_URL.update(id), params).then(res => res.data.data)
  },
  destroy(id: number): Promise<void> {
    return myAxios.delete(API_URL.destroy(id)).then(() => undefined)
  },
}

export default branchApi
