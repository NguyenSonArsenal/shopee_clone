import {z} from "zod";
import {trans} from "@/lib/utils";
import {LENGTH} from "@/config/validate-length";
import {isBlank} from "@/helper/helper";

export const companySchema = z.object({
  name: z.string().min(1, trans('required', 'name')).max(LENGTH.company.name, trans('max', 'name', {max: LENGTH.company.name})),
  short_name: z.string().max(LENGTH.company.short_name, trans('max', 'short_name', {max: LENGTH.company.short_name})).nullable().optional(),
  tax_code: z.string().nullable().optional(),
  phone: z.string().nullable().optional()
    .refine((v) => isBlank(v) || /^0[0-9]{9}$/.test(v), trans('regex', 'phone')),
  email: z.string().max(LENGTH.company.email, trans('max', 'email', {max: LENGTH.company.email})).nullable().optional()
    .refine((v) => isBlank(v) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), trans('email', 'email')),
  website: z.string().max(LENGTH.company.website, trans('max', 'website', {max: LENGTH.company.website})).nullable().optional()
    .refine((v) => isBlank(v) || /^https?:\/\/.+/.test(v), trans('url', 'website')),
  address: z.string().max(LENGTH.company.address, trans('max', 'address', {max: LENGTH.company.address})).nullable().optional(),
  description: z.string().max(LENGTH.company.description, trans('max', 'description', {max: LENGTH.company.description})).nullable().optional(),
  established_date: z.string().nullable().optional()
    .refine((v) => isBlank(v) || new Date(v) <= new Date(), trans('before_or_equal', 'established_date', {date: 'hôm nay'})),
  representative_id: z.number().nullable().optional(),
  manager_id: z.number().nullable().optional(),
})

export type CompanyFormValues = z.infer<typeof companySchema>
