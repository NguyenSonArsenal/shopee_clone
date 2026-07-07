export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
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
  FORGOT_PASSWORD: "/forgot-password",
  FORGOT_PASSWORD_VERIFY: "/forgot-password/verify",
  VERIFY_OTP: "/register/verify",
  PROFILE: "/tai-khoan/ho-so",
  CHANGE_PASSWORD: "/tai-khoan/doi-mat-khau",
  REFERRALS: "/tai-khoan/thanh-vien-gioi-thieu",
  FAVORITES: "/tai-khoan/bds-quan-tam",
  RESET_PASSWORD: "/forgot-password/reset",
} as const;

export const USER_ROLES = [
  { value: "f2", label: "Công ty (F2)" },
  { value: "ctv", label: "CTV" },
  { value: "kh", label: "Khách hàng" },
] as const;

