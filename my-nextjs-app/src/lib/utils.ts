// Hàm thuần (pure function) dùng chung nhiều nơi, không phụ thuộc React state/hook.

import {createElement, Fragment, ReactNode} from "react";
import {ATTRIBUTES, MESSAGES, VALIDATION_MESSAGES} from "@/config/validation";

type Rule = keyof typeof VALIDATION_MESSAGES
type Attribute = keyof typeof ATTRIBUTES
type VariantType = 'array' | 'file' | 'numeric' | 'string'
type Params = Record<string, string | number>
type MessageKey = keyof typeof MESSAGES

function resolveBrackets(template: string, params: Params) {
  return template.replace(/\[([^\]]*)]/g, (_, block: string) => {
    const placeholders = [...block.matchAll(/:(\w+)/g)].map((m) => m[1])
    const hasAll = placeholders.every((k) => params[k] !== undefined && params[k] !== '')
    return hasAll ? block : ''
  })
}
function interpolate(template: string, params: Params) {
  let msg = resolveBrackets(template, params)
  for (const [k, v] of Object.entries(params)) {
    msg = msg.replace(`:${k}`, String(v))
  }
  return msg.replace(/\s+/g, ' ').trim()
}

/**
 * trans('required', 'mật khẩu')
 * trans('gte', 'password', {value: AUTH_CONFIG.MIN_PASSWORD_LENGTH})
 */
export function trans(
  rule: Rule,
  attribute: Attribute,
  params: Params = {},
  type: VariantType = 'string'
) {
  const entry = VALIDATION_MESSAGES[rule]
  const template = typeof entry === 'string' ? entry : entry[type]
  return interpolate(template, {attribute: ATTRIBUTES[attribute] ?? attribute, ...params})
}

/**
 * To bold
 * transMessage(updated.is_active ? 'activate_success' : 'deactivate_success', { label })
 */
export function transMessage(key: MessageKey, params: Params = {}): ReactNode {
  const msg = resolveBrackets(MESSAGES[key], params)
  const parts: ReactNode[] = []
  let lastIndex = 0
  let match: RegExpExecArray | null
  const regex = /:(\w+)/g
  while ((match = regex.exec(msg))) {
    parts.push(msg.slice(lastIndex, match.index))
    parts.push(createElement('b', { key: match.index }, params[match[1]]))
    lastIndex = match.index + match[0].length
  }
  parts.push(msg.slice(lastIndex))
  return createElement(Fragment, null, ...parts)
}
