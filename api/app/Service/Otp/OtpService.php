<?php

namespace App\Service\Otp;

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
    public function send(OtpInterface $channel, string $destination, string $userId, string $context): array
    {
        // 1. Kiểm tra rate limit (Fixed Window) — tách biệt theo flow
        $rateLimitKey = $channel->getRateLimitKey($destination, $context);
        Cache::add($rateLimitKey, 0, (int) ($channel->getRateLimitMinutes() * 60));
        $sent = (int) Cache::get($rateLimitKey);

        if ($sent >= $channel->getRateLimitMax()) {
            return [
                'success' => false,
                'message' => "Gửi OTP quá nhiều lần. Vui lòng thử lại sau {$channel->getRateLimitMinutes()} phút.",
                'code'    => 429,
            ];
        }

        // 2. Tạo OTP
        $otp = self::genOtp();
        Log::info("Otp: $otp"); // @todo remove in production

        // 3. Gửi qua channel
        try {
            $sentOk = $channel->send($destination, $otp, $channel->getTtlMinutes());
        } catch (\Exception $e) {
                dd($e);
        }
        if (!$sentOk) {
            return [
                'success' => false,
                'message' => 'Không thể gửi mã xác thực. Vui lòng thử lại.',
                'code'    => 500,
            ];
        }

        // 4. Lưu OTP vào cache
        Cache::put(
            'otp:' . $userId,
            ['otp' => Hash::make($otp), 'attempts' => 0],
            (int) ($channel->getTtlMinutes() * 60)
        );

        // 5. Tăng rate limit counter (không reset TTL)
        Cache::increment($rateLimitKey);

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
