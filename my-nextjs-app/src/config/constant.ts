export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  FLASH_MESSAGE: "flash_message",
  OTP_TTL: "otp_ttl",
  OTP_IDENTIFIER_FIELD: "email",
  RESET_TOKEN: "reset_token",
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const DELAY_TIME = 2000; // MS
export const MESSAGE_SERVER_ERROR_DEFAULT = "Lỗi hệ thống";

