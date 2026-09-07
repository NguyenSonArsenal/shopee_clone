import {z} from "zod";
import {trans} from "@/lib/utils";
import {LENGTH} from "@/config/validate-length";

export const HTTP_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

export const apiDocSchema = z.object({
  module: z.string().min(1, trans('required', 'module')).max(LENGTH.api_doc.module, trans('max', 'module', {max: LENGTH.api_doc.module})),
  method: z.enum(HTTP_METHODS, {errorMap: () => ({message: trans('required', 'method')})}),
  url: z.string().min(1, trans('required', 'url')).max(LENGTH.api_doc.url, trans('max', 'url', {max: LENGTH.api_doc.url})),
  description: z.string().max(LENGTH.api_doc.description, trans('max', 'description', {max: LENGTH.api_doc.description})).nullable().optional(),
  curl_example: z.string().nullable().optional(),
  parameters: z.string().nullable().optional(),
  response_sample: z.string().nullable().optional(),
})

export type ApiDocFormValues = z.infer<typeof apiDocSchema>
