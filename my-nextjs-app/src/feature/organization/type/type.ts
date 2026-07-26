type CompanyUserRef = {
  id: string
  full_name: string
  email: string
} | null

type Company = {
  id: string
  representative_id: string | null
  manager_id: string | null
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
