<?php

namespace App\Service\Otp;

use App\Models\Enum\HttpStatus;
use App\Models\Otp;
use App\Service\Otp\Channel\OtpInterface;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class OtpService
{
    public static function genOtp()
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    /**
     * Gửi OTP qua channel bất kỳ.
     * Trả về ['success' => bool, 'message' => string]
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
        Otp::create([
            'identifier' => $destination,
            'purpose'    => $purpose,
            'code'       => Hash::make($otp),
            'expires_at' => now()->addMinutes($channel->getTtlMinutes()),
        ]);


        Cache::put('forgot_password_otp_sent_at:' . $userId, now()->timestamp, 120); // Lưu thời gian gửi để làm countdown ở phía client
        return ['success' => true, 'message' => 'Thành công'];
    }

    /**
     * Xác thực OTP — đọc trực tiếp từ bảng `otp`.
     *
     * @param string $identifier Email/SĐT đã dùng khi gửi OTP
     * @param string $purpose    Mục đích (giá trị của OtpPurpose)
     * @param string $otp        Mã người dùng nhập
     * @return array{success: bool, message: string, code?: int}
     */
    public function verify(string $identifier, string $purpose, string $otp): array
    {
        // Chỉ lấy OTP MỚI NHẤT của (identifier, purpose)
        // -> gửi mã mới thì mã cũ không bao giờ được xét (case: chỉ chấp nhận mã mới nhất)
        $row = Otp::where('identifier', $identifier)
            ->where('purpose', $purpose)
            ->latest('id')
            ->first();

        if (!$row) {
            return ['success' => false, 'message' => 'Mã xác thực không tồn tại. Vui lòng gửi lại.', 'code' => 422];
        }

        // Đã dùng rồi -> không cho dùng lại (case: OTP dùng 1 lần)
        if ($row->used_at !== null) {
            return ['success' => false, 'message' => 'Mã xác thực đã được sử dụng. Vui lòng gửi lại.', 'code' => 422];
        }

        // Hết hạn
        if ($row->expires_at->isPast()) {
            return ['success' => false, 'message' => 'Mã xác thực đã hết hạn. Vui lòng gửi lại.', 'code' => 422];
        }

        // Nhập sai quá số lần cho phép -> khóa mã (case: chống brute-force)
        $maxAttempts = (int) config('config.otp.max_verify_attempts', 5);
        if ($row->attempts >= $maxAttempts) {
            return ['success' => false, 'message' => 'Nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.', 'code' => 429];
        }

        // Sai mã -> tăng số lần sai
        if (!Hash::check($otp, $row->code)) {
            $row->increment('attempts');
            $left = max(0, $maxAttempts - $row->attempts);
            return ['success' => false, 'message' => "Mã xác thực không đúng. Còn {$left} lần thử.", 'code' => 422];
        }

        // Đúng -> đánh dấu đã dùng để không tái sử dụng
        $row->update(['used_at' => now()]);
        return ['success' => true, 'message' => 'Thành công'];
    }
}
