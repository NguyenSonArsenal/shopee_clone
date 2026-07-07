<?php
// app/Mail/OtpMail.php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OtpMail extends Mailable
{
    use Queueable, SerializesModels;

    public string  $otp;
    public string  $siteName;
    public int     $expireMinutes;
    public ?string $name;
    public ?string $actionUrl;

    /**
     * @param  string       $otp            Mã OTP hiển thị.
     * @param  int          $expireMinutes  Số phút mã còn hiệu lực.
     * @param  string|null  $name           Tên người nhận (tùy chọn) — dùng cho lời chào.
     * @param  string|null  $actionUrl      URL nút "Xác nhận ngay" (tùy chọn) — không có thì ẩn nút.
     */
    public function __construct(string $otp, int $expireMinutes = 5, ?string $name = null, ?string $actionUrl = null)
    {
        $this->otp           = $otp;
        $this->expireMinutes = $expireMinutes;
        $this->name          = $name;
        $this->actionUrl     = $actionUrl;
        $this->siteName      = config('app.name', 'CRM');
    }

    public function build(): static
    {
        return $this
            ->subject("Mã xác thực OTP")
            ->view('emails.otp');
    }
}
