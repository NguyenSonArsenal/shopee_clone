type ApiDocItem = {
  id: number
  module: string
  method: string
  url: string
  description: string | null
  curl_example: string | null
  parameters: string | null
  response_sample: string | null
}

type ApiDocListResponse = {
  data: ApiDocItem[]
  pagination: Pagination
}
