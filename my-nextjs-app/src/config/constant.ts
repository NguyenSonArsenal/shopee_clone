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

export const DELAY_TIME = 500; // MS
export const MESSAGE_SERVER_ERROR_DEFAULT = "Lỗi hệ thống";
export const TOAST = {
  TYPE: {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info'
  },
  TIMEOUT: 5 // Thời gian hiển thị toast (giây)
} as const;
export type ToastTypeValue = typeof TOAST.TYPE[keyof typeof TOAST.TYPE]


// @todo K nên dùng chữ thường để lưu const, t dùng vì lười viết hoa
export const access_token_timeout = Number(30*60*1000) // (ms) (minute x 60 x 1000)
export const debounced_search_timeout = 500 // ms
export const NO_RECORD_TITLE = 'Chưa có dữ liệu'
export const NO_RECORD_DES = 'Hãy bắt đầu bằng cách thêm mới'
export const LABEL_CREATE = 'Thêm mới'
export const LABEL_ACTIVE = 'Hoạt động'
export const LABEL_INACTIVE = 'Dừng hoạt động'
export const CREATE_CLOSE = 'Đóng'
