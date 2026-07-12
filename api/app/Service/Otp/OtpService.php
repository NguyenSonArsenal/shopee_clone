<?php

namespace App\Service\Otp;

use App\Models\Enum\HttpStatus;
use App\Models\Otp;
use App\Service\Otp\Channel\OtpInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public static function genOtp()
    {
        return 123456; // @todo remove this line in production
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Gửi OTP qua channel bất kỳ.
     */
    public function send(OtpInterface $channel, string $destination, string $userId, string $purpose): array
    {
        $sent = Otp::where('identifier', $destination)
            ->where('purpose', $purpose)
            ->where('created_at', '>=', now()->subMinutes($channel->getRateLimitMinutes()))
            ->count();
        if ($sent >= $channel->getRateLimitMax()) {
            return [
                'success' => false,
                'message' => "Gửi OTP quá nhiều lần. Vui lòng thử lại sau {$channel->getRateLimitMinutes()} phút.",
                'code'    => HttpStatus::TOO_MANY_REQUESTS->value,
            ];
        }

        // 2. Tạo OTP
        $otp = self::genOtp();
        Log::info("Otp: $otp"); // @todo remove in production

        // 3. Gửi qua channel
//        $sentOk = $channel->send($destination, $otp, $channel->getTtlMinutes());
//        if (!$sentOk) {
//            return [
//                'success' => false,
//                'message' => 'Không thể gửi mã xác thực. Vui lòng thử lại.',
//                'code'    => HttpStatus::INTERNAL_SERVER_ERROR->value,
//            ];
//        }

        // tăng 1 lần gửi otp
        $expiresAt = now()->addMinutes($channel->getTtlMinutes());
        Otp::create([
            'identifier' => $destination,
            'purpose'    => $purpose,
            'code'       => Hash::make($otp),
            'expires_at' => $expiresAt,
        ]);

        $data = [
            'expires_at_formated' => $expiresAt->format(getConfig('format_datetime')),
            'expires_at' => $expiresAt->getTimestamp() * 1000 // x 1000 to convert s (php) to ms (for js using)
        ];
        return ['success' => true, 'message' => 'Thành công', 'data' => $data];
    }

    /**
     * Xác thực OTP — đọc trực tiếp từ bảng `otp`.
     */
    public function verify(string $identifier, string $purpose, string $otp): array
    {
        $row = Otp::where('identifier', $identifier)
            ->where('purpose', $purpose)
            ->latest('id')
            ->first();

        if (!$row) {
            return ['success' => false, 'message' => 'Mã xác thực không tồn tại. Vui lòng gửi lại.', 'code' => HttpStatus::UNPROCESSABLE_ENTITY->value];
        }

        // Đã dùng rồi -> không cho dùng lại (case: OTP dùng 1 lần)
        if ($row->used_at !== null) {
            return ['success' => false, 'message' => 'Mã xác thực đã được sử dụng. Vui lòng gửi lại.', 'code' => HttpStatus::UNPROCESSABLE_ENTITY->value];
        }

        // Hết hạn
        if ($row->expires_at->isPast()) {
            return ['success' => false, 'message' => 'Mã xác thực đã hết hạn. Vui lòng gửi lại.', 'code' => HttpStatus::UNPROCESSABLE_ENTITY->value];
        }

        // Nhập sai quá số lần cho phép -> khóa mã (case: chống brute-force)
        $maxAttempts = (int) config('config.otp.max_verify_attempts', 5);
        if ($row->attempts >= $maxAttempts) {
            return ['success' => false, 'message' => 'Nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.', 'code' => HttpStatus::TOO_MANY_REQUESTS->value];
        }

        // Sai mã -> tăng số lần sai
        if (!Hash::check($otp, $row->code)) {
            $row->increment('attempts');
            $left = $maxAttempts - $row->attempts;

            if ($left <= 0) {
                return ['success' => false, 'message' => 'Bạn đã nhập sai quá số lần cho phép. Vui lòng yêu cầu mã mới.', 'code' => HttpStatus::TOO_MANY_REQUESTS->value];
            }

            return ['success' => false, 'message' => "Mã xác thực không đúng. Còn {$left} lần thử.", 'code' => HttpStatus::UNPROCESSABLE_ENTITY->value];
        }

        // Đúng -> đánh dấu đã dùng để không tái sử dụng
        $row->update(['used_at' => now()]);
        return ['success' => true, 'message' => 'Thành công'];
    }
}
