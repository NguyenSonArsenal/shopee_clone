export const LENGTH = {
  user: {
    full_name: 30,
    email: 25,
    phone: 10,
    ref_code: 10,
    password: 20,
    password_confirmation: 20,
    company_name: 64,
  },
  company: {
    name: 50,
    short_name: 10,
    tax_code: 20,
  },
} as const;
