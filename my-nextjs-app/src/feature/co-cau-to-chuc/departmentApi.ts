import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/organization/department`,
  detail: (id: string) => `${baseApiUrl}/organization/department/${id}`,
  update: (id: number) => `${baseApiUrl}/organization/department/${id}`,
  destroy: (id: number) => `${baseApiUrl}/organization/department/${id}`,
}

const departmentApi = {
  // Trả nguyên res.data (gồm cả data + pagination), khác getDetail vì UI cần pagination.last_page để render số trang
  getList(params: { page: number; search: string; per_page?: number }): Promise<DepartmentListResponse> {
    return myAxios.get(API_URL.list, { params }).then(res => res.data)
  },
  update(id: number, params: Partial<DepartmentListItem>): Promise<DepartmentListItem> {
    return myAxios.put(API_URL.update(id), params).then(res => res.data.data)
  },
  destroy(id: number): Promise<void> {
    return myAxios.delete(API_URL.destroy(id)).then(() => undefined)
  },
}

export default departmentApi
