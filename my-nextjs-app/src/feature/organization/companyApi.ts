import myAxios from "@/lib/axios"
import {delay} from "@/helper/helper";

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  detail: (id: string) => `${baseApiUrl}/organization/company/${id}`,
}

const companyApi = {
  getDetail(id: string): Promise<Company> {
    delay(2000)
    return myAxios.get(API_URL.detail(id)).then(res => {
      console.log(res, '// res.data.data')
      return res.data.data
    })
  },
}

export default companyApi
