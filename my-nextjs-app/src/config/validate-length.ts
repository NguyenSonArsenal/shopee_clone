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
    name: 20,
    short_name: 22,
    tax_code: 16,
    phone: 10,
    email: 10,
    website: 11,
    address: 12,
    description: 40,
  },

  // 'email'        => 10,
  // 'website'      => 11,
  // 'address'      => 12,
  // 'logo_url'     => 13,
  // 'name'         => 14,
  // 'short_name'   => 15,
  // 'phone'        => 10,
  // 'tax_code'     => 16,

} as const;
