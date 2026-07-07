<?php

namespace App\Service\Otp\Channel\Strategy;

use App\Service\Otp\Channel\OtpInterface;

class SmsOtpStrategy implements OtpInterface
{
    public function send(string $destination, string $otp, float|int $ttlMinutes): bool
    {
        return true;
    }

    public function getRateLimitKey(string $destination, string $context): string
    {
        return 'otp_rate:phone:' . $context . ':' . md5($destination);
    }

    public function getTtlMinutes(): float|int
    {
        return config('config.otp.phone.ttl_minutes', 5);
    }

    public function getRateLimitMax(): int
    {
        return config('config.otp.phone.rate_limit_max', 3);
    }

    public function getRateLimitMinutes(): int
    {
        return config('config.otp.phone.rate_limit_minutes', 10);
    }
}
