type CompanyUserRef = {
  id: number
  full_name: string
  email: string
} | null

type CompanyListItem = {
  id: number
  name: string
  short_name: string | null
  is_active: boolean
}

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

type CompanyListResponse = {
  data: CompanyListItem[]
  pagination: Pagination
}

type BranchListItem = {
  id: number
  company_id: number | null
  name: string
  code: string | null
  is_active: boolean
}

type BranchListResponse = {
  data: BranchListItem[]
  pagination: Pagination
}

type Branch = {
  id: number
  company_id: number | null
  manager_id: number | null
  receptionist_id: number | null
  name: string
  code: string | null
  address: string | null
  phone: string | null
  is_active: boolean
  company: { id: number; name: string } | null
  manager: CompanyUserRef
  receptionist: CompanyUserRef
}

type Company = {
  id: number
  representative_id: number | null
  manager_id: number | null
  name: string
  short_name: string | null
  tax_code: string | null
  established_date: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  description: string | null
  logo_url: string | null
  is_active: boolean
  representative: CompanyUserRef
  manager: CompanyUserRef
}
