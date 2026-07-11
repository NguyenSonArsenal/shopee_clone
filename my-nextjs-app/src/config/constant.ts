export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  FLASH_MESSAGE: "flash_message",
  OTP_TTL: "otp_ttl",
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const USER_ROLES = [
  { value: "f2", label: "Công ty (F2)" },
  { value: "ctv", label: "CTV" },
  { value: "kh", label: "Khách hàng" },
] as const;

