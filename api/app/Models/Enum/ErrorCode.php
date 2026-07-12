<?php

namespace App\Models\Enum;

/**
 * Mã lỗi nghiệp vụ cụ thể
 */
enum ErrorCode: string {
    case OTP_MAX_ATTEMPTS = 'OTP_MAX_ATTEMPTS';
    case OTP_EXPIRED = 'OTP_EXPIRED';
    case OTP_NOT_FOUND = 'OTP_NOT_FOUND';
    case RESEND_RATE_LIMITED = 'RESEND_RATE_LIMITED';
}
