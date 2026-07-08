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
     * Verify OTP — dùng chung cho mọi channel.
     */
    public function verify(string $userId, string $otp): array
    {
        $cacheKey = 'otp:' . $userId;
        $data     = Cache::get($cacheKey);

        if (!$data) {
            return ['success' => false, 'message' => 'Mã xác thực đã hết hạn.', 'code' => 422];
        }

        $maxAttempts = config('config.otp.max_verify_attempts', 5);

        if ($data['attempts'] >= $maxAttempts) {
            Cache::forget($cacheKey);
            return ['success' => false, 'message' => 'Nhập sai quá nhiều lần. Vui lòng yêu cầu mã mới.', 'code' => 429];
        }

        if (!Hash::check($otp, $data['otp'])) {
            $data['attempts']++;
            Cache::put($cacheKey, $data); // giữ nguyên TTL còn lại không đặt lại
            $left = $maxAttempts - $data['attempts'];
            return ['success' => false, 'message' => "Mã xác thực không đúng. Còn {$left} lần thử.", 'code' => 422];
        }

        Cache::forget($cacheKey);
        return ['success' => true, 'message' => 'Thành công'];
    }
}
