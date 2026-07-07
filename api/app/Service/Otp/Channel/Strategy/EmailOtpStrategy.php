<?php

namespace App\Service\Otp\Channel\Strategy;

use App\Service\Otp\Channel\OtpInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailOtpStrategy implements OtpInterface
{
    public function send(string $destination, string $otp, float|int $ttlMinutes): bool
    {
        Log::info("Email OTP for {$destination}: {$otp} (expires in {$ttlMinutes} minutes)");
        try {
            Mail::raw("Mã OTP của bạn là: {$otp}. Hiệu lực trong {$ttlMinutes} phút.", function ($message) use ($destination) {
                $message->to($destination)
                        ->subject("Mã xác minh OTP");
            });
        } catch (\Exception $e) {
            Log::error("Failed to send OTP email: " . $e->getMessage());
        }

        return true;
    }

    public function getRateLimitKey(string $destination, string $context): string
    {
        return 'otp_rate:email:' . $context . ':' . md5($destination);
    }

    public function getTtlMinutes(): float|int
    {
        return config('config.otp.email.ttl_minutes', 5);
    }

    public function getRateLimitMax(): int
    {
        return config('config.otp.email.rate_limit_max', 3);
    }

    public function getRateLimitMinutes(): int
    {
        return config('config.otp.email.rate_limit_minutes', 10);
    }
}
