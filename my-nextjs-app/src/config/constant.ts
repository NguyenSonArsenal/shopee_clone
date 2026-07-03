export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  USER_INFO: "user_info",
  FLASH_MESSAGE: "flash_message",
} as const;

export const AUTH_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
} as const;
