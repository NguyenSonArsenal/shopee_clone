import myAxios from "@/lib/axios"
import {delay} from "@/helper/helper";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/organization/company`,
  detail: (id: string) => `${baseApiUrl}/organization/company/${id}`,
}

const companyApi = {
  // Trả nguyên res.data (gồm cả data + pagination), khác getDetail vì UI cần pagination.last_page để render số trang
  getList(params: { page: number; search: string }): Promise<CompanyListResponse> {
    return myAxios.get(API_URL.list, { params }).then(res => res.data)
  },
  getDetail(id: string): Promise<Company> {
    return myAxios.get(API_URL.detail(id)).then(res => {
      return res.data.data
    })
  },
}

export default companyApi
