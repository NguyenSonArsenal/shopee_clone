import myAxios from "@/lib/axios"

const baseApiUrl = process.env.NEXT_PUBLIC_API_URL

const API_URL = {
  list: `${baseApiUrl}/organization/region`,
  detail: (id: string) => `${baseApiUrl}/organization/region/${id}`,
  store: (params: number) => `${baseApiUrl}/organization/region`,
  update: (id: number) => `${baseApiUrl}/organization/region/${id}`,
  destroy: (id: number) => `${baseApiUrl}/organization/region/${id}`,
}

const regionApi = {
  getList(params: { page: number; search: string }) {
    return myAxios.get(API_URL.list, { params }).then(res => res.data)
  },
  // getDetail(id: string): Promise<Company> {
  //   return myAxios.get(API_URL.detail(id)).then(res => {
  //     return res.data.data
  //   })
  // },
  // async store(params = []) {
  //   return myAxios.post(API_URL.store(), params).then(res => {
  //     console.log(res, '// ressssss')
  //     return res.data.data
  //   })
  // },
  update(id: number, params){
    console.log(id, params, '//xxx')
    return myAxios.put(API_URL.update(id), params).then(res => {
      return res.data.data
    })
  },
  // destroy(id: number): Promise<void> {
  //   return myAxios.delete(API_URL.destroy(id)).then(() => undefined)
  // },
}

export default regionApi
