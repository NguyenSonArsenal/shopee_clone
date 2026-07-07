<?php

namespace App\Service\Otp;

use App\Service\Otp\Channel\OtpInterface;
use App\Service\Otp\Channel\Strategy\EmailOtpStrategy;
use App\Service\Otp\Channel\Strategy\SmsOtpStrategy;

class OtpStrategyFactory
{
    private $emailStrategy;
    private $smsStrategy;

    public function __construct(
        EmailOtpStrategy $emailStrategy,
        SmsOtpStrategy $smsStrategy
    ) {
        $this->emailStrategy = $emailStrategy;
        $this->smsStrategy = $smsStrategy;
    }

    public function make(string $destination): OtpInterface
    {
        if (filter_var($destination, FILTER_VALIDATE_EMAIL)) {
            return $this->emailStrategy;
        }

        return $this->smsStrategy;
    }
}
