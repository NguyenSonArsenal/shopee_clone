<?php

namespace App\Service\Otp\Channel;

interface OtpInterface
{
    /**
     * Gửi OTP đến địa chỉ đích (email hoặc phone).
     */
    public function send(string $destination, string $otp, float|int $ttlMinutes): bool;

    /**
     * Cache key cho rate limit — unique theo channel + destination + context.
     * context: 'register', 'forgot', v.v.
     */
    public function getRateLimitKey(string $destination, string $context): string;

    /**
     * Thời gian hiệu lực OTP (phút).
     */
    public function getTtlMinutes(): float|int;

    /**
     * Số lần gửi tối đa trong 1 window.
     */
    public function getRateLimitMax(): int;

    /**
     * Thời gian rate limit window (phút).
     */
    public function getRateLimitMinutes(): int;
}
