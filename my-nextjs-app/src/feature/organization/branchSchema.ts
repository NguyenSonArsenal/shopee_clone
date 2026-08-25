import {z} from "zod";
import {trans} from "@/config/validation";
import {LENGTH} from "@/config/validate-length";
import {isBlank} from "@/helper/helper";

export const branchSchema = z.object({
  name: z.string().min(1, trans('required', 'branch_name')).max(LENGTH.branch.name, trans('max', 'branch_name', {max: LENGTH.branch.name})),
  code: z.string().max(LENGTH.branch.code, trans('max', 'code', {max: LENGTH.branch.code})).nullable().optional(),
  phone: z.string().nullable().optional()
    .refine((v) => isBlank(v) || /^0[0-9]{9}$/.test(v), trans('regex', 'phone')),
  address: z.string().max(LENGTH.branch.address, trans('max', 'address', {max: LENGTH.branch.address})).nullable().optional(),
})

export type BranchFormValues = z.infer<typeof branchSchema>
