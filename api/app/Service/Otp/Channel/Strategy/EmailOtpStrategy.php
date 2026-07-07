<?php

namespace App\Service\Otp\Channel\Strategy;

use App\Mail\OtpMail;
use App\Service\Mail\MailSenderInterface;
use App\Service\Otp\Channel\OtpInterface;

class EmailOtpStrategy implements OtpInterface
{
    /**
     * @param MailSenderInterface $mailSender Strategy gửi mail (Mailtrap/DbSmtp) được bind trong AppServiceProvider.
     */
    public function __construct(private MailSenderInterface $mailSender) {}

    /**
     * Gửi OTP qua email thông qua chuỗi MailSenderInterface (strategy tự áp cấu hình SMTP runtime).
     *
     * @param string    $destination Địa chỉ email nhận OTP.
     * @param string    $otp         Mã OTP cần gửi.
     * @param float|int $ttlMinutes  Số phút mã còn hiệu lực.
     * @return bool                  true nếu gửi thành công.
     */
    public function send(string $destination, string $otp, float|int $ttlMinutes): bool
    {
        return $this->mailSender->send($destination, new OtpMail($otp, (int) $ttlMinutes, $destination));
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
